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
  const [selectedCity, setSelectedCity] = useState(null);
  // const [map, setMap] = useState();
  // const mapElement = useRef();

  const handleMapClick = event => {
    console.log('batman click')
    
    // what are projections?
    const lonlat = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
    console.log(lonlat)
    
    const city = getCityFromLonLat(lonlat[0], lonlat[1]);
    console.log(city)
    // setSelectedCity(city);
    // postData(city);
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
    console.log(data);
  }

  const getCityFromLonLat = async (lon, lat) => {
    try {
      const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?format=json&lat=${lon}&lon=${lat}&apiKey=${apiKey}`);
      const data = response.data;
      if (data.address.town) {
        return data.address.town;
      } else if (data.address.city) {
        return data.address.city;
      } else {
        return null;
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
      {/* <div>
        Selected city: {selectedCity ? selectedCity : "None"}
      </div> */}
    </div>
  );
}

export default App;
