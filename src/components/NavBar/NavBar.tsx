import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import FetchLogo from '../../assets/fetch-logo.png';
import './NavBar.css';

const NavBar = () => {
  // Logout user with backend and execute logout method to remove items from local storage
  const handleLogout = async () => {};
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
        <button onClick={handleLogout}>
          <LogoutIcon />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default NavBar;
