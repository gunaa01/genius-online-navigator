import { Link } from 'react-router-dom';
import { FC } from 'react';

const Navigation: FC = () => (
  <nav role="navigation" aria-label="Main" className="main-nav">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/docs">Documentation</Link></li>
      <li><Link to="/verify-bst">BST Verification</Link></li>
      <li><Link to="/new-link">New Link</Link></li>
    </ul>
  </nav>
);

export default Navigation;
