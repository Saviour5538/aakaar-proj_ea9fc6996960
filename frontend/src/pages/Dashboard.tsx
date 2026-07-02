import React, { useEffect, useState } from 'react';
import { listDocuments } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Document {
  id: string;
  name: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listDocuments();
        setDocumentCount(response.length);
        setRecentDocuments(response.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">Total Documents</h2>
              <p className="text-2xl font-bold">{documentCount}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">User</h2>
              <p className="text-2xl font-bold">{user?.name || 'N/A'}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="flex flex-col space-y-2">
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Upload Document
                </button>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                  Start a Query
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
            {recentDocuments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <li key={doc.id} className="py-2">
                    <div className="flex justify-between">
                      <span>{doc.name}</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent documents available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;