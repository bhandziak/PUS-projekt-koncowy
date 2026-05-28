import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/router/routePaths';
import { useHello } from '../../features/handshake/hooks/useHello';

export default function HomePage() {
  const navigate = useNavigate();
  const { isHandshakeComplete, serverMessage, error, isLoading } = useHello();

  return (
    <div className="dark-auth-bg">
      <div className="dark-auth-card flex flex-col items-center text-center">
        
        <div className="mb-2 h-8 flex items-center justify-center">
          {isLoading ? (
            <div className="dark-status-loading">
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Nawiązywanie połączenia...
            </div>
          ) : error ? (
            <div className="dark-auth-alert-error py-1.5 px-3">
              Krytyczny błąd: {error}
            </div>
          ) : (
            <div className="dark-status-success">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              {serverMessage || "System Online"}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-100 mb-4">
            Chat IRC - <span className="text-sky-400">Omega &Omega;</span>
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Aplikacja implementuje system czatu internetowego w czasie rzeczywistym w modelu klient-serwer.
            Jej działanie opiera się na implementacji własnego protokołu bazującego na WebSocket. 
            Aplikacja uwzględnia rejestrację, logowanie, wykorzystanie tokenów sesji, system ról i pokoi, 
            utrzymywanie stanu sesji. 
          </p>
        </div>

        <div className="w-full space-y-3 mt-8 pt-4 border-t border-zinc-800/50">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            disabled={!isHandshakeComplete || isLoading}
            className="dark-auth-btn-primary"
          >
            Logowanie
          </button>
          
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            disabled={!isHandshakeComplete || isLoading}
            className="dark-auth-btn-secondary"
          >
            Rejestracja
          </button>
        </div>

      </div>
    </div>
  );
}