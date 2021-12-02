import React from "react";

import "./OverviewPage.css";

import Card from "../../components/Card";
import Heading from "../../components/Heading";
import Placeholder from "../../components/Placeholder";
import RadioGroup from "../../components/RadioGroup";
import Text from "../../components/Text";

import DetailsPage from "../DetailsPage";

import LineGraph from "../../visualizations/LineGraph";

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
  const [ready, setReady] = React.useState(false);

  const [detailObject, setDetailObject] = React.useState([]);

  React.useEffect(() => {
    setReady(false);

    fetch(
      `${
        process.env.REACT_APP_API || ""
      }/api/overview?name=${encodeURIComponent(selectedObject.name)}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setReady(true);
      })
      .catch(() => {});
  }, [selectedObject]);

  return (
    <>
      <Heading variant="h1">{selectedObject.name}</Heading>
      <Heading variant="h2">Overview</Heading>
      <div className="overview">
        {data.category === "Skill" ? (
          <div className="trend-card">
            {ready && data && data.listings ? (
              <Card
                color="white"
                style={{
                  padding: "32px",
                  marginBottom: "16px",
                }}
              >
                <Heading variant="h3">Listings over time</Heading>
                <LineGraph
                  data={data.listings.map((l) => {
                    console.log(data);
                    return {
                      date: l.date,
                      listings: l.listings,
                    };
                  })}
                  x={(d) => {
                    return new Date(
                      d.date.split("-")[1],
                      d.date.split("-")[0] - 1,
                      1
                    );
                  }}
                  y={(d) => parseInt(d.listings)}
                  title={() => data.name}
                />
              </Card>
            ) : (
              <Placeholder
                style={{
                  height: "128px",
                  width: "100%",
                }}
              />
            )}
          </div>
        ) : null}
        <div className="metadata-card">
          {ready && data && data.listings ? (
            <Card
              color="white"
              style={{
                width: "fit-content",
              }}
            >
              <div className="metadata">
                <Text>
                  <strong>Listings:</strong>
                </Text>
                <Text>
                  {data.listings[0].listings.toLocaleString("en", {
                    useGrouping: true,
                  })}
                </Text>
                <Text>
                  <strong>Category:</strong>
                </Text>
                <Text>{data.category}</Text>
              </div>
            </Card>
          ) : (
            <Placeholder
              style={{
                height: "6rem",
                width: "20ch",
              }}
            />
          )}
        </div>
      </div>
      <Heading variant="h2">Relevant items</Heading>
      <div className="selectGroup">
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
          setValue={(newView) => {
            setView(newView);
            setDetailObject([]);
          }}
        />
      </div>
      <div className="overviewColumns">
        <div>
          {ready ? (
            <>
              {data.data.map((datum, i) => {
                return (
                  <div key={i} className="result">
                    <Card
                      variant="interactive"
                      color={
                        detailObject.some((d) => d.name === datum.name)
                          ? "purple10"
                          : "white"
                      }
                      onClick={() => {
                        setView(VIEWS.DETAILS);
                        if (detailObject.some((d) => d.name === datum.name))
                          setDetailObject(
                            detailObject.filter((d) => d.name !== datum.name)
                          );
                        else setDetailObject([...detailObject, datum]);
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
            </>
          ) : (
            Array.from(Array(4)).map((_, i) => {
              return (
                <div key={i} className="result">
                  <Placeholder
                    style={{
                      height: "128px",
                      width: "100%",
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
        {(() => {
          switch (view) {
            case VIEWS.DETAILS:
              return (
                <DetailsPage
                  dataFromParent={detailObject}
                  setSelectedObject={(newObject) => {
                    setDetailObject([]);
                    setReady(false);
                    setSelectedObject(newObject);
                  }}
                />
              );
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
      </div>
    </>
  );
};
