import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { BarChart, LineChart, Download, Calendar } from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';

const Reports = () => {
  const { theme } = useContext(ThemeContext);
  const [reportType, setReportType] = useState('revenue');
  const [timeFrame, setTimeFrame] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [reportType, timeFrame]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/reports/${reportType}`, {
        params: { timeFrame }
      });
      setReportData(response.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await axios.get(`/admin/export/${reportType}/`, {
        params: { timeFrame },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>Reports & Analytics</h2>

        <div className="flex items-center space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="revenue">Revenue</option>
            <option value="enrollments">Enrollments</option>
            <option value="users">User Growth</option>
            <option value="courses">Course Analytics</option>
          </select>

          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>

          <button
            onClick={handleExportReport}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`text-center py-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>Loading report data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary Cards */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Summary</h3>
            {reportData?.summary && (
              <div className="space-y-4">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className={`capitalize ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {typeof value === 'number' && key.includes('revenue')
                        ? `₹${value.toLocaleString()}`
                        : value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Trend</h3>
            {/* Chart would be implemented here */}
            <div className={`h-64 flex items-center justify-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Chart visualization would go here
            </div>
          </div>

          {/* Detailed Data Table */}
          {reportData?.details && (
            <div className="col-span-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    <th className="px-4 py-3 text-left">Date</th>
                    {Object.keys(reportData.details[0] || {})
                      .filter(key => key !== 'date')
                      .map(key => (
                        <th key={key} className="px-4 py-3 text-left capitalize">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {reportData.details.map((row, index) => (
                    <tr key={index} className={`border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      {Object.entries(row).map(([key, value]) => (
                        <td key={key} className={`px-4 py-3 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {key === 'date'
                            ? new Date(value).toLocaleDateString()
                            : typeof value === 'number' && key.includes('revenue')
                              ? `₹${value.toLocaleString()}`
                              : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
