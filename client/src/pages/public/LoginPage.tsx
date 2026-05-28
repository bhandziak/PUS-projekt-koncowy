import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/router/routePaths';
import { useLogin } from '../../features/auth/hooks/useLogin';

const LoginPage = () => {
  const { loginUser, isLoading, error: apiError } = useLogin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.username || !formData.password) {
      setValidationError("Wszystkie pola są wymagane.");
      return;
    }

    try {
      await loginUser({
        username: formData.username,
        password: formData.password,
      });
      
      navigate(ROUTES.CHAT);
    } catch (err) {
    }
  };

  return (
    <div className="dark-auth-bg">
      <div className="dark-auth-card">
        
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-zinc-100">Logowanie</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Nie masz jeszcze konta?{' '}
            <Link to={ROUTES.REGISTER} className="dark-auth-link">
              Zarejestruj się
            </Link>
          </p>
        </div>

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
              placeholder="NeonGhost"
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="dark-auth-btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uwierzytelnianie...
                </span>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;