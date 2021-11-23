import * as React from 'react';
import './Landing.css';
import Cloud1 from '../images/cloud1.svg';
import Cloud2 from '../images/cloud2.svg';
import Cloud3 from '../images/cloud3.svg';
import Cloud4 from '../images/cloud4.svg';
import Cloud5 from '../images/cloud5.svg';
import Button from '../components/Button';

class Landing extends React.Component {

    constructor(props) {
        super(props)
        this.onSearch = this.onSearch.bind(this)
    }

    onSearch(e) {
        console.log(e.target);
    }

    render() {
        return (
            <div className="landing">
                <img src={Cloud1} className="cloud" id="cloud1"/>
                <img src={Cloud2} className="cloud" id="cloud2"/>
                <img src={Cloud3} className="cloud" id="cloud3"/>
                <img src={Cloud4} className="cloud" id="cloud4"/>
                <img src={Cloud5} className="cloud" id="cloud5"/>

                <div className="tagline">
                    <h1 className="title">Get a bird's-eye view of your field</h1>
                    <h2 className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus, est aliquam imperdiet consectetur, purus odio pulvinar orci, ut volutpat ex justo dapibus metus. </h2>
                    <div id="search-bar">
                        {/* <label for="search-text">Job title, keywords, company or location</label> */}
                        <input type="text" id="search-bar-text" placeholder="Job title, keywords, company or location"></input>
                        <div id="search-button" onClick={this.onSearch}>Search</div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Landing;
