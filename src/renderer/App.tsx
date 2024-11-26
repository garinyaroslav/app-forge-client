import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './pages/AdminLayout';
import { Games } from './pages/Games';
import { GameGenres } from './pages/GameGenres';
import { Consumers } from './pages/Consumers';
import { Reviews } from './pages/Reviews';
import { Libraries } from './pages/Libraries';
import { Carts } from './pages/Carts';
import { CartItems } from './pages/CartItems';
import { Auth } from './pages/Auth';
import { RootLayout } from './pages/RootLayout';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<Auth />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="games" element={<Games />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="carts" element={<Carts />} />
          <Route path="cartItems" element={<CartItems />} />
          <Route path="libraries" element={<Libraries />} />
          <Route path="gameGenres" element={<GameGenres />} />
        </Route>
        <Route path="/user" />
      </Route>
    </Routes>
  );
};
