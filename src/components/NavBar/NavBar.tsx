import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import FetchLogo from '../../assets/fetch-logo.png';
import './NavBar.css';

type NavBarProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const NavBar = ({ setIsAuthenticated }: NavBarProps) => {
  const handleLogout = async () => {
    setIsAuthenticated(false);
  };
  const navigate = useNavigate();

  const handleRouteHome = () => {
    navigate('/');
  };
  return (
    <div className="navbar">
      <img
        src={FetchLogo}
        alt="fetch-logo"
        width={200}
        className="fetch-logo"
        onClick={handleRouteHome}
      />
      <nav>
        <button className="logout" onClick={handleLogout}>
          <LogoutIcon />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
