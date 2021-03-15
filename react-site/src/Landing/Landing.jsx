import * as React from 'react';
import './Landing.css';
import Cloud1 from '../images/cloud1.svg'

class Landing extends React.Component {

    render() {
        return (
            <div className="landing">
                <img src={Cloud1} className="cloud" id="cloud1"/>
                {/* <svg>
                    <use id="cloud1" href="abstract-clouds.svg"/>
                </svg> */}
                <div className="tagline">
                    <h1 className="title">Get a bird's-eye view of your field</h1>
                    <h2 className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus, est aliquam imperdiet consectetur, purus odio pulvinar orci, ut volutpat ex justo dapibus metus. </h2>
                    <div id="search-bar">
                        <span id="search-bar-text">Job title, keywords, company or location</span>
                        <div id="search-button">Search</div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Landing;