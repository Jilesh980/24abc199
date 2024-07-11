// api.js

import axios from 'axios';

const BASE_URL = 'https://aircall-backend.onrender.com';

// Function to fetch all calls
export const getActivities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/activities`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Function to fetch a specific call by ID
export const getActivityById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/activities/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update call (archive/unarchive)
export const updateCall = async (id, isArchived) => {
  try {
    const response = await axios.patch(`${BASE_URL}/activities/${id}`, {
      is_archived: isArchived,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to reset all calls
export const resetCalls = async () => {
  try {
    const response = await axios.patch(`${BASE_URL}/reset`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
