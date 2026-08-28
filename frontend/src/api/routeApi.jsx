import api from "./axios";

export const getRoutes = async () => {
  const response = await api.get("/routes");

  return response.data;
};

export const getRouteById = async (id) => {
  const response = await api.get(`/routes/${id}`);

  return response.data;
};

export const createRoute = async (data) => {
  const response = await api.post("/routes", data);

  return response.data;
};

export const updateRoute = async (id, data) => {
  const response = await api.put(`/routes/${id}`, data);

  return response.data;
};

export const deleteRoute = async (id) => {
  const response = await api.delete(`/routes/${id}`);

  return response.data;
};
export const getRouteBetweenLocations = async (from, to) => {
  const response = await api.get(
    `/routes/between/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
  );

  return response.data;
};