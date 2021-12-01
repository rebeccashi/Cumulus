import React from "react";
import { Link, useHistory } from "react-router-dom";

import "./Navbar.css";

import Button from "../Button";
import Heading from "../Heading";
import Text from "../Text";
import TextLink from "../TextLink";

export const Navbar = ({ signedIn = false }) => {
  const history = useHistory();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <Heading variant="cta">cumulus</Heading>
        </Link>
      </div>
      <TextLink href="/about">About Us</TextLink>
      <TextLink href="/signin">Sign In</TextLink>
      {signedIn ? null : (
        <div className="cta-button">
          <Button
            color="cta"
            label="Sign Up"
            onClick={() => history.push("/signin")}
          />
        </div>
      )}
    </nav>
  );
};
