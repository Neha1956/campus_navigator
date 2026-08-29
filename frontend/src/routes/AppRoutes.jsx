import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import MapPage from "../pages/MapPage";
import Locations from "../pages/Locations";
import LocationDetailsPage from "../pages/LocationDetailsPage";
import Directions from "../pages/Directions";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddLocationMap from "../pages/admin/AddLocationMap";
import ManageLocations from "../pages/admin/ManageLocations";
import RouteManagement from "../pages/admin/RouteManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/map" element={<MapPage />} />

      <Route path="/locations" element={<Locations />} />

      <Route
        path="/locations/:id"
        element={<LocationDetailsPage />}
      />

      <Route path="/directions" element={<Directions />} />

      <Route path="/admin" element={<AdminDashboard />} />

      <Route
        path="/admin/add-location"
        element={<AddLocationMap />} />

      <Route
        path="/admin/edit-location/:id"
        element={<AddLocationMap />} />

      <Route
        path="/admin/manage-locations"
        element={<ManageLocations />}
      />

      <Route
        path="/admin/add-route"
        element={<RouteManagement />}
      />
    </Routes>
  );
};

export default AppRoutes;