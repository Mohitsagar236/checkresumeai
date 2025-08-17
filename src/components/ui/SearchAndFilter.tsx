import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  id: string;
  label: string;
}

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: string[]) => void;
  filterOptions: FilterOption[];
  placeholder?: string;
}

export function SearchAndFilter({
  onSearch,
  onFilter,
  filterOptions,
  placeholder = 'Search...',
}: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    onFilter([]);
  };

  return (
    <div className="space-y-4 text-gray-900 dark:text-neutral-100">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-neutral-100 bg-white dark:bg-slate-800/90 dark:placeholder-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {selectedFilters.length > 0 && (
            <span className="ml-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
              {selectedFilters.length}
            </span>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-slate-800/90 rounded-lg shadow-sm dark:shadow-slate-900/30 border border-gray-200 dark:border-gray-700/50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Filter By</h3>
                {selectedFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleFilter(option.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedFilters.includes(option.id)
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 dark:border dark:border-blue-800/30'
                        : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 dark:border dark:border-slate-600/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}