import LogoutIcon from '@mui/icons-material/Logout';
import FetchLogo from '../../assets/fetch-logo.png';
import { handleLogout } from '../../utils/api';
import styles from './NavBar.module.css';

type NavBarProps = {
  name: string;
  email: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const NavBar = ({ name, email, setIsAuthenticated }: NavBarProps) => {
  const handleLogoutClicked = async () => {
    setIsAuthenticated(false);
    handleLogout(name, email);
    localStorage.removeItem('auth');
  };

  return (
    <div className={styles.navbar}>
      <img
        src={FetchLogo}
        alt="fetch-logo"
        width={200}
        className={styles.fetchLogo}
      />
      <nav>
        <button className={styles.logout} onClick={handleLogoutClicked}>
          <LogoutIcon sx={{ marginRight: '4px' }} />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
