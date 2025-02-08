import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
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

  const validateCredentials = () => {
    // if (
    //   name.length >= 2 &&
    //   email.includes('@') &&
    //   email.includes('.') &&
    //   email.length >= 3
    // ) {
    //   return true;
    // }
    // return false;
    return true;
  };

  const handleLogin = async () => {
    const isValid = validateCredentials();
    if (!isValid) return; //TODO: show credential errors
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
    <>
      <div className="login-card">
        <div className="input-area">
          <div>
            <label>Name: </label>
            <input
              placeholder="John"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              placeholder="john1234@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>

        {loginError && <p>{loginError}</p>}
      </div>
    </>
  );
};

export default Login;
