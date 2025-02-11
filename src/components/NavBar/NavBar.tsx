import LogoutIcon from '@mui/icons-material/Logout';
import FetchLogo from '../../assets/fetch-logo.png';
import './NavBar.css';

type NavBarProps = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const NavBar = ({ setIsAuthenticated }: NavBarProps) => {
  const handleLogout = async () => {
    setIsAuthenticated(false);
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
        <button className="logout" onClick={handleLogout}>
          <LogoutIcon />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
