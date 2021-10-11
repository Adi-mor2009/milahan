import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  return (
    <div className="app">
       <HashRouter>
        <Switch>
          <Route exact path="/" ><HomePage/></Route>
          <Route exact path="/login"><LoginPage/></Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
