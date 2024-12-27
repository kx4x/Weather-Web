import { HourlyForecast, WeatherData } from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return {
      currentConditions: {
        temp: data.currentConditions.temp,
        windspeed: data.currentConditions.windspeed,
        precipprob: data.currentConditions.precipprob,
        conditions: data.currentConditions.conditions,
        datetime: data.currentConditions.datetime,
        humidity: data.currentConditions.humidity,
        icon: data.currentConditions.icon,
      },
      hours: data.days[0].hours.map((hour: HourlyForecast) => ({
        datetime: hour.datetime,
        temp: hour.temp,
        conditions: hour.conditions,
        icon: hour.icon,
      })),
      location: data.resolvedAddress,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function searchLocations(query: string): Promise<string[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(query)}/today?key=${API_KEY}&contentType=json`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location suggestions');
    }

    const data = await response.json();
    
    if (data.resolvedAddress) {
      return [data.resolvedAddress];
    }

    return [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}