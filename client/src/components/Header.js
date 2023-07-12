import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../images/logo.png';
import { BsList } from 'react-icons/bs';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="header">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="menu-icon" onClick={handleMenuToggle}>
          {!menuOpen && <BsList style={{ color: '#25807A' }} />}
        </div>

        {menuOpen && <div className="shade" onClick={handleMenuToggle}></div>}

        <ul className={menuOpen ? 'menu-items open' : 'menu-items'}>
          <li onClick={handleSearchMenuClick}>
            <Link className="title" to="/">
              search
            </Link>
          </li>
          <li onClick={handleMenuToggle}>
            <Link className="title" to="/bookmark">
              bookmark
            </Link>
          </li>
          <li onClick={handleMenuToggle}>
            <Link className="title" to="/recommended">
              recommended
            </Link>
          </li>
          <li onClick={handleMenuToggle}>
            <Link className="title" to="/profile">
              my profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
