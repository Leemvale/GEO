import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer} from 'react-leaflet';
import Locations from './Locations/Locations.js';
import 'leaflet/dist/leaflet.css';
import './Map.css';

class Map extends Component {
    constructor () {
        super();
        this.state = {
            lat: 59.867620,
            lng: 30.320837,
            zoom: 11
        }
    }

    render () {
        const position = [this.state.lat, this.state.lng]
        return (
            <div style={{width: 100 + '%', height: 100 + '%'}}>
                <LeafletMap style={{height: 100 + '%', width: 100 + '%'}} center={position} zoom={this.state.zoom}>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/leemvale/cjf32a4oh000k2rmwovgsje5l/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVlbXZhbGUiLCJhIjoiY2pmMjg5cGp1MHg0OTJ5cG5obXppdzJ1eiJ9.iyqnEa7jlGD1I9R3wBb5NQ"
                    />
                    <Locations data={this.props.data}/>
                </LeafletMap>
            </div>
        )
    }
}


export default Map
