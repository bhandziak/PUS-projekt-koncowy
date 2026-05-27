import { Link } from 'react-router-dom';
import { ROUTES } from '../../../app/router/routePaths';

const DefaultPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-9xl font-extrabold text-gray-300 tracking-widest">404</h1>
        <h2 className="text-3xl font-bold text-gray-900">Zagubiłeś się?</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Strona, której szukasz, nie istnieje, została usunięta lub jej nazwa uległa zmianie.
        </p>
        <div className="pt-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;