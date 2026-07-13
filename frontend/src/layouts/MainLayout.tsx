import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
