import React, { useEffect, useState } from 'react';

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const numOfDays = 4; // Number of days to display in the forecast

export default function WeatherForecastWidget() {
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [currentPrecipitation, setCurrentPrecipitation] = useState(null); // Added state for precipitation
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('C');
  const [currentWeatherDescription, setCurrentWeatherDescription] = useState(null);


  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const forecastResponse = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=M`
      );
      const currentLocationResponse = await fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`
      );
  
      if (forecastResponse.ok && currentLocationResponse.ok) {
        const forecastData = await forecastResponse.json();
        const currentLocationData = await currentLocationResponse.json();
  
        setForecastData(forecastData);
        setLocation(currentLocationData.data[0].city_name);
        setCurrentTemperature(currentLocationData.data[0].temp);
        setCurrentHumidity(currentLocationData.data[0].rh);
        setCurrentPrecipitation(currentLocationData.data[0].precip);
        setCurrentWeatherDescription(currentLocationData.data[0].weather.description);
        setError(null);
      } else {
        setError('Error fetching weather data.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError('Access to location was denied.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleString('en-US', options);
  };

  const convertTemperature = (temperature, unit) => {
    if (unit === 'F') {
      return (temperature * 9) / 5 + 32; // Convert to Fahrenheit
    }
    return temperature; // Celsius by default
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setForecastData(null);
    setLocation(null);
    setCurrentTemperature(null);
    setCurrentHumidity(null);
    setCurrentPrecipitation(null); // Reset precipitation state
    setError(null);

    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError('Access to location was denied.');
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <div className="weather-forecast-widget">
      {isLoading ? (
        <p>Loading weather forecast...</p>
      ) : error ? (
        <>
          <p>Error fetching weather forecast: {error}</p>
          <button className="retry-button" onClick={handleRefresh}>
            Retry
          </button>
        </>
      ) : (
        <>
        <h2 className="widget-title">Weather Forecast</h2>
        {location && <p className="location">Location: {location}</p>}
        {currentWeatherDescription && <p className="weather-description">Weather: {currentWeatherDescription}</p>}
        {currentTemperature && (
          <p className="current-temperature">
            Temperature: {convertTemperature(currentTemperature, temperatureUnit)}°{temperatureUnit} | Temperature Unit:
            <select
              className="temperature-unit-select"
              value={temperatureUnit}
              onChange={(e) => setTemperatureUnit(e.target.value)}
            >
              <option value="C">Celsius</option>
              <option value="F">Fahrenheit</option>
            </select>
          </p>
        )}

        {currentHumidity && <p className="current-humidity">Humidity: {currentHumidity}%</p>}
        {/* {currentPrecipitation && <p className="current-precipitation">Current Precipitation: {currentPrecipitation}</p>} */}
        {forecastData ? (
          <div className="forecast-container">
            {forecastData.data
              .filter((item) => new Date(item.valid_date) > new Date())
              .slice(0, numOfDays)
              .map((item, index) => (
                <div className="forecast-item" key={index}>
                  <div className="forecast-date">{formatDate(item.valid_date)}</div>
                  <img
                    src={`https://www.weatherbit.io/static/img/icons/${item.weather.icon}.png`}
                    alt="Weather Icon"
                    className="forecast-icon"
                  />
                  <div className="forecast-desc">{item.weather.description}</div>
                  <div className="forecast-temp">
                    Temperature: {convertTemperature(item.temp, temperatureUnit)}°{temperatureUnit}
                  </div>
                  <div className="forecast-humidity">Humidity: {item.rh}%</div>
                  <div className="forecast-precipitation">Precipitation: {item.precip}%</div>
                </div>
              ))}
          </div>
        ) : (
          <p>No weather forecast available.</p>
        )}
      </>
      )}
    </div>
  );
}
