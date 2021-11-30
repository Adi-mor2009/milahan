import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import AboutPage from './pages/AboutPage/AboutPage';
import BookPage from './pages/BookPage/BookPage';
import ContactPage from './pages/ContactPage/ContactPage';
import EditPage from './pages/EditPage/EditPage';
import MainNavbar from './components/MainNavbar/MainNavbar';
import { useEffect, useState } from 'react';
import usersJSON from './data/users.json'
import UserModel from './model/UserModel';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);//useState(usersJSON.map(plainUser => new UserModel(plainUser)));
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const getURL = "http://localhost:8080/users";
    axios.get(getURL).then(respose => {
      console.log(respose.data);
      const data = respose.data;
      debugger
      setUsers(data.map((plainUser) => new UserModel(plainUser)));
    })
  }, [])
  useEffect(() => {
    const fromStorage = JSON.parse(localStorage.getItem('activeUser'));
    fromStorage ? setActiveUser(fromStorage) : console.log("No data in local storage");
  }, []);
  useEffect(() => {
    localStorage.removeItem('activeUser');
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
  }, [activeUser]);

  function handleLogout() {
    setActiveUser(null);
    localStorage.removeItem('activeUser');
  }

  return (
    <div className="app">
      <Header></Header>
      <MainNavbar activeUser={activeUser} onLogout={handleLogout}/>
      <HashRouter>
        <Switch>
          <Route exact path="/" >
            <HomePage activeUser={activeUser}/>
          </Route>
          <Route exact path="/book"><BookPage activeUser={activeUser}/></Route>
          <Route exact path="/about"><AboutPage /></Route>
          <Route exact path="/edit"><EditPage /></Route>
          {/* <Route exact path="/edit" >
            <EditPage activeUser={activeUser}/>
          </Route> */}
          <Route exact path="/contact"><ContactPage /></Route>
          <Route exact path="/login"><LoginPage  activeUser={activeUser} users={users} onLogin={user => setActiveUser(user)}/></Route>
        </Switch>
      </HashRouter>
      <Footer></Footer>
    </div>
  );
}

export default App;
