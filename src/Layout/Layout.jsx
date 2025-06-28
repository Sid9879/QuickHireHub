import React from 'react';
import Navbar from '../Mycomponents/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="pt-20 px-4 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
