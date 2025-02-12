import { useState } from 'react';
import './App.css';
import DogsFeed from './pages/DogFeed/DogsFeed';
import Login from './pages/Login/Login';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app">
      {!isAuthenticated && (
        <Login
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      {isAuthenticated && (
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
