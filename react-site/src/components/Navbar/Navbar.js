import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

import Button from '../Button';

export const Navbar = ({ signedIn=false }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="link logo">Cumulus</Link>
      {
        signedIn ?
        (
          null
        ) :
        <Button color='cta' label='Sign Up' />
      }
    </nav>
  )
}