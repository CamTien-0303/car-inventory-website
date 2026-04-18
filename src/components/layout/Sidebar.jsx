import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Car,
  Warehouse,
  Users,
  ArrowRightLeft,
  UserSquare2,
  FileText,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const mainMenu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
  ];

  const catalogMenu = [
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Warehouses', path: '/warehouses', icon: Warehouse },
    { name: 'Suppliers', path: '/suppliers', icon: Users },
  ];

  const adminMenu = [
    { name: 'Staff', path: '/staff', icon: UserSquare2 },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  const renderLinks = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Icon size={18} />
          <span>{item.name}</span>
        </NavLink>
      );
    });

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Car size={20} />
        </div>
        <span className="sidebar-brand-text">Car Inventory</span>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">Main</div>
        {renderLinks(mainMenu)}
        <div className="sidebar-section">Catalog</div>
        {renderLinks(catalogMenu)}
        <div className="sidebar-section">Admin</div>
        {renderLinks(adminMenu)}
      </nav>
    </aside>
  );
};

export default Sidebar;
