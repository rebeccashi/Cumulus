import React from "react";

import "./DetailsPage.css";

import Card from "../../components/Card";
import Heading from "../../components/Heading";
import Placeholder from "../../components/Placeholder";
import Text from "../../components/Text";
import TextLink from "../../components/TextLink";
import LineGraph from "../../visualizations/LineGraph";
import Button from "../../components/Button";

export const DetailsPage = ({
  dataFromParent,
  setSelectedObject,
  switchToCompare,
}) => {
  const emptyData = {
    name: "",
    category: "",
    listings: [],
    data: [],
  };
  const [data, setData] = React.useState(emptyData);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (dataFromParent.length === 0) return;

    setReady(false);

    fetch(
      `${
        process.env.REACT_APP_API || ""
      }/api/overview?name=${encodeURIComponent(dataFromParent.name)}`
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setReady(true);
      })
      .catch(() => {});
  }, [dataFromParent]);

  return (
    <>
      <div className="details">
        <Heading variant="h2">Details</Heading>
        {dataFromParent.name === "" ? (
          <>
            <Text>Click on a result to see related information.</Text>
          </>
        ) : ready ? (
          <>
            <Card
              color="white"
              style={{
                marginBottom: "16px",
                maxWidth: "100%",
              }}
            >
              <Heading variant="h3">{data.name}</Heading>
            </Card>
            <Card
              color="white"
              style={{
                padding: "32px",
                maxWidth: "100%",
              }}
            >
              <Heading variant="h3">Historical Trends</Heading>
              <LineGraph
                data={data.listings.map((l) => {
                  return {
                    name: data.name,
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
                z={(d) => d.name}
                title={(d) => d.name}
              />
            </Card>
            <br />
            <div className="details-buttons">
              <Button
                color="white"
                label={`Explore this ${data.category.toLocaleLowerCase()}`}
                onClick={() => setSelectedObject(data)}
              />
              <Button
                color="white"
                label={`Compare this ${data.category.toLocaleLowerCase()}`}
                onClick={() => switchToCompare(dataFromParent)}
              />
            </div>
          </>
        ) : (
          <>
            <Placeholder
              style={{
                height: "3rem",
                width: "100%",
                marginBottom: "16px",
              }}
            />
            <Placeholder
              style={{
                height: "96px",
                width: "100%",
                marginBottom: "16px",
              }}
            />
            <Placeholder
              style={{
                height: "128px",
                width: "100%",
                marginBottom: "16px",
              }}
            />
          </>
        )}
      </div>
    </>
  );
};
