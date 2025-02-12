import { useEffect, useState } from 'react';
import './App.css';
import DogsFeed from './pages/DogFeed/DogsFeed';
import Login from './pages/Login/Login';
import { handleLogout } from './utils/api';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const expirationTime = localStorage.getItem('auth') || '0';

  useEffect(() => {
    if (expirationTime !== '0') {
      setIsAuthenticated(true);
    }

    const interval = setInterval(() => {
      //check if token expired every minute
      if (new Date().getTime() > parseInt(expirationTime)) {
        setIsAuthenticated(false);
        handleLogout(name, email);
        localStorage.removeItem('auth');
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [name, email, expirationTime]);

  return (
    <div className="app">
      {!isAuthenticated && expirationTime === '0' && (
        <Login
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      {isAuthenticated && expirationTime !== '0' && (
        <DogsFeed
          name={name}
          email={email}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
    </div>
  );
}

export default App;
