import * as React from 'react';
import { Router, Link} from 'react-router-dom';
import './Navbar.css';
import Button from '../components/Button';

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <Link to="/" className="link logo">Cumulus</Link>
                <Link to="/users" className="link pricing">Pricing</Link>
                <Link to="/about" className="link about">About us</Link>
                <Button color='cta' label='Sign Up' />
            </nav>
        )
    }
}

export default Navbar;