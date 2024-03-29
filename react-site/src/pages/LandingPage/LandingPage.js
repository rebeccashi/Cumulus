import React from "react";

import "./LandingPage.css";

import Input from "../../components/Input";
import Heading from "../../components/Heading";
import Text from "../../components/Text";

export const LandingPage = ({ setSearchValue }) => {
  const [value, setValue] = React.useState("");

  return (
    <div className="landing">
      <div className="tagline">
        <Heading>Get a bird's-eye view of your field</Heading>
        <Text>We'll be your eyes and ears.</Text>
        <br />
        <Input
          placeholder="Job title, keywords, company, or location"
          withIcon={true}
          iconVariant="search"
          value={value}
          setValue={(newValue) => {
            setValue(newValue);
            setSearchValue(newValue);
          }}
          style={{
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};
