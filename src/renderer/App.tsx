import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './pages/AdminLayout';
import { Genres } from './pages/Genres';
import { Consumers } from './pages/Consumers';
import { Reviews } from './pages/Reviews';
import { Libraries } from './pages/Libraries';
import { Carts } from './pages/Carts';
import { CartItems } from './pages/CartItems';
import { Auth } from './pages/Auth';
import { Products } from './pages/Products';
import { RootLayout } from './pages/RootLayout';
import { Store } from './pages/Store';
import { Shop } from './pages/Shop';
import { Library } from './pages/Library';
import { Profile } from './pages/Profile';
import { ProductShopDitails } from './components/ProductShopDitails';

import { mainTabValues as mt } from './types/mainTabValues';
import { StoreTabValues as st } from './types/storeTabValues';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<Auth />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path={mt.products} element={<Products />} />
          <Route path={mt.reviews} element={<Reviews />} />
          <Route path={mt.consumers} element={<Consumers />} />
          <Route path={mt.carts} element={<Carts />} />
          <Route path={mt.cartItems} element={<CartItems />} />
          <Route path={mt.librarys} element={<Libraries />} />
          <Route path={mt.genres} element={<Genres />} />
        </Route>
        <Route path="/user" element={<Store />}>
          <Route path={st.shop} element={<Shop />} />
          <Route
            path={`${st.shop}/:productId`}
            element={<ProductShopDitails />}
          />
          <Route path={st.library} element={<Library />} />
          <Route path={st.profile} element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};
