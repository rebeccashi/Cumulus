import './App.css';
import {
  Switch,
  Route,
  useHistory,
  useLocation
} from "react-router-dom";

import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'

import Navbar from './components/Navbar'

import StyleContainer from './components/StyleContainer';
import React from 'react';

function App() {
  const history = useHistory();
  const location = useLocation();

  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname.includes('search') && params.has('q')) {
      setSearchValue(params.get('q'));
    }
  }, [location])

  return (
    <div className="App">
      <StyleContainer theme='default'>
        <Navbar/>
        <Switch>
          <Route path="/search">
            <SearchPage searchValue={searchValue} />
          </Route>
          <Route path="/">
            <LandingPage setSearchValue={(newValue) => {
              history.push(`search?q=${newValue}`)
            }} />
          </Route>
        </Switch>
      </StyleContainer>
    </div>
  );
}

export default App;
