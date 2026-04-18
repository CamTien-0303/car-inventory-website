import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import VehiclesPage from './pages/VehiclesPage';
import WarehousesPage from './pages/WarehousesPage';
import SuppliersPage from './pages/SuppliersPage';
import TransactionsPage from './pages/TransactionsPage';
import StaffPage from './pages/StaffPage';
import VehicleDocumentsPage from './pages/VehicleDocumentsPage';
import ReportsPage from './pages/ReportsPage';
import './App.css'; // Blank to prevent conflict

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="documents" element={<VehicleDocumentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
