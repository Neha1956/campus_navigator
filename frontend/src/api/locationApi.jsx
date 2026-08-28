import api from "./axios";

export const getLocations = async () => {
  const response = await api.get("/locations");
  return response.data;
};

export const getLocationById = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

export const createLocation = async (data) => {
  const response = await api.post("/locations", data);
  return response.data;
};

export const updateLocation = async (id, data) => {
  const response = await api.put(`/locations/${id}`, data);
  return response.data;
};

export const deleteLocation = async (id) => {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
};