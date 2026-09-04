import api from "./axios";

//const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Building APIs
export const buildingAPI = {
  getAll: () => api.get(`/buildings`),
  getById: (id) => api.get(`/buildings/${id}`),
  create: (data) => api.post(`/buildings`, data),
  update: (id, data) => api.put(`/buildings/${id}`, data),
  delete: (id) => api.delete(`/buildings/${id}`),
};

// Floor APIs
export const floorAPI = {
  getByBuilding: (buildingId) =>
    api.get(`/floors/building/${buildingId}`),
  getById: (id) => api.get(`/floors/${id}`),
  create: (data) => api.post(`/floors`, data),
  update: (id, data) => api.put(`/floors/${id}`, data),
  updateLayout: (id, layoutData) =>
    api.patch(`/floors/${id}/layout`, { layoutData }),
  delete: (id) => api.delete(`/floors/${id}`),
};

// Map Element APIs
export const mapElementAPI = {
  getByFloor: (floorId) =>
    api.get(`/map-elements/floor/${floorId}`),
  getById: (id) => api.get(`/map-elements/${id}`),
  create: (data) => api.post(`/map-elements`, data),
  update: (id, data) => api.put(`/map-elements/${id}`, data),
  updatePosition: (id, position) =>
    api.patch(`/map-elements/${id}/position`, { position }),
  updateDimensions: (id, dimensions) =>
    api.patch(`/map-elements/${id}/dimensions`, { dimensions }),
  addConnection: (id, connectElementId, connectFloorId) =>
    api.post(`/map-elements/${id}/connect`, {
      connectElementId,
      connectFloorId,
    }),
  delete: (id) => api.delete(`/map-elements/${id}`),
  batchUpdate: (elementIds, updates) =>
    api.patch(`/map-elements/batch/update`, {
      elementIds,
      updates,
    }),
};

export default {
  buildingAPI,
  floorAPI,
  mapElementAPI,
};
