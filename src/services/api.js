import axios from 'axios';

const API_URL = 'https://us-central1-habit-tracker-7df86.cloudfunctions.net/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token...');
        const { data } = await axios.post(`${API_URL}/auth/token`, { token: refreshToken });
        console.log('Token refreshed:', data.accessToken);
        
        localStorage.setItem('token', data.accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchHabits = async () => {
  try {
    const response = await api.get('/habits');
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

export const createHabit = async (habitData) => {
  try {
    console.log('Creating habit with data:', habitData);
    const response = await api.post('/habits', habitData);
    console.log('Created habit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateHabit = async (habitId, habitData) => {
  try {
    console.log('Updating habit with data:', habitData);
    const response = await api.patch(`/habits/${habitId}`, habitData);
    console.log('Update habit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const updateHabitLog = async (habitId, logData) => {
  try {
    console.log('Updating habit log with data:', logData);
    const response = await api.patch(`/habits/${habitId}/log`, logData);
    return response.data;
  } catch (error) {
    console.error('Error updating habit log:', error);
    throw error;
  }
};

export const deleteHabit = async (habitId) => {
  try {
    console.log('Deleting habit with ID:', habitId);
    const response = await api.delete(`/habits/${habitId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

// New area-related functions
export const fetchAreas = async () => {
  try {
    const response = await api.get('/areas');
    return response.data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

export const createArea = async (areaData) => {
  try {
    console.log('Creating area with data:', areaData);
    const response = await api.post('/areas', areaData);
    console.log('Created area response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating area:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateArea = async (areaId, areaData) => {
  try {
    console.log('Updating area with data:', areaData);
    const response = await api.patch(`/areas/${areaId}`, areaData);
    return response.data;
  } catch (error) {
    console.error('Error updating area:', error);
    throw error;
  }
};

export const deleteArea = async (areaId) => {
  try {
    console.log('Deleting area with ID:', areaId);
    const response = await api.delete(`/areas/${areaId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting area:', error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  console.log("Logout function in api.js called");
  try {
    // Perform any server-side logout if necessary
    // await api.post('/auth/logout');
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('habits');
    localStorage.removeItem('areas');
    
    // Clear the Authorization header
    delete api.defaults.headers.common['Authorization'];
    
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export default api;
