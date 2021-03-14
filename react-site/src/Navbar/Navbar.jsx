import * as React from 'react';
import { Router, Link} from 'react-router-dom';
import './Navbar.css';

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar">
                <Link to="/" className="link">Cumulus</Link>
                <Link to="/users" className="link">Pricing</Link>
                <Link to="/about" className="link">About us</Link>
            </nav>
        //     <ul>
        //     <li>
        //         <Link to="/">Cumulus</Link>
        //     </li>
        //     <li>
        //         <Link to="/users">Pricing</Link>
        //     </li>
        //     <li>
        //         <Link to="/about">About us</Link>
        //     </li>
        // </ul>
        )
    }
}

export default Navbar;