import * as React from 'react';
import './Landing.css';
import Cloud1 from '../images/cloud1.svg';
import Cloud2 from '../images/cloud2.svg';
import Cloud3 from '../images/cloud3.svg';
import Cloud4 from '../images/cloud4.svg';
import Cloud5 from '../images/cloud5.svg';

import Input from '../components/Input';
import Heading from '../components/Heading';
import Text from '../components/Text';

class Landing extends React.Component {

    constructor(props) {
        super(props)
        this.onSearch = this.onSearch.bind(this)
        this.state = {
            value: ''
        }
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
                    <Heading>Get a bird's-eye view of your field</Heading>
                    <Text>We'll be your eyes and ears.</Text>
                    <br />
                    <Input 
                        placeholder='Job title, keywords, company, or location'
                        color='white' 
                        withIcon={true} 
                        iconVariant='search' 
                        value={this.state.value}
                        setValue={(newValue) => {
                            this.setState(() => {
                                return {
                                    value: newValue
                                }
                            })
                        }}
                        autocomplete={this.state.value.length === 0 ? '' : 'Software Engineer'.substring('Software Engineer'.toLocaleLowerCase().indexOf(this.state.value.toLocaleLowerCase()) + this.state.value.length)}
                        style={{
                            width: '100%'
                        }}
                    />
                </div>
            </div>
        )
    }

}

export default Landing;
