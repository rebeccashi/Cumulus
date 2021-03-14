import './App.css';
import { render } from 'react-dom'
import {
  Switch,
  Route
} from "react-router-dom";
import Landing from './Landing/Landing'
import Navbar from './Navbar/Navbar'

function App() {
  return (
    <div className="App">
      <Navbar/>
        <Switch>
          <Route path="/" component={Landing}/>

        </Switch>
    </div>
  );
}

export default App;
