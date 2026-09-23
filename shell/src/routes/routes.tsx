import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { MFEErrorBoundary } from '../components/ErrorBoundary';
import { LazyMFE } from '../components/LazyMFE';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import SpvCaDashboard from '../pages/SpvCaDashboard';
import RolePortalDashboard from '../pages/RolePortalDashboard';
import NotFound from '../pages/NotFound';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '@template/shared';

// Component for intelligent role-based redirection
const RoleRedirect: React.FC = () => {
  const { user } = useAuth();
  const roles = user?.roles || [];

  if (roles.includes('de')) {
    return <Navigate to="/data-entry" replace />;
  }
  
  if (roles.includes('ca')) {
    return <Navigate to="/credit-analyst" replace />;
  }
  if (roles.includes('mailingroom')) {
    return <Navigate to="/initial-data-entry" replace />;
  }
  if (roles.includes('pemimpin')) {
    return <Navigate to="/pemimpin" replace />;
  }
  if (roles.includes('adc')) {
    return <Navigate to="/adc" replace />;
  }
  return <Navigate to="/initial-data-entry" replace />;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* DATA ENTRY (PROCESSING): Remote MFE Terpisah di Port 5008 */}
        <Route
          path="/data-entry/*"
          element={
            <MFEErrorBoundary mfeName="Data Entry (DE)">
              <LazyMFE
                scope="dataEntryMFE"
                module="./Module"
                url={(window as any)._env?.getMfeUrl?.('dataEntryMfe') || 'http://localhost:5008/remoteEntry.js'}
                basePath="/data-entry"
              />
            </MFEErrorBoundary>
          }
        />

        

        {/* Role Portals for other officers */}
        <Route path="/credit-analyst" element={<RolePortalDashboard roleCode="ca" />} />
        <Route path="/mailing-room" element={<RolePortalDashboard roleCode="mailingroom" />} />
        <Route path="/pemimpin" element={<RolePortalDashboard roleCode="pemimpin" />} />
        <Route path="/adc" element={<RolePortalDashboard roleCode="adc" />} />

        {/* Static MFE routes - configure your child MFEs here */}
        <Route
          path="/father/*"
          element={
            <MFEErrorBoundary mfeName="father MFE">
              <LazyMFE
                scope="fatherMFE"
                module="./Module"
                url={(window as any)._env?.getMfeUrl?.('fatherMfe') || 'http://localhost:5005/remoteEntry.js'}
                basePath="/father"
              />
            </MFEErrorBoundary>
          }
        />
        <Route
          path="/initial-data-entry/*"
          element={
            <MFEErrorBoundary mfeName="Initial Data Entry (IDE)">
              <LazyMFE
                scope="initialDataEntryMFE"
                module="./Module"
                url={(window as any)._env?.getMfeUrl?.('initialDataEntryMfe') || 'http://localhost:5007/remoteEntry.js'}
                basePath="/initial-data-entry"
              />
            </MFEErrorBoundary>
          }
        />
      </Route>

      {/* Redirect unauthenticated to login */}
      <Route
        path="*"
        element={
          isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

