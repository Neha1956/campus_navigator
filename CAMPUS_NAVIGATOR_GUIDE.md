# Campus Navigator - Dynamic 3D Campus Map System

## 📋 Project Overview

Campus Navigator is a comprehensive **Dynamic Campus Map Management & Indoor Navigation System** built with:

- **Frontend**: React + Redux + Three.js + React Three Fiber + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB (with Building, Floor, MapElement, Location, Route models)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMPUS NAVIGATOR                         │
├──────────────────────┬──────────────────────────────────────┤
│  ADMIN PANEL         │  USER INTERFACE                      │
├──────────────────────┼──────────────────────────────────────┤
│  Map Builder (2D)    │  Campus 3D Viewer                    │
│  ├ Buildings         │  ├ Floor Navigation                  │
│  ├ Floors            │  ├ 3D Building Visualization         │
│  ├ Rooms/Elements    │  ├ Location Search                   │
│  └ Routes            │  └ Route Display                     │
├──────────────────────┼──────────────────────────────────────┤
│     Redux Store      │  Redux Store                         │
│  (Buildings, Floors, │  (Buildings, Floors,                 │
│   MapElements)       │   Locations, Routes)                 │
├──────────────────────┴──────────────────────────────────────┤
│                  REST API (Express)                         │
├─────────────────────────────────────────────────────────────┤
│              MongoDB Database                               │
│  ├── Buildings                                              │
│  ├── Floors                                                 │
│  ├── MapElements (Rooms, Walls, Stairs, etc.)              │
│  ├── Locations (Departments, Labs, etc.)                   │
│  └── Routes (Navigation paths)                             │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Models

### Building
```javascript
{
  name: String,
  description: String,
  position: { x, y, z },
  dimensions: { width, depth, height },
  rotation: { x, y, z },
  color: String,
  floors: [ObjectId],
  isActive: Boolean
}
```

### Floor
```javascript
{
  name: String,
  floorNumber: Number,
  buildingId: ObjectId,
  width: Number,
  height: Number,
  heightZ: Number,
  mapElements: [ObjectId],
  backgroundColor: String,
  layoutData: Object,
  isActive: Boolean
}
```

### MapElement
```javascript
{
  floorId: ObjectId,
  type: String (room, wall, door, staircase, corridor, washroom, etc.),
  name: String,
  position: { x, y, z },
  dimensions: { width, height, depth },
  rotation: { x, y, z },
  color: String,
  strokeColor: String,
  connectsTo: [{ elementId, floorId }],
  roomNumber: String,
  capacity: Number,
  description: String,
  isActive: Boolean
}
```

## 🚀 Getting Started

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-navigator
PORT=5000
```

3. **Start the server:**
```bash
npm run dev
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

## 📍 Key Features

### For Admins (Map Builder)
- ✅ **Create Buildings** - Define building properties and dimensions
- ✅ **Manage Floors** - Create multiple floors per building with custom dimensions
- ✅ **2D Map Editor** - Drag-and-drop interface for placing rooms and elements
- ✅ **Element Customization** - Change colors, sizes, properties
- ✅ **Grid Snapping** - Precision placement with grid assistance
- ✅ **Multi-floor Support** - Connect stairs/lifts between floors
- ✅ **Real-time Sync** - Changes saved to database immediately

### For Users (Campus Navigator)
- ✅ **3D Campus Visualization** - Interactive 3D view of entire campus
- ✅ **Floor Navigation** - Switch between floors in 3D
- ✅ **Building Selection** - View specific buildings and their layouts
- ✅ **Location Search** - Find departments, labs, offices
- ✅ **Route Planning** - Get directions between locations
- ✅ **Interactive Elements** - Hover over rooms for details

## 🎮 Using the Admin Map Builder

### Creating a Building

1. Go to `/admin/map-builder`
2. Click **"Create Building"** button
3. Enter building details:
   - Name: e.g., "RCIT Building"
   - Description: Building information
   - Dimensions: Width, Depth, Height
4. Click **Create**

### Creating Floors

1. Select a building from the left panel
2. Click **"Add Floor"** button
3. Enter floor details:
   - Name: e.g., "Ground Floor", "1st Floor"
   - Floor Number: 0 (ground), 1 (1st), etc.
   - Dimensions: Width and Height for 2D layout
   - Height Z: Position in 3D space (0 for ground, 4 for 1st floor)
4. Click **Create**

### Editing Floor Layout

1. Select a floor from the building
2. **Map Builder opens** with 2D canvas
3. **Select tools from toolbar:**
   - 📍 **Select**: Choose existing elements
   - 🧱 **Room**: Add classroom/office rooms
   - 🚪 **Door**: Add doors
   - 🛗 **Staircase**: Add stairs for multi-floor connection
   - 🚻 **Washroom**: Add restrooms
   - 📦 **Corridor**: Add hallways
   - 🏢 **Lab**: Add laboratories
   - 🎓 **Classroom**: Add classrooms
   - 🏢 **Office**: Add office spaces

4. **Click on canvas** to place elements
5. **Enter element details** (name, size)
6. **Drag elements** to reposition
7. **Select element** to see properties on right panel
8. **Delete** using trash button

## 🎨 Map Builder Controls

| Control | Action |
|---------|--------|
| **Tool Buttons** | Select tool type |
| **Click Canvas** | Place element |
| **Drag Element** | Move element |
| **Delete Button** | Remove element |
| **Color Input** | Change element color |
| **Properties Panel** | View/edit element details |

