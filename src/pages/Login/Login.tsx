import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import fetchLogo from '../../assets/fetch-logo.png';
import './Login.css';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

type LoginProps = {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { name, email },
        { withCredentials: true }
      );
      if (response.data === 'OK') {
        setIsAuthenticated(true);
      }
    } catch (e: unknown) {
      const errorMessage = e.message;
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">
      <div className="login-card">
        <div>
          <img src={fetchLogo} alt="fetchlogo" width={100} className="logo" />
        </div>
        <h2>Fetch Your Dog</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="input-area">
            <div className="input-line">
              <PersonIcon />
              <label>Name: </label>
              <input
                required
                className="info-input"
                placeholder="John"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="input-line">
              <EmailIcon />
              <label>Email: </label>
              <input
                required
                className="info-input"
                placeholder="john1234@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <input type="checkbox" />
              remember me
            </div>
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </form>

        {loginError && (
          <p className="error-message">
            Authentication failed. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
