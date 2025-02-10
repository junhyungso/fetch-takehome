import { useState } from 'react';
import './App.css';
import DogsFeed from './pages/DogFeed/DogsFeed';
import Login from './pages/Login/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app">
      {!isAuthenticated && <Login setIsAuthenticated={setIsAuthenticated} />}
      {isAuthenticated && <DogsFeed setIsAuthenticated={setIsAuthenticated} />}
    </div>
  );
}

export default App;
