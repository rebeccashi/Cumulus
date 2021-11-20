import './App.css';
import { render } from 'react-dom'
import {
  Switch,
  Route
} from "react-router-dom";
import Landing from './Landing/Landing'
import Navbar from './Navbar/Navbar'
import Users from './Users/Users'
import About from './About/About'

import StyleContainer from './components/StyleContainer';

function App() {
  return (
    <div className="App">
      <StyleContainer theme='default'>
        <Navbar/>
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/users" component={Users}/>
          <Route path="/" component={Landing}/>
        </Switch>
      </StyleContainer>
    </div>
  );
}

export default App;
