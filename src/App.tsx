import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Index from './pages/Index';
import Bin from './pages/Bin';
import MonsterHunter from './pages/MonsterHunter';
import NotFound from './pages/NotFound';
import { useTheme } from './hooks/useTheme';

/**
 * Layout component that applies the theme hook.
 * This component is rendered inside the router context,
 * allowing useTheme to access useLocation().
 */
function Layout() {
  useTheme(); // Apply theme based on current route
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/bin',
        element: <Bin />,
      },
      {
        path: '/mhitems',
        element: <MonsterHunter />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
