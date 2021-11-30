import * as React from "react";
import "./About.css";
import Cloud1 from "../images/cloud1.svg";
import Cloud2 from "../images/cloud2.svg";
import Cloud3 from "../images/cloud3.svg";
import Cloud4 from "../images/cloud4.svg";
import Cloud5 from "../images/cloud5.svg";

class Signup extends React.Component {
  render() {
    return (
      <div className="landing">
        <img src={Cloud1} className="cloud" id="cloud1" />
        <img src={Cloud2} className="cloud" id="cloud2" />
        <img src={Cloud3} className="cloud" id="cloud3" />
        <img src={Cloud4} className="cloud" id="cloud4" />
        <img src={Cloud5} className="cloud" id="cloud5" />

        <div className="tagline">
          <h1 className="title">Sign Up form here</h1>
        </div>
      </div>
    );
  }
}

export default Signup;
