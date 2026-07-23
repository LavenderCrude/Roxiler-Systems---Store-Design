import Navbar from './Navbar';

export default function Layout({ children, title, actions }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {(title || actions) && (
          <div className="page-header">
            {title && <h1>{title}</h1>}
            {actions && <div className="page-actions">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
