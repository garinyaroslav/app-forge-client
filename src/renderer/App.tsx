import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { mainTabValues as v } from './types/mainTabValues';
import { AppLayout } from './pages/AppLayout';
import { Games } from './pages/Games';
import { GameGenres } from './pages/GameGenres';
import { Consumers } from './pages/Consumers';
import { Reviews } from './pages/Reviews';

export const App = () => {
  const navigate = useNavigate();
  const [appTabValue, setAppTabVale] = useState<v>(v.games);

  useEffect(() => {
    switch (appTabValue) {
      case v.games:
        navigate('games');
        break;
      case v.review:
        navigate('reviews');
        break;
      case v.consumers:
        navigate('consumers');
        break;
      case v.carts:
        navigate('carts');
        break;
      case v.cartItems:
        navigate('cartItems');
        break;
      case v.library:
        navigate('librarys');
        break;
      case v.gemeGenres:
        navigate('gameGenres');
        break;
      default:
        break;
    }
  }, [appTabValue]);

  return (
    <Routes>
      <Route
        path="/"
        element={<AppLayout tabVal={appTabValue} setTabVal={setAppTabVale} />}
      >
        <Route path="games" element={<Games />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="consumers" element={<Consumers />} />
        <Route path="carts" element={<Box>4</Box>} />
        <Route path="cartItems" element={<Box>5</Box>} />
        <Route path="librarys" element={<Box>6</Box>} />
        <Route path="gameGenres" element={<GameGenres />} />
      </Route>
    </Routes>
  );
};
