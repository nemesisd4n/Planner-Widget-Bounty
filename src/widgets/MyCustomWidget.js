import React, { useEffect, useState } from 'react';

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
const numOfDays = 3; // Number of days to display in the forecast

export default function WeatherForecastWidget() {
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const forecastResponse = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=M`);
      const forecastData = await forecastResponse.json();

      const currentLocationResponse = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
      const currentLocationData = await currentLocationResponse.json();

      if (forecastResponse.ok && currentLocationResponse.ok) {
        setForecastData(forecastData);
        setLocation(currentLocationData.data[0].city_name);
      } else {
        setError("Error fetching weather data.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          setError('Access to location was denied.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const formatDateTime = (dateTime) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateTime).toLocaleString('en-US', options);
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleString('en-US', options);
  };

  return (
    <div className="weather-forecast-widget">
      <h3>Weather Forecast</h3>
      {error ? (
        <p>Error fetching weather forecast: {error}</p>
      ) : (
        <>
          {location && <p>Current Location: {location}</p>}
          {forecastData ? (
            <div className="forecast-container">
              {forecastData.data.slice(0, numOfDays).map((item, index) => (
                <div className="forecast-item" key={index}>
                  <div className="forecast-date-time">
                    {formatDate(item.valid_date)} {formatDateTime(item.ts)}
                  </div>
                  <img src={`https://www.weatherbit.io/static/img/icons/${item.weather.icon}.png`} alt="Weather Icon" className="forecast-icon" />
                  <div className="forecast-desc">{item.weather.description}</div>
                  <div className="forecast-temp">Temperature: {item.temp}°C</div>
                  <div className="forecast-humidity">Humidity: {item.rh}%</div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading weather forecast...</p>
          )}
        </>
      )}
    </div>
  );
}
  