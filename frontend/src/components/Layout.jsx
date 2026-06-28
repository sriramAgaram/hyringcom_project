import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TabMenu } from 'primereact/tabmenu';
import { ConfirmDialog } from 'primereact/confirmdialog';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: 'Cards Board', icon: 'pi pi-fw pi-table', command: () => navigate('/') },
    { label: 'Global History', icon: 'pi pi-fw pi-history', command: () => navigate('/history') }
  ];

  const activeIndex = location.pathname === '/history' ? 1 : 0;

  return (
    <div className="min-h-screen surface-ground flex flex-col">
      <ConfirmDialog />
      <div className="bg-white border-bottom-1 border-300">
        <TabMenu model={items} activeIndex={activeIndex} className="pt-2 px-4 shadow-sm" />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
