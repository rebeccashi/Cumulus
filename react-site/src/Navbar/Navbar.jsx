import * as React from 'react';
import { Router, Link} from 'react-router-dom';

class Navbar extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                <li>
                    <Link to="/">Cumulus</Link>
                </li>
                <li>
                    <Link to="/users">Pricing</Link>
                </li>
                <li>
                    <Link to="/about">About us</Link>
                </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;