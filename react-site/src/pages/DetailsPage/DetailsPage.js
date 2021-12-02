import React from "react";

import "./DetailsPage.css";

import Card from "../../components/Card";
import Heading from "../../components/Heading";
import Placeholder from "../../components/Placeholder";
import RadioGroup from "../../components/RadioGroup";
import Text from "../../components/Text";

export const DetailsPage = ({ selectedObject }) => {
  const emptyData = {
    name: "",
    category: "",
    listings: [],
    data: [],
  };
  const [data, setData] = React.useState(emptyData);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (selectedObject.name === "") return;

    setReady(false);
    console.log("Hi");

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
      <div className="details">
        <Heading variant="h1">Details</Heading>
        {selectedObject.name === "" ? (
          <>
            <Text>Click on a result to see related information.</Text>
          </>
        ) : ready ? (
          <>
            <Heading variant="h2">{data.name}</Heading>
            <Text>Brief description.</Text>
            <Heading variant="h2">Historical Trends</Heading>
            <Card></Card>
          </>
        ) : (
          <>
            <Placeholder
              style={{
                height: "3rem",
                width: "100%",
                marginBottom: "5rem",
              }}
            />
            <Placeholder
              style={{
                height: "1rem",
                width: "100%",
              }}
            />
            <Heading variant="h2">Historical Trends</Heading>
            <Placeholder
              style={{
                height: "128px",
                width: "100%",
              }}
            />
          </>
        )}
      </div>
    </>
  );
};
