import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import EditPage from './pages/EditPage/EditPage';
import MainNavbar from './components/MainNavbar/MainNavbar';
import { useState } from 'react';
import usersJSON from './data/users.json'
import UserModel from './model/UserModel';
import Header from './components/Header/Header';

function App() {
  const [users, setUsers] = useState(usersJSON.map(plainUser => new UserModel(plainUser)));
  const [activeUser, setActiveUser] = useState(users[0]);

  function handleLogout() {
    setActiveUser(null);
  }

  return (
    <div className="app">
      <Header></Header>
      <MainNavbar activeUser={activeUser} onLogout={handleLogout}/>
      <HashRouter>
        <Switch>
          <Route exact path="/" >
            <HomePage />
          </Route>
          <Route exact path="/about"><AboutPage /></Route>
          <Route exact path="/edit"><EditPage /></Route>
          {/* <Route exact path="/edit" >
            <EditPage activeUser={activeUser}/>
          </Route> */}
          <Route exact path="/contact"><ContactPage /></Route>
          <Route exact path="/login"><LoginPage  activeUser={activeUser} users={users} onLogin={user => setActiveUser(user)}/></Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
