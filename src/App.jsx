import React, { useState } from 'react';
import './App.css';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = "f50c3f2125830d5edd9c58a0955fa928";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const { coord, main, wind, weather: weatherData } = data;

      setWeather({
        temp: Math.round(main.temp),
        humidity: main.humidity,
        windSpeed: wind.speed,
        description: weatherData[0].description,
        icon: weatherData[0].icon
      });
      setPlace(data.name);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setForecast(
        forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 3)
      );
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast([]);
      setPlace("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-6">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videobg1.mp4" type="video/mp4" />
      </video>

      {/* Search Container with Glassmorphism Effect */}
      <div className="relative w-full max-w-md px-6 py-8 bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-700 border-opacity-30 z-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 bg-transparent border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
          <button
            onClick={fetchWeather}
            disabled={isLoading}
            className="px-6 py-2 bg-transparent text-white rounded-lg shadow-sm border border-gray-300 hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Find Weather"}
          </button>
        </div>

        {/* Weather Info */}
        {(weather || error) && (
          <div className="mt-6 text-white">
            {error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{place}</h2>
                    <p className="text-gray-300 capitalize">{weather.description}</p>
                  </div>
                  <div className="text-4xl font-bold">{weather.temp}°C</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-transparent p-3 rounded-lg shadow-sm border border-gray-300">
                    <p className="text-gray-300">Humidity</p>
                    <p className="text-lg font-semibold">{weather.humidity}%</p>
                  </div>
                  <div className="bg-transparent p-3 rounded-lg shadow-sm border border-gray-300">
                    <p className="text-gray-300">Wind Speed</p>
                    <p className="text-lg font-semibold">{weather.windSpeed} m/s</p>
                  </div>
                </div>

                {forecast.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">3-Day Forecast</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {forecast.map((day, index) => (
                        <div
                          key={index}
                          className="bg-transparent p-2 rounded-lg shadow-sm border border-gray-300 text-center"
                        >
                          <p className="text-sm text-gray-300">
                            {new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className="text-lg font-semibold">
                            {Math.round(day.main.temp)}°C
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
