import React from "react";

import "./SearchPage.css";

import ResultsPage from "../ResultsPage";

import Input from "../../components/Input";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import { OverviewPage } from "../OverviewPage/OverviewPage";

export const SearchPage = ({ searchValue }) => {
  const [autocomplete, setAutocomplete] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [selectedObject, setSelectedObject] = React.useState(null);

  const emptyData = {
    query: "",
    results: [],
  };
  const [data, setData] = React.useState(emptyData);

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
          <Heading variant="h2">/search</Heading>
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
