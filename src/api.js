const API_URL = 'https://localhost:61711/api'; // change to your real API, not port 3001

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const getEmployees = () => request('/employees');

export const createEmployee = (data) =>
  request('/employees', { method: 'POST', body: JSON.stringify(data) });

export const updateEmployee = (id, data) =>
  request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteEmployee = (id) =>
  request(`/employees/${id}`, { method: 'DELETE' });