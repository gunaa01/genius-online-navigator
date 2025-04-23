import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useCachePerformance } from '@/hooks/useCache';
import { enhancedApiClient } from '@/services/api/enhancedApiClient';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

/**
 * Cache Performance Monitor Component
 * 
 * Displays real-time metrics and visualizations of the cache system performance
 */
const CachePerformanceMonitor: React.FC = () => {
  const { metrics, getResponseTimeAnalysis, resetMetrics } = useCachePerformance();
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [responseAnalysis, setResponseAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'response-times' | 'storage' | 'history'>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);

  // Fetch response time analysis
  useEffect(() => {
    const analysis = getResponseTimeAnalysis();
    setResponseAnalysis(analysis);
  }, [getResponseTimeAnalysis, metrics]);

  // Add current metrics to time series data
  useEffect(() => {
    if (metrics) {
      setTimeSeriesData(prev => {
        // Limit to last 20 data points
        const newData = [...prev, { ...metrics, time: new Date().toLocaleTimeString() }];
        if (newData.length > 20) {
          return newData.slice(newData.length - 20);
        }
        return newData;
      });
    }
  }, [metrics]);

  // Auto-refresh metrics
  useEffect(() => {
    let intervalId: number;

    if (isAutoRefresh && refreshInterval > 0) {
      intervalId = window.setInterval(() => {
        const analysis = getResponseTimeAnalysis();
        setResponseAnalysis(analysis);
        
        // Also fetch cache stats from API client
        enhancedApiClient.getCacheStats().then(stats => {
          console.log('Cache stats:', stats);
        }).catch(err => {
          console.error('Error fetching cache stats:', err);
        });
      }, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoRefresh, refreshInterval, getResponseTimeAnalysis]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format time to human-readable format
  const formatTime = (ms: number): string => {
    if (ms < 1) return '< 1ms';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  // Handle reset metrics
  const handleResetMetrics = () => {
    resetMetrics();
    setTimeSeriesData([]);
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Hit Rate */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Cache Hit Rate</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-blue-600">{metrics.hitRate.toFixed(1)}%</span>
          <span className="text-sm text-gray-500 ml-2 mb-1">of requests</span>
        </div>
        <div className="mt-4 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Hits', value: metrics.hitRate },
                  { name: 'Misses', value: 100 - metrics.hitRate }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[2]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Avg Response Time</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-green-600">{formatTime(metrics.avgResponseTime)}</span>
        </div>
        <div className="mt-4 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Cached', value: responseAnalysis?.cached?.avg || 0 },
                { name: 'Uncached', value: responseAnalysis?.uncached?.avg || 0 }
              ]}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatTime(Number(value))} />
              <Bar dataKey="value" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bandwidth Saved */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Bandwidth Saved</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-purple-600">{formatBytes(metrics.bandwidthSaved)}</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {metrics.requestsSaved} network requests saved
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {metrics.entryCount} items in cache
          </p>
        </div>
      </div>

      {/* Performance Improvement */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Performance Improvement</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-indigo-600">
            {responseAnalysis?.improvement?.percentImprovement.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500 ml-2 mb-1">faster</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {formatTime(responseAnalysis?.improvement?.avgImprovement || 0)} saved per request
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {formatTime(responseAnalysis?.improvement?.timeSaved || 0)} total time saved
          </p>
        </div>
      </div>

      {/* Cache Size */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Cache Storage</h3>
        <div className="flex items-end">
          <span className="text-3xl font-bold text-orange-600">{metrics.entryCount}</span>
          <span className="text-sm text-gray-500 ml-2 mb-1">entries</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {metrics.evictions} evictions
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {metrics.expirations} expirations
          </p>
        </div>
      </div>

      {/* Cache Status */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Cache Status</h3>
        <div className="flex items-center mt-2">
          <div className={`w-3 h-3 rounded-full ${metrics.hitRate > 50 ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
          <span className="text-sm">
            {metrics.hitRate > 50 ? 'Healthy' : 'Needs Optimization'}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="mt-2">
          <button
            onClick={handleResetMetrics}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Reset Metrics
          </button>
        </div>
      </div>
    </div>
  );

  // Render response times tab
  const renderResponseTimes = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Response Time Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-md font-medium text-gray-600 mb-2">Cached Responses</h4>
          <table className="min-w-full">
            <tbody>
              <tr>
                <td className="py-1 text-sm text-gray-500">Min:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.cached?.min || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Max:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.cached?.max || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Average:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.cached?.avg || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Median:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.cached?.median || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">95th Percentile:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.cached?.p95 || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Count:</td>
                <td className="py-1 text-sm font-medium">{responseAnalysis?.cached?.count || 0} requests</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-600 mb-2">Uncached Responses</h4>
          <table className="min-w-full">
            <tbody>
              <tr>
                <td className="py-1 text-sm text-gray-500">Min:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.uncached?.min || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Max:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.uncached?.max || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Average:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.uncached?.avg || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Median:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.uncached?.median || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">95th Percentile:</td>
                <td className="py-1 text-sm font-medium">{formatTime(responseAnalysis?.uncached?.p95 || 0)}</td>
              </tr>
              <tr>
                <td className="py-1 text-sm text-gray-500">Count:</td>
                <td className="py-1 text-sm font-medium">{responseAnalysis?.uncached?.count || 0} requests</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { 
                name: 'Min', 
                cached: responseAnalysis?.cached?.min || 0, 
                uncached: responseAnalysis?.uncached?.min || 0 
              },
              { 
                name: 'Avg', 
                cached: responseAnalysis?.cached?.avg || 0, 
                uncached: responseAnalysis?.uncached?.avg || 0 
              },
              { 
                name: 'Median', 
                cached: responseAnalysis?.cached?.median || 0, 
                uncached: responseAnalysis?.uncached?.median || 0 
              },
              { 
                name: 'P95', 
                cached: responseAnalysis?.cached?.p95 || 0, 
                uncached: responseAnalysis?.uncached?.p95 || 0 
              },
              { 
                name: 'Max', 
                cached: responseAnalysis?.cached?.max || 0, 
                uncached: responseAnalysis?.uncached?.max || 0 
              }
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatTime(value)} />
            <Tooltip formatter={(value) => formatTime(Number(value))} />
            <Legend />
            <Bar dataKey="cached" name="Cached" fill={COLORS[0]} />
            <Bar dataKey="uncached" name="Uncached" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Render storage tab
  const renderStorage = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Cache Storage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="text-md font-medium text-gray-600 mb-2">Entries</h4>
          <div className="text-2xl font-bold">{metrics.entryCount}</div>
          <div className="text-sm text-gray-500 mt-1">items in cache</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="text-md font-medium text-gray-600 mb-2">Evictions</h4>
          <div className="text-2xl font-bold">{metrics.evictions}</div>
          <div className="text-sm text-gray-500 mt-1">items removed due to capacity</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="text-md font-medium text-gray-600 mb-2">Expirations</h4>
          <div className="text-2xl font-bold">{metrics.expirations}</div>
          <div className="text-sm text-gray-500 mt-1">items expired by TTL</div>
        </div>
      </div>
      
      <div className="h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: 'Current Entries', value: metrics.entryCount },
                { name: 'Evictions', value: metrics.evictions },
                { name: 'Expirations', value: metrics.expirations }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {[0, 1, 2].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Render history tab
  const renderHistory = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Performance History</h3>
      
      <div className="h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeSeriesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" orientation="left" stroke={COLORS[0]} />
            <YAxis yAxisId="right" orientation="right" stroke={COLORS[1]} />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="hitRate" 
              name="Hit Rate (%)" 
              stroke={COLORS[0]} 
              activeDot={{ r: 8 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="avgResponseTime" 
              name="Avg Response Time (ms)" 
              stroke={COLORS[1]} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeSeriesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="entryCount" 
              name="Cache Entries" 
              stroke={COLORS[2]} 
            />
            <Line 
              type="monotone" 
              dataKey="requestsSaved" 
              name="Requests Saved" 
              stroke={COLORS[3]} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cache Performance Monitor</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="refresh-interval" className="text-sm text-gray-600 mr-2">
              Refresh:
            </label>
            <select
              id="refresh-interval"
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="1000">1s</option>
              <option value="5000">5s</option>
              <option value="10000">10s</option>
              <option value="30000">30s</option>
              <option value="60000">1m</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={isAutoRefresh}
              onChange={() => setIsAutoRefresh(!isAutoRefresh)}
              className="mr-2"
            />
            <label htmlFor="auto-refresh" className="text-sm text-gray-600">
              Auto-refresh
            </label>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('response-times')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'response-times'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Response Times
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'storage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Storage
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              History
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'response-times' && renderResponseTimes()}
      {activeTab === 'storage' && renderStorage()}
      {activeTab === 'history' && renderHistory()}
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Cache Management</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => enhancedApiClient.clearCache()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Clear All Cache
          </button>
          <button
            onClick={handleResetMetrics}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Reset Metrics
          </button>
        </div>
      </div>
    </div>
  );
};

export default CachePerformanceMonitor;
