import * as React from 'react';
import { Router, Link} from 'react-router-dom';
import './Navbar.css';

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <Link to="/" className="link logo">Cumulus</Link>
                <Link to="/users" className="link pricing">Pricing</Link>
                <Link to="/about" className="link about">About us</Link>
                <div id="signup">Sign Up</div>
            </nav>
        )
    }
}

export default Navbar;