import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { mainTabValues as v } from './types/mainTabValues';
import { AppLayout } from './pages/AppLayout';
import { Games } from './pages/Games';
import { GameGenres } from './pages/GameGenres';
import { Consumers } from './pages/Consumers';
import { Reviews } from './pages/Reviews';
import { Libraries } from './pages/Libraries';
import { Carts } from './pages/Carts';
import { CartItems } from './pages/CartItems';

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
        navigate('libraries');
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
        <Route path="carts" element={<Carts />} />
        <Route path="cartItems" element={<CartItems />} />
        <Route path="libraries" element={<Libraries />} />
        <Route path="gameGenres" element={<GameGenres />} />
      </Route>
    </Routes>
  );
};
