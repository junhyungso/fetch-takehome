import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import fetchLogo from '../../assets/fetch-logo.png';
import { handleLogin } from '../../utils/api';
import './Login.css';

type LoginProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

const Login = ({
  name,
  setName,
  email,
  setEmail,
  setIsAuthenticated,
}: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleFormSubmit = (e: FormEvent<EventTarget>) => {
    e.preventDefault();
    handleLogin(name, email, setIsLoading, setIsAuthenticated, setLoginError);

    const expirationTime = new Date().getTime() + 3600000; // 1 hour from now
    localStorage.setItem('auth', expirationTime.toString());
  };

  return (
    <div className="background">
      <div className="login-card">
        <div>
          <img src={fetchLogo} alt="fetchlogo" width={100} className="logo" />
        </div>
        <h1 className="login-heading">Fetch Your Dog!</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="input-area">
            <div className="input-line">
              <PersonIcon
                style={{ verticalAlign: 'middle', marginRight: '4px' }}
              />
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
              <EmailIcon
                style={{ verticalAlign: 'middle', marginRight: '4px' }}
              />
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
            <button className="login-button" onClick={handleFormSubmit}>
              {isLoading ? 'Loading...' : 'Login'}
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
