import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createDocument, updateDocument, getDocument, Document } from '../api/client';

const DocumentsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Document>({
    id: '',
    name: '',
    type: '',
    createdAt: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchDocument = async () => {
        setLoading(true);
        setError(null);
        try {
          const document = await getDocument(id);
          setFormData(document);
        } catch (err) {
          setError('Failed to fetch document.');
        } finally {
          setLoading(false);
        }
      };

      fetchDocument();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateDocument(id, formData);
      } else {
        await createDocument(formData);
      }
      navigate('/documents');
    } catch (err) {
      setError('Failed to save document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Document' : 'New Document'}</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          >
            <option value="">Select Type</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
          </select>
        </div>
        <div>
          <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
            Created At
          </label>
          <input
            type="date"
            id="createdAt"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/documents')}
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

export default DocumentsForm;