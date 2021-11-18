import './App.css';
import { render } from 'react-dom'
import {
  Switch,
  Route
} from "react-router-dom";
import Landing from './Landing/Landing'
import Navbar from './Navbar/Navbar'
import Search from './Search/Search'
import About from './About/About'
import Signup from './Signup/Signup'
import Explore from './Explore/Explore'
import Contact from './Contact/Contact'

function App() {
  return (
    <div className="App">
      <Navbar/>
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/explore" component={Explore}/>
          <Route path="/search" component={Search}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/contact" component={Contact}/>
          <Route path="/" component={Landing}/>
        </Switch>
    </div>
  );
}

export default App;
