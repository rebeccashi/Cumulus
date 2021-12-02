import "./App.css";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage";
import SignInPage from "./pages/SignInPage";

import Navbar from "./components/Navbar";

import StyleContainer from "./components/StyleContainer";
import React from "react";

function App() {
  const history = useHistory();
  const location = useLocation();

  const [searchValue, setSearchValue] = React.useState("");
  const [selectedObject, setSelectedObject] = React.useState(null);

  React.useEffect(() => {
    setSearchValue("");
    setSelectedObject(null);

    const params = new URLSearchParams(location.search);
    if (location.pathname.includes("search") && params.has("q")) {
      setSearchValue(params.get("q"));
    }

    if (location.pathname.includes("overview") && params.has("name")) {
      setSelectedObject({ name: params.get("name") });
    }
  }, [location]);

  return (
    <div className="App">
      <StyleContainer theme="default">
        <Navbar />
        <Switch>
          <Route path="/search">
            <SearchPage
              searchValue={searchValue}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          </Route>
          <Route path="/overview">
            <SearchPage
              searchValue={searchValue}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          </Route>
          <Route path="/signin">
            <SignInPage />
          </Route>
          <Route path="/">
            <LandingPage
              setSearchValue={(newValue) => {
                history.push(`search?q=${newValue}`);
              }}
            />
          </Route>
        </Switch>
      </StyleContainer>
    </div>
  );
}

export default App;
