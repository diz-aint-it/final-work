import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.get(url);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
      setLocation('');
    }
  };

  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>Weather App</h1>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </header>
      <div className="weather-details">
        {data.name !== undefined &&
          <div className="weather-summary">
            <h2>{data.name}</h2>
            {data.main ? <p className="temperature">{data.main.temp.toFixed()}°C</p> : null}
            {data.weather ? <p className="description">{data.weather[0].description}</p> : null}
          </div>
        }

        {data.name !== undefined &&
          <div className="additional-details">
            <div className="detail">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="detail">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="detail">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()} km/h</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
