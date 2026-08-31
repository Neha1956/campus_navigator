import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Building APIs
export const buildingAPI = {
  getAll: () => axios.get(`${API_URL}/buildings`),
  getById: (id) => axios.get(`${API_URL}/buildings/${id}`),
  create: (data) => axios.post(`${API_URL}/buildings`, data),
  update: (id, data) => axios.put(`${API_URL}/buildings/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/buildings/${id}`),
};

// Floor APIs
export const floorAPI = {
  getByBuilding: (buildingId) =>
    axios.get(`${API_URL}/floors/building/${buildingId}`),
  getById: (id) => axios.get(`${API_URL}/floors/${id}`),
  create: (data) => axios.post(`${API_URL}/floors`, data),
  update: (id, data) => axios.put(`${API_URL}/floors/${id}`, data),
  updateLayout: (id, layoutData) =>
    axios.patch(`${API_URL}/floors/${id}/layout`, { layoutData }),
  delete: (id) => axios.delete(`${API_URL}/floors/${id}`),
};

// Map Element APIs
export const mapElementAPI = {
  getByFloor: (floorId) =>
    axios.get(`${API_URL}/map-elements/floor/${floorId}`),
  getById: (id) => axios.get(`${API_URL}/map-elements/${id}`),
  create: (data) => axios.post(`${API_URL}/map-elements`, data),
  update: (id, data) => axios.put(`${API_URL}/map-elements/${id}`, data),
  updatePosition: (id, position) =>
    axios.patch(`${API_URL}/map-elements/${id}/position`, { position }),
  updateDimensions: (id, dimensions) =>
    axios.patch(`${API_URL}/map-elements/${id}/dimensions`, { dimensions }),
  addConnection: (id, connectElementId, connectFloorId) =>
    axios.post(`${API_URL}/map-elements/${id}/connect`, {
      connectElementId,
      connectFloorId,
    }),
  delete: (id) => axios.delete(`${API_URL}/map-elements/${id}`),
  batchUpdate: (elementIds, updates) =>
    axios.patch(`${API_URL}/map-elements/batch/update`, {
      elementIds,
      updates,
    }),
};

export default {
  buildingAPI,
  floorAPI,
  mapElementAPI,
};
