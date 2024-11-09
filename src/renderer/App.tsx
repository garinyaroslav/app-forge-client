import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './pages/AppLayout';

// function Hello() {
//   useEffect(() => {
//     (async () => {
//       const data = await window.api.getGames();
//       setGames(data);
//     })();
//   }, []);
//   return <div>{JSON.stringify(games)}</div>;
// }

export const App = () => {
  const [appTabValue, setAppTabVale] = useState('GAMES');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AppLayout tabVal={appTabValue} setTabVal={setAppTabVale} />}
        >
          {/*
          <Route path="" element={<Home />} />
            */}
        </Route>
      </Routes>
    </Router>
  );
};
