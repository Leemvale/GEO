import React, { Component } from 'react';
import './App.css';

import MapWithWidgets from './Components/MapWithWidgets/MapWithWidgets'
import * as d3 from "d3";
import moment from "moment/moment";

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            locations: []
        }
    }

    componentDidMount() {
        d3.csv('data/new_path1.csv', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            this.setState({
                locations: data,
            })
        })
    }

  render() {
    return (
        <div>
            <MapWithWidgets locations = {this.state.locations}/>
        </div>
    );
  }
}
export default App;
