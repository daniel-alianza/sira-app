import { createBrowserRouter, RouterProvider } from 'react-router';
import { ProtectedRouter } from './ProtectedRouter';
import { MenuRouter } from './MenuRouter';

const router = createBrowserRouter([...ProtectedRouter, ...MenuRouter]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
