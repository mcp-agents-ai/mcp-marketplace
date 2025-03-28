import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Star, ArrowUp, ArrowDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export function CustomDropdown({ options, value, onChange, icon }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 根据value找到当前选中的option
  const selectedOption = options.find(option => option.value === value) || options[0];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // 获取选项图标
  const getOptionIcon = (optionValue: string) => {
    if (optionValue === 'stars-desc') {
      return <ArrowDown className="h-4 w-4 text-indigo-600 inline mr-1" />;
    } else if (optionValue === 'stars-asc') {
      return <ArrowUp className="h-4 w-4 text-indigo-600 inline mr-1" />;
    } else if (optionValue.includes('stars')) {
      return <Star className="h-4 w-4 text-yellow-500 inline mr-1" />;
    }
    return null;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-indigo-500 transition-colors duration-200 shadow-sm group"
      >
        {icon && <span className="mr-2 group-hover:scale-110 transition-transform">{icon}</span>}
        <span className="text-gray-700 font-medium">{selectedOption.label}</span>
        <ChevronRight className={`h-4 w-4 ml-2 text-indigo-600 transition-transform duration-200 ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full min-w-[200px] bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-200 animate-fadeIn">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors
                  ${value === option.value 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'text-gray-700'}`}
              >
                {getOptionIcon(option.value)}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 