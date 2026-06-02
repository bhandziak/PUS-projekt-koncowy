import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/router/routePaths';
import { useRegister } from '../../features/auth/hooks/useRegister';

const RegisterPage: React.FC = () => {
  const { registerUser, isLoading, error: apiError, isSuccess } = useRegister();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Hasła nie są identyczne.");
      return;
    }

    if (formData.password.length < 5) {
      setValidationError("Hasło musi mieć co najmniej 5 znaków.");
      return;
    }

    const success = await registerUser({
      username: formData.username,
      password: formData.password,
    });

    if (success) {
      setFormData({ username: "", password: "", confirmPassword: "" });
    }
  };

  return (
    <div className="dark-auth-bg">
      <div className="dark-auth-card">
        
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-zinc-100">Rejestracja</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Masz już konto?{' '}
            <Link to={ROUTES.LOGIN} className="dark-auth-link">
              Zaloguj się
            </Link>
          </p>
        </div>

        {isSuccess && (
          <div className="dark-auth-alert-success">
            Rejestracja udana! Możesz się zalogować.
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {(validationError || apiError) && (
            <div className="dark-auth-alert-error">
              {validationError || apiError}
            </div>
          )}

          <div>
            <label htmlFor="username" className="dark-auth-label">Nazwa użytkownika</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="dark-auth-input"
              placeholder="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="dark-auth-label">Hasło</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="dark-auth-input"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="dark-auth-label">Powtórz hasło</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="dark-auth-input"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="dark-auth-btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Rejestracja w sieci...
                </span>
              ) : (
                'Stwórz konto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;