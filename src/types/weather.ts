export interface CurrentWeather {
  temp: number;
  windspeed: number;
  precipprob: number;
  conditions: string;
  datetime: string;
  humidity: number;
  icon: string;
}

export interface HourlyForecast {
  datetime: string;
  temp: number;
  conditions: string;
  icon: string;
}

export interface WeatherData {
  currentConditions: CurrentWeather;
  hours: HourlyForecast[];
  location: string;
} 