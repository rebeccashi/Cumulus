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

function App() {
  return (
    <div className="App">
      <Navbar/>
        <Switch>
          <Route path="/" component={Landing}/>
          <Route path="/users" component={Users}/>
          <Route path="/about" component={About}/>
        </Switch>
    </div>
  );
}

export default App;
