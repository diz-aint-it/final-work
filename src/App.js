import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric');

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    let apiUrl = '';

    if (location) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=895284fb2d2c50a520ea537456963d9c`;
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=895284fb2d2c50a520ea537456963d9c`;

          try {
            const response = await axios.get(apiUrl);
            setData(response.data);
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        });
      } else {
        console.error("Geolocation is not available in this browser.");
      }
    }

    if (apiUrl) {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);

        const unitSymbol = unit === 'metric' ? '°C' : '°F';

        if (data.main) {
          data.main.temp = data.main.temp.toFixed() + unitSymbol;
          data.main.feels_like = data.main.feels_like.toFixed() + unitSymbol;
        }
        if (data.wind) {
          data.wind.speed = data.wind.speed.toFixed() + (unit === 'metric' ? ' km/h' : ' mph');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherData();
      setLocation('');
    }
  };

  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>Weather App</h1>
        <div className="input-container">
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder='Enter Location'
            type="text"
          />
          <button className="search-button" onClick={fetchWeatherData}>Search</button>
        </div>
        <div className="unit-container">
          <label htmlFor="unitSelect">Select Unit:</label>
          <select
            id="unitSelect"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
          >
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
        </div>
      </header>
      <div className="weather-details">
        {data.name !== undefined && (
          <div className="weather-summary">
            <h2>{data.name}</h2>
            {data.main ? <p className="temperature">{data.main.temp}</p> : null}
            {data.weather ? <p className="description">{data.weather[0].description}</p> : null}
          </div>
        )}

        {data.name !== undefined && (
          <div className="additional-details">
            <div className="detail">
              {data.main ? <p className="bold">{data.main.feels_like}</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="detail">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="detail">
              {data.wind ? <p className="bold">{data.wind.speed}</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
