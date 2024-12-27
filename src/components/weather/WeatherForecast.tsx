'use client';

import { Card, CardContent } from "@/components/ui/card";
import { HourlyForecast } from "@/types/weather";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface WeatherForecastProps {
  hourlyForecast: HourlyForecast[];
}

export function WeatherForecast({ hourlyForecast }: WeatherForecastProps) {
  const next24Hours = hourlyForecast.slice(0, 24);

  const formatHour = (datetime: string) => {
    const hour = datetime.split(':')[0];
    return `${hour}:00`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 mt-4">
        <CardContent className="p-6 text-zinc-100">
          <h3 className="text-xl font-bold mb-4">24 Hour Forecast</h3>
          <Swiper
            spaceBetween={16}
            slidesPerView="auto"
            className="w-full"
          >
            {next24Hours.map((hour, index) => (
              <SwiperSlide key={hour.datetime} className="!w-[100px]">
                <motion.div
                  className="flex flex-col items-center justify-between p-3 rounded-lg bg-zinc-800/50 h-[120px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <span className="text-sm text-zinc-400">
                    {formatHour(hour.datetime)}
                  </span>
                  <span className="text-lg font-bold">{Math.round(hour.temp)}°C</span>
                  <span className="text-sm text-zinc-400 text-center">{hour.conditions}</span>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </CardContent>
      </Card>
    </motion.div>
  );
}