## 🌐 API Endpoints

### Buildings
```
GET    /api/buildings              - Get all buildings
GET    /api/buildings/:id          - Get single building with floors
POST   /api/buildings              - Create building
PUT    /api/buildings/:id          - Update building
DELETE /api/buildings/:id          - Delete building
```

### Floors
```
GET    /api/floors/building/:id    - Get floors by building
GET    /api/floors/:id             - Get single floor
POST   /api/floors                 - Create floor
PUT    /api/floors/:id             - Update floor
PATCH  /api/floors/:id/layout      - Update floor layout
DELETE /api/floors/:id             - Delete floor
```

### Map Elements
```
GET    /api/map-elements/floor/:id        - Get elements by floor
GET    /api/map-elements/:id              - Get single element
POST   /api/map-elements                  - Create element
PUT    /api/map-elements/:id              - Update element
PATCH  /api/map-elements/:id/position     - Update position
PATCH  /api/map-elements/:id/dimensions   - Update dimensions
POST   /api/map-elements/:id/connect      - Add connection
DELETE /api/map-elements/:id              - Delete element
PATCH  /api/map-elements/batch/update     - Batch update
```

## 🎯 Using Campus 3D Map (User View)

1. Navigate to `/campus-3d`
2. **Left Sidebar Shows:**
   - List of all buildings
   - Expandable floors for each building
   - Floor details when selected

3. **3D Canvas Shows:**
   - Interactive 3D view of campus
   - Buildings as 3D structures
   - Rooms as colored boxes
   - Floor planes for navigation

4. **Controls:**
   - **Scroll**: Zoom in/out
   - **Right Click + Drag**: Rotate view
   - **Middle Click + Drag**: Pan camera
   - **Click Floor**: Select floor for details

## 📦 Project Structure

```
compus_Navigator/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Building.js
│   │   │   ├── Floor.js
│   │   │   ├── MapElement.js
│   │   │   ├── Location.js
│   │   │   └── Route.js
│   │   ├── controllers/
│   │   │   ├── buildingController.js
│   │   │   ├── floorController.js
│   │   │   ├── mapElementController.js
│   │   │   ├── locationController.js
│   │   │   └── routeController.js
│   │   ├── routes/
│   │   │   ├── buildingRoutes.js
│   │   │   ├── floorRoutes.js
│   │   │   ├── mapElementRoutes.js
│   │   │   ├── locationRoutes.js
│   │   │   └── routeRoutes.js
│   │   └── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── MapBuilder.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── map/
│   │   │   │   └── CampusViewer3D.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Campus3DMap.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminMapManagement.jsx
│   │   │   └── ...
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── buildingSlice.jsx
│   │   │   │   ├── floorSlice.jsx
│   │   │   │   ├── mapElementSlice.jsx
│   │   │   │   └── ...
│   │   │   └── store.jsx
│   │   ├── api/
│   │   │   ├── campusMapApi.jsx
│   │   │   └── ...
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration
Update the API URL in `campusMapApi.jsx` if backend is on different server:
```javascript
const API_URL = "http://your-backend-url/api";
```

## 📱 Responsive Design

- ✅ Admin Map Builder works on desktop (optimized for 1920x1080+)
- ✅ 3D Viewer requires modern browser with WebGL support
- ✅ Sidebar collapses on smaller screens
- ✅ Touch-friendly for tablet usage

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI framework
- **Redux Toolkit** - State management
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful utilities for React Three Fiber
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Cloudinary** - Image storage (for location photos)

## 📝 Example: Creating a Complete Campus Layout

### Step 1: Create Building
```javascript
POST /api/buildings
{
  name: "RCIT Building",
  description: "Main academic building",
  position: { x: 0, y: 0, z: 0 },
  dimensions: { width: 100, depth: 80, height: 35 }
}
```

### Step 2: Create Floors
```javascript
POST /api/floors
{
  name: "Ground Floor",
  floorNumber: 0,
  buildingId: "building_id",
  width: 800,
  height: 600,
  heightZ: 0
}

POST /api/floors
{
  name: "1st Floor",
  floorNumber: 1,
  buildingId: "building_id",
  width: 800,
  height: 600,
  heightZ: 4
}
```

### Step 3: Add Elements
```javascript
POST /api/map-elements
{
  floorId: "floor_id",
  type: "room",
  name: "CSE Lab",
  position: { x: 50, y: 50, z: 0 },
  dimensions: { width: 200, height: 150, depth: 0 },
  color: "#DCF7E0"
}
```

## 🐛 Troubleshooting

### 3D Viewer Not Loading
- Check browser WebGL support
- Ensure Three.js is properly installed
- Check browser console for errors

### Elements Not Appearing
- Verify MapElement documents in MongoDB
- Check floor ID is correctly referenced
- Ensure mapElements array in Floor document is populated

### API Connection Issues
- Check backend server is running on correct port
- Verify CORS is configured in Express
- Check MongoDB connection string

## 📚 Future Enhancements

- [ ] Real-time collaborative editing
- [ ] AR/VR campus navigation
- [ ] Mobile app (React Native)
- [ ] Advanced routing algorithms
- [ ] Event-based location notifications
- [ ] Student directory integration
- [ ] Building capacity visualization
- [ ] Indoor positioning system (IPS)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Inspect browser console for errors
4. Check MongoDB connection and data integrity

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development
