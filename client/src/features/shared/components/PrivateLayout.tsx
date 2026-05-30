import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';

const PrivateLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden">
      <Navbar />
      
      <main className="flex-1 min-h-0 w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;