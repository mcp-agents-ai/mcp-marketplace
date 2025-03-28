import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState(value);
  const [isMobile, setIsMobile] = useState(false);
  
  // Update internal state when prop value changes (e.g., reset from parent)
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // If the input is cleared, automatically trigger search with empty string
    if (newValue === '') {
      onSearch('');
    }
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  return (
    <div className={`relative w-full flex ${isMobile ? 'flex-col' : 'max-w-2xl'}`}>
      <div className={`relative flex items-center ${isMobile ? 'w-full' : 'flex-1'}`}>
        <div className="absolute left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className={`block w-full pl-10 pr-3 py-3 border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isMobile ? 'rounded-lg' : 'rounded-l-lg'
          }`}
          placeholder={t('home.search.placeholder')}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        className={`px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          isMobile 
            ? 'rounded-lg mt-2 w-full' 
            : 'rounded-r-lg px-8 min-w-[120px]'
        }`}
        onClick={handleSearch}
      >
        {t('home.search.button') || 'Search'}
      </button>
    </div>
  );
}