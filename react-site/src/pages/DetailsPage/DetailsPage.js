import React from "react";

import "./DetailsPage.css";

import Card from "../../components/Card";
import Heading from "../../components/Heading";
import Placeholder from "../../components/Placeholder";
import Text from "../../components/Text";
import { LineGraph } from "../../visualizations/LineGraph/LineGraph";
import Button from "../../components/Button";

export const DetailsPage = ({ dataFromParent, setSelectedObject }) => {
  const emptyData = {
    name: "",
    category: "",
    listings: [],
    data: [],
  };
  const [data, setData] = React.useState([emptyData]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (dataFromParent.length === 0) return;

    setReady(false);

    const fetches = dataFromParent.map((d) => {
      return fetch(
        `${
          process.env.REACT_APP_API || ""
        }/api/overview?name=${encodeURIComponent(d.name)}`
      ).then((response) => response.json());
    });

    Promise.all(fetches)
      .then((data) => {
        console.log(data);
        setData(data);
        setReady(true);
      })
      .catch(() => {});
  }, [dataFromParent]);

  return (
    <>
      <div className="details">
        <Heading variant="h1">Details</Heading>
        {dataFromParent.length === 0 ? (
          <>
            <Text>Click on a result to see related information.</Text>
          </>
        ) : ready ? (
          <>
            <Heading variant="h2">
              {data.length > 1 ? "Comparing" : ""}{" "}
              {data.map((d) => d.name).join(", ")}
            </Heading>
            <Heading variant="h3">Historical Trends</Heading>
            <Card color="white">
              <LineGraph
                data={data
                  .map((d) => {
                    return d.listings.map((l) => {
                      return {
                        name: d.name,
                        date: l.date,
                        listings: l.listings,
                      };
                    });
                  })
                  .flat()}
                x={(d) => {
                  return new Date(
                    d.date.split("-")[1],
                    d.date.split("-")[0] - 1,
                    1
                  );
                }}
                y={(d) => parseInt(d.listings)}
                z={(d) => d.name}
              />
            </Card>
            <br />
            {data.length <= 1 ? (
              <Button
                color="white"
                label={`Explore this ${data[0].category.toLocaleLowerCase()}`}
                onClick={() => setSelectedObject(data)}
              />
            ) : null}
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
            <Heading variant="h3">Historical Trends</Heading>
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
