import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { mainTabValues as v } from './types/mainTabValues';
import { AppLayout } from './pages/AppLayout';
import { Games } from './pages/Games';

export const App = () => {
  const navigate = useNavigate();
  const [appTabValue, setAppTabVale] = useState<v>(v.games);

  useEffect(() => {
    switch (appTabValue) {
      case v.games:
        navigate('games');
        break;
      case v.review:
        navigate('review');
        break;
      case v.consumers:
        break;
      case v.carts:
        break;
      case v.cartItems:
        break;
      case v.library:
        break;
      case v.gemeGenres:
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
        <Route path="gameGanre" element={<Box>456</Box>} />
        <Route path="games" element={<Box>123</Box>} />
        <Route path="games" element={<Box>123</Box>} />
        <Route path="games" element={<Box>123</Box>} />
      </Route>
    </Routes>
  );
};
