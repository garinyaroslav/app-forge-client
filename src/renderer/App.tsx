import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Hello() {
  const [games, setGames] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await window.api.getGames();
      setGames(data);
    })();
  }, []);
  return <div>{JSON.stringify(games)}</div>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
