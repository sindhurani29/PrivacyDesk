import { AppBar } from '@progress/kendo-react-layout';

export default function TopBar() {
  return (
    <header className="pd-topbar">
      <a href="#main" className="k-link" style={{ position: 'absolute', left: -9999 }}>
        Skip to content
      </a>
      <AppBar className="px-6">
        <div style={{ padding: '0 16px', fontWeight: 800, fontSize: 20 }} className="font-extrabold text-lg">PrivacyDesk</div>
        <div style={{ marginLeft: 'auto', paddingRight: 12 }} className="flex items-center gap-3">
          <span aria-label="User" title="User" style={{ opacity: .6 }}>︙</span>
        </div>
      </AppBar>
    </header>
  );
}
