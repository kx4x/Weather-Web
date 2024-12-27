'use client';

import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchLocations } from "@/services/weatherService";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  onGetCurrentLocation: () => void;
  isLoading: boolean;
}

export function WeatherSearch({ 
  onSearch, 
  onGetCurrentLocation, 
  isLoading 
}: WeatherSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.trim().length >= 3) {
        try {
          const locations = await searchLocations(searchTerm);
          setSuggestions(locations);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4" ref={searchRef}>
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <Input 
            name="city"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter city name..."
            className="w-full p-3 pl-10 rounded-lg bg-zinc-800/50 border-zinc-700 
                       text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 
                       focus:ring-zinc-500"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
        </form>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left text-zinc-100 hover:bg-zinc-700 
                             first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        type="button"
        onClick={onGetCurrentLocation}
        disabled={isLoading}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        Use my current location
      </Button>
    </div>
  );
}