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
import AdminMapManagement from "../pages/admin/AdminMapManagement";
import Campus3DMapPage from "../pages/Campus3DMap";
import AdminCampusBuilder from "../pages/admin/AdminCampusBuilder";
import AdminLogin from "../pages/admin/AdminLogin";
import ProtectedRoute from "../utils/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/campus-3d" element={<Campus3DMapPage />} />
      <Route path="/locations" element={<Locations />} />
      <Route path="/locations/:id" element={<LocationDetailsPage />} />
      <Route path="/directions" element={<Directions />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-location"
        element={
          <ProtectedRoute>
            <AddLocationMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-location/:id"
        element={
          <ProtectedRoute>
            <AddLocationMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-locations"
        element={
          <ProtectedRoute>
            <ManageLocations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-route"
        element={
          <ProtectedRoute>
            <RouteManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/map-builder"
        element={
          <ProtectedRoute>
            <AdminMapManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/campus-builder"
        element={
          <ProtectedRoute>
            <AdminCampusBuilder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;