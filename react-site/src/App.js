import './App.css';
import {
  Switch,
  Route
} from "react-router-dom";

import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'

import Navbar from './components/Navbar'
import Users from './Users/Users'
import About from './About/About'

import StyleContainer from './components/StyleContainer';

function App() {
  return (
    <div className="App">
      <StyleContainer theme='default'>
        <Navbar/>
        <Switch>
          <Route path="/search" component={SearchPage}/>
          <Route path="/" component={LandingPage}/>
        </Switch>
      </StyleContainer>
    </div>
  );
}

export default App;
