import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ServerCard } from '../components/ServerCard';
import { fetchMCPServers } from '../data/servers';
import { MCPServer } from '../types';
import { Plug, Zap, Link } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Home() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [servers, setServers] = useState<MCPServer[]>([]);

  useEffect(() => {
    const loadServers = async () => {
      const data = await fetchMCPServers();
      setServers(data);
    };
    loadServers();
  }, []);

  const filteredServers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return servers.filter((server) => (
      server.name.toLowerCase().includes(query) ||
      server.author.toLowerCase().includes(query) ||
      server.description.toLowerCase().includes(query) ||
      server.tags.some((tag) => tag.toLowerCase().includes(query))
    ));
  }, [searchQuery, servers]);

  // Split servers into recommended and others
  const recommendedServers = useMemo(() => {
    return filteredServers.filter(server => server.isRecommended);
  }, [filteredServers]);

  const otherServers = useMemo(() => {
    return filteredServers.filter(server => !server.isRecommended);
  }, [filteredServers]);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('home.tagline')}</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/10 backdrop-blur-lg">
              <Plug className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.feature1.title')}</h3>
              <p className="text-blue-100">{t('home.feature1.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/10 backdrop-blur-lg">
              <Zap className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.feature2.title')}</h3>
              <p className="text-blue-100">{t('home.feature2.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/10 backdrop-blur-lg">
              <Link className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('home.feature3.title')}</h3>
              <p className="text-blue-100">{t('home.feature3.description')}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('home.discover.title')}
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {t('home.discover.description')}
          </p>
          <p className="mt-3 text-lg text-indigo-600 font-medium">
            {servers.length} {t('home.serverCount', { count: servers.length })}
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Recommended Servers Section */}
        {recommendedServers.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {t('home.recommendedServers')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedServers.map((server) => (
                <ServerCard key={server.mcpId} server={server} />
              ))}
            </div>
          </div>
        )}

        {/* All Other Servers */}
        {otherServers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {otherServers.length > 0 && recommendedServers.length > 0 ? t('home.otherServers') : ''}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServers.map((server) => (
                <ServerCard key={server.mcpId} server={server} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}