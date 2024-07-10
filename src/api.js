import axios from 'axios';

const BASE_URL = 'https://aircall-backend.onrender.com';

// Function to fetch all calls (activities) from the API
export const getActivities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/activities`);
    return response.data;
  } catch (error) {
    throw error; // Propagate the error back to the caller
  }
};

// Function to update a call (activity) by ID
export const updateActivity = async (id, data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/activities/${id}`, data);
    return response.data; // Assuming API returns updated call data
  } catch (error) {
    throw error; // Propagate the error back to the caller
  }
};

// Function to reset all calls to initial state
export const resetCalls = async () => {
  try {
    const response = await axios.patch(`${BASE_URL}/reset`);
    return response.data; // Assuming API returns success message or updated call data
  } catch (error) {
    throw error; // Propagate the error back to the caller
  }
};
