import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

import Button from "../Button";
import Heading from "../Heading";

export const Navbar = ({ signedIn = false }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Heading variant="cta">cumulus</Heading>
      </Link>
      {signedIn ? null : (
        <div className="cta-button">
          <Button color="cta" label="Sign Up" />
        </div>
      )}
    </nav>
  );
};
