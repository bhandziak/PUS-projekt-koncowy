import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../app/router/routePaths';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext || !authContext.user) return null;

  const { user, logout } = authContext;

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  
    setTimeout(() => {
        logout();
    }, 10);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to={ROUTES.HOME} className="text-xl font-black text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none">
              NoteApp
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-tight">
                {user.username || 'Użytkownik'} 
              </div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mt-0.5">
                {user.role}
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

            <button
              onClick={handleLogout}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Wyloguj</span>
            </button>
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;