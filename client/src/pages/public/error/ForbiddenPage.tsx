import { Link } from 'react-router-dom';
import { ROUTES } from '../../../app/router/routePaths';

const ForbiddenPage = () => {
  return (
    <div className="dark-auth-bg px-4">
      <div className="dark-auth-card flex flex-col items-center text-center space-y-4">
        
        <h1 className="text-8xl font-black text-sky-400 tracking-widest select-none drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          403
        </h1>
        
        <h2 className="text-2xl font-bold text-zinc-100">Dostęp zabroniony</h2>
        
        <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
          Twoje konto nie posiada odpowiednich uprawnień, aby przeglądać tę stronę.
        </p>
        
        <div className="pt-4 w-full">
          <Link
            to={ROUTES.HOME}
            className="dark-auth-btn-primary inline-block text-center"
          >
            Wróć do aplikacji
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForbiddenPage;