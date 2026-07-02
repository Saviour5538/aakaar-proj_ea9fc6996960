import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient, updateClient, getClient } from '../api/client';
import { Client } from '../api/client';

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client>({
    id: '',
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getClient(id);
          setClient(response);
        } catch (err) {
          setError('Failed to fetch client details.');
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateClient(id, client);
      } else {
        await createClient(client);
      }
      navigate('/clients');
    } catch (err) {
      setError('Failed to save client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Client' : 'Add New Client'}</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={client.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;