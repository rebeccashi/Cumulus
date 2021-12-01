import React from "react";

import "./OverviewPage.css";

import Card from "../../components/Card";
import Heading from "../../components/Heading";
import RadioGroup from "../../components/RadioGroup";
import Text from "../../components/Text";

const VIEWS = {
  DETAILS: "details",
  SORT: "sort",
  FILTER: "filter",
  COMPARE: "compare",
};

export const OverviewPage = ({ selectedObject, setSelectedObject }) => {
  const [view, setView] = React.useState(VIEWS.DETAILS);

  const emptyData = {
    name: "",
    category: "",
    listings: [],
    data: [],
  };
  const [data, setData] = React.useState(emptyData);

  React.useEffect(() => {
    fetch(
      `${
        process.env.REACT_APP_API || ""
      }/api/overview?name=${encodeURIComponent(selectedObject.name)}`
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch(() => {});
  }, [selectedObject]);

  return (
    <>
      <Heading variant="h1">
        {selectedObject.name}
        <Text>{data.category}</Text>
      </Heading>
      <RadioGroup
        color="white"
        options={[
          {
            label: "Details",
            value: VIEWS.DETAILS,
            icon: "details",
          },
          {
            label: "Sort",
            value: VIEWS.SORT,
            icon: "sort",
          },
          {
            label: "Filter",
            value: VIEWS.FILTER,
            icon: "filter",
          },
          {
            label: "Compare",
            value: VIEWS.COMPARE,
            icon: "compare",
          },
        ]}
        value={view}
        setValue={setView}
      />
      {data.data.map((datum, i) => {
        return (
          <div key={i} className="result">
            <Card
              variant="interactive"
              color="white"
              onClick={() => {
                setSelectedObject(datum);
              }}
              style={{
                width: "100%",
              }}
            >
              <Heading variant="h3">{datum.name}</Heading>
              <div className="resultData">
                <Text>
                  <strong>Listings:</strong>
                </Text>
                <Text>
                  {datum.listings.toLocaleString("en", {
                    useGrouping: true,
                  })}
                </Text>
                <Text>
                  <strong>Category:</strong>
                </Text>
                <Text>{datum.category}</Text>
              </div>
            </Card>
          </div>
        );
      })}
      {(() => {
        switch (view) {
          case VIEWS.DETAILS:
            return <>DETAILS</>;
          case VIEWS.SORT:
            return <>SORT</>;
          case VIEWS.FILTER:
            return <>FILTER</>;
          case VIEWS.COMPARE:
            return <>COMPARE</>;
          default:
            return <>DETAILS</>;
        }
      })()}
    </>
  );
};
