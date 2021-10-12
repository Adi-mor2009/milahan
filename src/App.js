import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import MainNavbar from './components/MainNavbar/MainNavbar';
import { useState } from 'react';

function App() {
  const [activeUser, setActiveUser] = useState({id:"1", name:"Adi Mor", email:"adi@adi.com", role:"admin"});
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
          <Route exact path="/login"><LoginPage /></Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
