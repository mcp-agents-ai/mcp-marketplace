import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MCPServer } from '../types';
import { Database, ChevronLeft, ExternalLink, Star, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function ServerDetails() {
  const { hubId } = useParams<{ hubId: string }>();
  const { t } = useLanguage();
  const [server, setServer] = useState<MCPServer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServerDetails() {
      try {
        const response = await fetch(`/v1/hub/servers/${hubId}`);
        if (!response.ok) {
          throw new Error(t('details.fetchError'));
        }
        const data = await response.json();
        setServer(data);
        setLoading(false);
      } catch (err) {
        setError(t('details.errorLoading'));
        setLoading(false);
        console.error('Error fetching server details:', err);
      }
    }

    if (hubId) {
      fetchServerDetails();
    }
  }, [hubId, t]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="animate-pulse">{t('details.loading')}</div>
      </div>
    );
  }

  if (error || !server) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-700">{error || t('details.serverNotFound')}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            ← {t('details.backToServers')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1">{t('details.backToServers')}</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Header section with responsive layout */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start">
              {server.logoUrl ? (
                <img src={server.logoUrl} alt={server.name} className="h-20 w-20 rounded-lg mr-6" />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center mr-6">
                  <Database className="h-10 w-10 text-blue-600" />
                </div>
              )}
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold text-gray-900">{server.name}</h1>
                  {server.isRecommended && (
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {t('server.recommended')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{t('server.by')} {server.author}</p>
                
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span>{server.githubStars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Download className="h-5 w-5 mr-1" />
                    <span>{server.downloadCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* GitHub link - styled with light background color */}
            <a
              href={server.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium self-start md:self-auto px-3 py-1.5 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('details.viewOnGithub')}
            </a>
          </div>

          {/* Server Information in single row */}
          <div className="mt-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-start gap-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">{t('details.category')}:</span>
                  <span className="text-gray-900">{server.category || t('details.notSpecified')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">{t('details.requiresApiKey')}:</span>
                  <span className="text-gray-900">{server.requiresApiKey ? t('common.yes') : t('common.no')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">{t('details.createdAt')}:</span>
                  <span className="text-gray-900">{new Date(server.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">{t('details.updatedAt')}:</span>
                  <span className="text-gray-900">{new Date(server.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('details.description')}</h2>
            <p className="text-gray-700 leading-relaxed">{server.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('details.tags')}</h2>
            <div className="flex flex-wrap gap-2">
              {server.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}