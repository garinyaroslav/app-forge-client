import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [games, setGames] = useState<
    { id: number; name: string; email: string }[]
  >([]);

  useEffect(() => {
    window.api
      .getGames()
      .then((fetchedGames: { id: number; name: string; email: string }[]) =>
        setGames(fetchedGames),
      )
      .catch((e: Error) => console.log(e));
  }, []);

  return (
    <div>
      {games.map((game) => (
        <div style={{ backgroundColor: '#fff', color: '#000' }} key={game.id}>
          {JSON.stringify(game)}
        </div>
      ))}
    </div>
  );
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
