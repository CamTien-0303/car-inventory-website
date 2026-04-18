import React from 'react';
import { Activity } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Activity size={16} />
        <span>Car Inventory Management System</span>
      </div>
      <div className="header-right" />
    </header>
  );
};

export default Header;
