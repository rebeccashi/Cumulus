import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

import Button from "../Button";
import Heading from "../Heading";
import Text from "../Text";
import TextLink from "../TextLink";

export const Navbar = ({ signedIn = false }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <Heading variant="cta">cumulus</Heading>
        </Link>
      </div>
      <TextLink href="/pricing">Pricing</TextLink>
      <TextLink href="/about">About Us</TextLink>
      {signedIn ? null : (
        <div className="cta-button">
          <Button color="cta" label="Sign Up" />
        </div>
      )}
    </nav>
  );
};
