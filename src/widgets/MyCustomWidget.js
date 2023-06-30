import React, { useEffect, useState } from 'react';

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const numOfDays = 4; // Number of days to display in the forecast

export default function WeatherForecastWidget() {
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [currentPrecipitation, setCurrentPrecipitation] = useState(null); 
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const forecastResponse = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=M`);
      const forecastData = await forecastResponse.json();

      const currentLocationResponse = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
      const currentLocationData = await currentLocationResponse.json();

      if (forecastResponse.ok && currentLocationResponse.ok) {
        setForecastData(forecastData);
        setLocation(currentLocationData.data[0].city_name);
        setCurrentTemperature(currentLocationData.data[0].temp);
        setCurrentPrecipitation(currentLocationData.data[0].precip); 
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

  const handleRefresh = () => {
    setIsLoading(true);
    setForecastData(null);
    setLocation(null);
    setCurrentTemperature(null);
    setCurrentPrecipitation(null); 
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
      <h2>Weather Forecast</h2>
      {isLoading ? (
        <p>Loading weather forecast...</p>
      ) : error ? (
        <>
          <p>Error fetching weather forecast: {error}</p>
          <button onClick={handleRefresh} style={{ backgroundColor: 'gray', color: 'white',borderRadius:"5px",padding:"2px 5px" }}>Retry</button>
        </>
      ) : (
        <>
          {location && <p>Current Location: {location}</p>}
          {currentTemperature && <p>Current Temperature: {currentTemperature}°C</p>}
          {/* {currentPrecipitation && <p>Current Precipitation: {currentPrecipitation}%</p>}  */}

          {forecastData ? (
            <div className="forecast-container">
              {forecastData.data
                .filter((item) => new Date(item.valid_date) > new Date()) 
                .slice(0, numOfDays)
                .map((item, index) => (
                  <div className="forecast-item" key={index}>
                    <div className="forecast-date">{formatDate(item.valid_date)}</div>
                    <img src={`https://www.weatherbit.io/static/img/icons/${item.weather.icon}.png`} alt="Weather Icon" className="forecast-icon" />
                    <div className="forecast-desc">{item.weather.description}</div>
                    <div className="forecast-temp">Temperature: {item.temp}°C</div>
                    <div className="forecast-humidity">Humidity: {item.rh}%</div>
                    <div className="forecast-precip">Precipitation: {item.precip}%</div>
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
