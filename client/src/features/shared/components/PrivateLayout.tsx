import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';

const PrivateLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;