import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import MainNavbar from './components/MainNavbar/MainNavbar';
import { useState } from 'react';
import usersJSON from './data/users.json'
import UserModel from './model/UserModel';

function App() {
  const [users, setUsers] = useState(usersJSON.map(plainUser => new UserModel(plainUser)));
  const [activeUser, setActiveUser] = useState(users[0]);
  return (
    <div className="app">
      <HashRouter>
        <Switch>
          <Route exact path="/" >
            <MainNavbar activeUser={activeUser} onLogout={() => setActiveUser(null)}/>
            <HomePage />
          </Route>
          <Route exact path="/about"><AboutPage /></Route>
          <Route exact path="/contact"><ContactPage /></Route>
          <Route exact path="/login"><LoginPage  activeUser={activeUser} users={users} onLogin={user => setActiveUser(user)}/></Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
