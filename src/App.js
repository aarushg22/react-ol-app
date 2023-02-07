import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat, transform } from "ol/proj";
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import axios from 'axios';

const apiKey = 'eef69f7ae7c24101a8cc6187113cbd39'

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [map, setMap] = useState();
  // const mapElement = useRef();

  const handleMapClick = event => {
    console.log('batman click')
    
    // what are projections?
    const lonlat = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
    console.log(lonlat)
    
    const location = getLocationFromLonLat("country", lonlat[1], lonlat[0]);
    console.log(location)
    setSelectedLocation(location);
    postData(location);
  };

  const postData = async (city) => {
    const response = await fetch('/batman-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ city: city })
    });
    const data = await response.json();
  }

  const getLocationFromLonLat = async (locationAttribute, lon, lat) => {
    try {
      const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?format=json&lat=${lon}&lon=${lat}&apiKey=${apiKey}`);
      const data = response.data;
      if (data.results.length) {
        const result = data.results[0];
        console.log(result[locationAttribute]);
        return result[locationAttribute];
      } else {
        console.log('Something went wrong in getting the city');
        console.log(data)
        return null
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //why does this only work with useeffect?
  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-73.935242, 40.73061]),
        zoom: 2
      }),
      target: 'my-map',
    });

    map.on("click", handleMapClick);
  }, []);

  return (
    <div className="App">

      <div id="my-map" style={{ width: "100%", height: "100vh" }}/>
      <div>
        Selected Location: {selectedLocation == null ? selectedLocation : "None"}
      </div> 
    </div>
  );
}

export default App;
