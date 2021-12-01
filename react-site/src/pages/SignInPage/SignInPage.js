import React from "react";

import "./SignInPage.css";

import Input from "../../components/Input";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Card from "../../components/Card";
import Button from "../../components/Button";
import TextLink from "../../components/TextLink";

import cloud_1 from "../../images/cloud.svg";
import cloud_2 from "../../images/cloud--2.svg";

export const SignInPage = ({ setSearchValue }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="signin">
      <div className="top-left-cloud">
        <img src={cloud_1} />
      </div>
      <Card
        variant="default"
        color="white"
        style={{
          padding: "36px",
          zIndex: "1",
        }}
      >
        <Heading>/sign in</Heading>
        <br />
        <div className="signin-inputs">
          <Input
            placeholder="username"
            withIcon={false}
            label="username"
            value={username}
            setValue={setUsername}
            style={{
              width: "100%",
            }}
          />
          <Input
            placeholder="password"
            withIcon={false}
            label="password"
            value={password}
            setValue={setPassword}
            style={{
              width: "100%",
            }}
            type="password"
          />
          <div className="signin-inputs--cta">
            <Button label="Log In" color="cta"></Button>
            <TextLink>Don't have an account? Sign up here!</TextLink>
          </div>
        </div>
      </Card>
      <div className="bottom-right-cloud">
        <img src={cloud_2} />
      </div>
    </div>
  );
};
