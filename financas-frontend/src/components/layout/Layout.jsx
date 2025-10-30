import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="ml-0 lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default Layout;