import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Horizon</div>
        <nav>
          {/* Navigation items would go here */}
        </nav>
      </header>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        <p>&copy; {new Date().getFullYear()} Horizon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
