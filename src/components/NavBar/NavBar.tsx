import LogoutIcon from '@mui/icons-material/Logout';
import FetchLogo from '../../assets/fetch-logo.png';
import { handleLogout } from '../../utils/api';
import './NavBar.css';

type NavBarProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const NavBar = ({ setIsAuthenticated }: NavBarProps) => {
  const handleLogoutClicked = async () => {
    setIsAuthenticated(false);
    handleLogout();
  };

  return (
    <div className="navbar">
      <img
        src={FetchLogo}
        alt="fetch-logo"
        width={200}
        className="fetch-logo"
      />
      <nav>
        <button className="logout" onClick={handleLogoutClicked}>
          <LogoutIcon sx={{ marginRight: '4px' }} />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
