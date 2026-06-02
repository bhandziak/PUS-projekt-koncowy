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
    <nav className="bg-zinc-900 border-b border-zinc-800 shadow-lg shadow-sky-950/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to={ROUTES.CHAT} 
              className="text-xl font-black text-sky-400 hover:text-sky-300 tracking-wider transition-colors focus:outline-none"
            >
              ChatIRC
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-zinc-200 leading-tight">
                {user.username || 'Użytkownik'} 
              </div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
                {user.role}
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-zinc-800"></div>

            <button
              onClick={handleLogout}
              className="group cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-zinc-700 rounded-xl text-sm font-bold text-zinc-300 bg-transparent hover:bg-zinc-800 hover:text-sky-400 hover:border-sky-900 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-sky-400 transition-all duration-200"
            >
              <svg 
                className="w-4 h-4 text-zinc-400 group-hover:text-sky-400 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
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