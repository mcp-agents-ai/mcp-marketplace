import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, ExternalLink, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MCPServer } from '../types';

interface ServerCardProps {
  server: MCPServer;
}

export function ServerCard({ server }: ServerCardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={server.hubId ? `/server/${server.hubId}` : '#'} className="block p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {server.logoUrl ? (
              <img src={server.logoUrl} alt={server.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex-shrink-0" />
            ) : (
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Database className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{server.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{t('server.by')} {server.author}</p>
            </div>
          </div>
          {server.isRecommended && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2 sm:mt-0 self-start">
              {t('server.recommended')}
            </span>
          )}
        </div>
        
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 line-clamp-2">{server.description}</p>
        
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {server.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">{server.githubStars.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Download className="h-4 w-4 mr-1" />
              <span className="text-sm">{server.downloadCount.toLocaleString()}</span>
            </div>
          </div>
          
          <a
            href={server.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center px-3 py-1 sm:py-1.5 border border-blue-500 text-xs sm:text-sm leading-4 font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-150"
          >
            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
            {t('server.viewOnGithub')}
          </a>
        </div>
      </Link>
    </div>
  );
}