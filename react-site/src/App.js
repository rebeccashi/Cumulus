import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Landing from './Landing/Landing'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Cumulus</Link>
              </li>
              <li>
                <Link to="/users">Pricing</Link>
              </li>
              <li>
                <Link to="/about">About us</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/">
              <Landing />
            </Route>

            {/* <Route path="/pricing">
              <Pricing />
            </Route>
          */}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
