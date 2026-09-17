const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed.');
    error.status = response.status;
    error.details = data.details || [];
    throw error;
  }

  return data;
}

async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      const connectionError = new Error('Unable to connect to server. Please try again.');
      connectionError.isConnectionError = true;
      throw connectionError;
    }
    throw error;
  }
}

export const studentApi = {
  getAll: () => request('/students'),
  getById: (id) => request(`/students/${id}`),
  create: (student) =>
    request('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    }),
  update: (id, student) =>
    request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    }),
  delete: (id) =>
    request(`/students/${id}`, {
      method: 'DELETE',
    }),
  search: (query) => request(`/students/search?q=${encodeURIComponent(query)}`),
};
