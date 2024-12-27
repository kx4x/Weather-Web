"use client";

import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherSearch } from "@/components/weather/WeatherSearch";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { useState, useEffect } from "react";
import { getWeatherData } from "@/services/weatherService";
import { WeatherData } from "@/types/weather";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherData(city);
      setWeatherData(data);
    } catch  {
      setError('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherData(`${latitude},${longitude}`);
            setWeatherData(data);
            setError(null);
          } catch {
            setError('Error fetching weather data for your location');
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('Error getting your location. Please allow location access.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 mb-6">
          <CardContent className="text-center text-zinc-100 p-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Cloud className="w-16 h-16 mx-auto mb-4 text-zinc-400" />
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Weather Forecast
              </h1>
              <p className="text-xl mb-8 text-zinc-400">
                Enter a city name to check the weather
              </p>
            </motion.div>
            
            <WeatherSearch 
              onSearch={handleSearch} 
              onGetCurrentLocation={getCurrentLocation}
              isLoading={loading} 
            />
            
            {error && (
              <p className="text-red-400 mt-4">{error}</p>
            )}
          </CardContent>
        </Card>

        {weatherData && !loading && (
          <>
            <WeatherCard 
              currentWeather={weatherData.currentConditions}
              location={weatherData.location}
            />
            <WeatherForecast 
              hourlyForecast={weatherData.hours}
            />
          </>
        )}

        {loading && (
          <div className="text-center text-zinc-300">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Cloud className="w-8 h-8 mx-auto" />
            </motion.div>
            <p className="mt-2">Loading...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}