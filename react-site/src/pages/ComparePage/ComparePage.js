import React from "react";

import "./ComparePage.css";

import Card from "../../components/Card";
import Heading from "../../components/Heading";
import Placeholder from "../../components/Placeholder";
import Text from "../../components/Text";
import TextLink from "../../components/TextLink";
import LineGraph from "../../visualizations/LineGraph";

export const ComparePage = ({ dataFromParent, setSelectedObject }) => {
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
        setData(data);
        setReady(true);
      })
      .catch(() => {});
  }, [dataFromParent]);

  return (
    <>
      <div className="details">
        <Heading variant="h2">Compare</Heading>
        {dataFromParent.length < 2 ? (
          <>
            {dataFromParent.length === 0 ? (
              <Text>Select at least two items to compare.</Text>
            ) : (
              <Text>
                Select one more item to compare with{" "}
                <strong>{dataFromParent[0].name}</strong>.
              </Text>
            )}
          </>
        ) : ready ? (
          <>
            <>
              <Card
                color="white"
                style={{
                  marginBottom: "16px",
                  maxWidth: "100%",
                }}
              >
                <Heading variant="h3">Comparing {data.length} items</Heading>
                {data.map((d, i) => (
                  <Text>
                    <TextLink key={i} href={`/overview?name=${d.name}`}>
                      {d.name}
                    </TextLink>
                  </Text>
                ))}
              </Card>
            </>
            <Card
              color="white"
              style={{
                padding: "32px",
                maxWidth: "100%",
              }}
            >
              <Heading variant="h3">Historical Trends</Heading>
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
                title={(d) => d.name}
              />
            </Card>
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
