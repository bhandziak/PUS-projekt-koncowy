import { Link } from 'react-router-dom';
import { ROUTES } from '../../../app/router/routePaths';

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">403</h1>
        <h2 className="text-3xl font-bold text-gray-900">Dostęp zabroniony</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Twoje konto nie posiada odpowiednich uprawnień, aby przeglądać tę stronę.
        </p>
        <div className="pt-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Wróć do aplikacji
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;