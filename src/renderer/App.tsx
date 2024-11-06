import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [users, setUsers] = useState<
    { id: number; name: string; email: string }[]
  >([]);

  useEffect(() => {
    window.api
      .getUsers()
      .then((fetchedUsers: { id: number; name: string; email: string }[]) =>
        setUsers(fetchedUsers),
      )
      .catch((e: Error) => console.log(e));
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{JSON.stringify(user)}</div>
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
