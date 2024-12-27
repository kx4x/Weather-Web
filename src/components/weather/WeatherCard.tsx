'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CurrentWeather } from "@/types/weather";
import { motion } from "framer-motion";
import { Cloud, Wind, Droplets, MapPin } from "lucide-react";

interface WeatherCardProps {
  currentWeather: CurrentWeather;
  location: string;
}

export function WeatherCard({ currentWeather, location }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800">
        <CardContent className="p-6 text-zinc-100">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-zinc-400" />
            <h2 className="text-2xl font-bold text-white">{location}</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {Math.round(currentWeather.temp)}°C
              </p>
              <p className="text-lg text-zinc-400">{currentWeather.conditions}</p>
            </div>
            <div className="space-y-2 text-zinc-400">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                <span>Wind Speed: {currentWeather.windspeed} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                <span>Humidity: {currentWeather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Precipitation: {currentWeather.precipprob}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}