import React from "react";

import { useHistory, useLocation } from "react-router-dom";

import "./SearchPage.css";

import ResultsPage from "../ResultsPage";

import Input from "../../components/Input";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import { OverviewPage } from "../OverviewPage/OverviewPage";

export const SearchPage = ({
  searchValue,
  selectedObject,
  setSelectedObject,
}) => {
  const [autocomplete, setAutocomplete] = React.useState("");
  const [query, setQuery] = React.useState("");

  const history = useHistory();
  const location = useLocation();

  const emptyData = {
    query: "",
    results: [],
  };
  const [data, setData] = React.useState(emptyData);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      selectedObject != null &&
      (!params.has("name") ||
        (params.has("name") && params.get("name") != selectedObject.name))
    )
      history.push(`/overview?name=${selectedObject.name}`);
  }, [selectedObject]);

  React.useEffect(() => {
    if (data.results.length > 0) {
      const first = data.results[0].name;
      setAutocomplete(
        first.slice(
          query.length +
            first.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
        )
      );
    } else {
      setAutocomplete("");
    }
  }, [data, setAutocomplete, query]);

  React.useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      setQuery(searchValue);
    }
  }, [searchValue]);

  React.useEffect(() => {
    setSelectedObject(null);
    setAutocomplete("");
    history.push(`/search?q=${query}`);

    const controller = new AbortController();

    fetch(
      `${process.env.REACT_APP_API || ""}/api/search?q=${encodeURIComponent(
        query
      )}`,
      {
        signal: controller.signal,
      }
    )
      .then((response) => response.json())
      .then((data) =>
        setData({
          query,
          results: data.results,
        })
      )
      .catch(() => {});

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <div className="search">
        <div className="sidebar">
          <Heading variant="h2">
            /{selectedObject == null ? "search" : "overview"}
          </Heading>
          <Input
            autofocus={true}
            autocomplete={autocomplete}
            placeholder="Job title, keywords, company, or location"
            withIcon={true}
            iconVariant="search"
            value={selectedObject == null ? query : selectedObject.name}
            setValue={(newValue) => {
              setQuery(newValue);
            }}
            onSubmit={() => {
              if (data.results.length > 0) {
                setAutocomplete("");
                setSelectedObject(data.results[0]);
              }
            }}
            style={{
              width: "100%",
            }}
          />
        </div>
        <div className="main">
          {selectedObject == null ? (
            query === "" ? (
              <>
                <Heading variant="h1">Always helpful</Heading>
                <Text>
                  As you type, we'll display a few results that match.
                </Text>
              </>
            ) : (
              <ResultsPage
                query={query}
                data={data.query === query ? data : emptyData}
                ready={data.query === query}
                setSelectedObject={(obj) => {
                  setAutocomplete("");
                  setSelectedObject(obj);
                }}
              />
            )
          ) : (
            <>
              <OverviewPage
                selectedObject={selectedObject}
                setSelectedObject={setSelectedObject}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
/**
 * sortByListings function takes the data that we're going to sort and the parameter "ascending"
 * if you would like the list to come back in ascending order then pass 1, for descending pass 0.
 * 
 * **/

function sortByListings(data, ascending){


  if(ascending){
    for(var i = 0; i < data.results.length; i++){
      for (var j = 0; j < data.results.length - 1; j ++){
        if(data.results[j].listings > data.results[j + 1].listings){

          var temp = data.results[j];
          data.results[j] = data.results[j + 1];
          data.results[j + 1] = temp;

        }
      }
      
    }
    return data;
  }


  if(!ascending){

    for(var i = data.results.length - 1; i >= 0; i--){
      for(var j = data.results.length - 1; i > 0; i --){
        if(data.results[j].listings > data.results[j-1].listings){

          var temp = data.results[j];
          data.results[j] = data.results[j - 1];
          data.results[j - 1] = temp;
      }

      }
    }
    return data;
  }
}

/**
 * sortByName function takes the data that we're going to sort and the parameter "ascending"
 * if you would like the list to come back in ascending order then pass 1, for descending pass 0.
 * 
 * **/

function sortByName(data, ascending){

  if(ascending){
    for(var i = 0; i < data.results.length; i ++){
      for(var j = 0; j < data.results.length - 1; i ++){
        if(data.results[j].name.toLowerCase() > data.results[j + 1].name.toLowerCase()){

          var temp = data.results[j];
          data.results[j] = data.results[j + 1];
          data.results[j + 1] = temp;
        }
      }

    }

    return data;
  }

  if(!ascending){
    for(var i = data.results.length - 1; i >= 0; i --){
      for(var j = data.results.length - 1; i > 0; i --){
        if(data.results[j].name.toLowerCase() > data.results[j - 1].name.toLowerCase()){

          var temp = data.results[j];
          data.results[j] = data.results[j-1];
          data.results[j-1] = temp;
        }
      }
    }
    return data;
  }
}
