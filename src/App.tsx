import { useState } from 'react';
import './App.css';
import DogsFeed from './components/DogFeed/DogsFeed';
import Login from './components/Login/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {!isAuthenticated && <Login setIsAuthenticated={setIsAuthenticated} />}
      {isAuthenticated && <DogsFeed />}
    </>
  );
}

export default App;
