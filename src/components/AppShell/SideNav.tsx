import { Drawer } from '@progress/kendo-react-layout';
import { useLocation, useNavigate } from 'react-router-dom';

const items = [
  { text: 'Dashboard', route: '/dashboard', icon: 'k-i-home' },
  { text: 'Requests', route: '/requests', icon: 'k-i-grid' },
  { text: 'New Request', route: '/new', icon: 'k-i-plus' },
  { text: 'Settings', route: '/settings', icon: 'k-i-cog' },
];

export default function SideNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <nav aria-label="Side navigation" className="pd-sidenav">
      <Drawer
  expanded
  mode="push"
  position="start"
  width={256}
        items={items.map(i => ({ text: i.text, icon: i.icon, selected: pathname.startsWith(i.route), route: i.route }))}
        onSelect={(e) => { const r = (e.itemTarget as any).props.route; if (r) navigate(r); }}
      />
    </nav>
  );
}
