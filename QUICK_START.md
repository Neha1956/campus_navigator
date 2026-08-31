# Quick Start Guide - Campus Navigator

## 🚀 Setup in 5 Minutes

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas)
- Modern browser with WebGL support

---

## ⚡ Quick Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/campus-navigator" > .env
echo "PORT=5000" >> .env

# Start server
npm run dev
```

**Expected output:**
```
Server running on port 5000
Connected to MongoDB
```

### 2. Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
Local: http://localhost:5173/
```

---

## 📍 Accessing the Application

### Admin Map Builder
Go to: **http://localhost:5173/admin/map-builder**

### 3D Campus Viewer
Go to: **http://localhost:5173/campus-3d**

---

## 🎯 First Steps

### Create Your First Campus Layout

#### Step 1: Create a Building (Admin)
1. Open Admin Map Builder
2. Click **"Create Building"** button
3. Enter:
   - Name: `RCIT Building`
   - Description: `Main academic block`
   - Width: `100`, Depth: `80`, Height: `35`
4. Click **Create**

#### Step 2: Create Floors
1. Click on the building you just created
2. Click **"Add Floor"** button
3. Create **Ground Floor**:
   - Name: `Ground Floor`
   - Floor Number: `0`
   - Width: `800`, Height: `600`
   - Height Z: `0`
   - Click **Create**

4. Create **1st Floor**:
   - Name: `1st Floor`
   - Floor Number: `1`
   - Width: `800`, Height: `600`
   - Height Z: `4`
   - Click **Create**

#### Step 3: Add Rooms (Map Builder)
1. Select the floor you created
2. **Map Builder** opens
3. Click **"Room"** button from toolbar
4. Click on canvas to place a room
5. Enter details:
   - Name: `CSE Lab`
   - Width: `150`, Height: `120`
   - Color: Green
6. Click **Add Element**

7. **Repeat** to add more rooms:
   - `Office` (yellow)
   - `Classroom` (blue)
   - `Washroom` (light blue)
   - `Corridor` (gray)

#### Step 4: View in 3D
1. Go to **3D Campus Viewer** (http://localhost:5173/campus-3d)
2. Select **RCIT Building** from left sidebar
3. Select **Ground Floor**
4. **3D view** shows your created layout!

---

## 🎮 Main Features

### Admin Map Builder

| Tool | Purpose |
|------|---------|
| 🧱 Room | Add classrooms/offices |
| 🚪 Door | Add doorways |
| 🛗 Staircase | Add stairs (connects floors) |
| 🚻 Washroom | Add bathrooms |
| 📦 Corridor | Add hallways |
| 🏢 Lab | Add laboratories |
| 🎓 Classroom | Add classrooms |
| 🏢 Office | Add offices |

**Canvas Actions:**
- **Drag element** = Move it
- **Click element** = Select it
- **Delete button** = Remove it
- **Right panel** = Edit properties

### 3D Campus Viewer

**Left Sidebar:**
- Building list
- Expandable floors
- Floor details

**Canvas:**
- Scroll = Zoom
- Right-click drag = Rotate
- Middle-click drag = Pan
- Click element = Highlight

---

## 📊 Database Structure (Quick Reference)

### Building Document
```javascript
{
  name: "RCIT Building",
  position: { x: 0, y: 0, z: 0 },
  dimensions: { width: 100, depth: 80, height: 35 }
}
```

### Floor Document
```javascript
{
  name: "Ground Floor",
  floorNumber: 0,
  buildingId: "...",
  width: 800,
  height: 600,
  heightZ: 0
}
```

### MapElement Document
```javascript
{
  floorId: "...",
  type: "room",
  name: "CSE Lab",
  position: { x: 50, y: 50, z: 0 },
  dimensions: { width: 200, height: 150, depth: 0 },
  color: "#DCF7E0"
}
```

---

## 🔗 API Quick Reference

### Get All Buildings
```bash
curl http://localhost:5000/api/buildings
```

### Create Building
```bash
curl -X POST http://localhost:5000/api/buildings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RCIT Building",
    "position": {"x": 0, "y": 0, "z": 0},
    "dimensions": {"width": 100, "depth": 80, "height": 35}
  }'
```

### Get Building with Floors
```bash
curl http://localhost:5000/api/buildings/{id}
```

### Create Floor
```bash
curl -X POST http://localhost:5000/api/floors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ground Floor",
    "floorNumber": 0,
    "buildingId": "...",
    "width": 800,
    "height": 600,
    "heightZ": 0
  }'
```

### Add Map Element
```bash
curl -X POST http://localhost:5000/api/map-elements \
  -H "Content-Type: application/json" \
  -d '{
    "floorId": "...",
    "type": "room",
    "name": "CSE Lab",
    "position": {"x": 50, "y": 50, "z": 0},
    "dimensions": {"width": 200, "height": 150, "depth": 0},
    "color": "#DCF7E0"
  }'
```

---

## ❌ Troubleshooting

### Issue: "Cannot GET /api/buildings"
**Solution:** 
- Backend not running? Start with `npm run dev`
- Check port is 5000
- Verify routes are registered in `app.js`

### Issue: "3D Viewer not loading"
**Solution:**
- Check browser console (F12) for errors
- Ensure WebGL is supported
- Try different browser (Chrome/Firefox recommended)

### Issue: "Elements not appearing in 3D"
**Solution:**
- Go back to Map Builder and add elements
- Verify floor ID matches
- Check elements in MongoDB

### Issue: Cannot create Building/Floor
**Solution:**
- Check all required fields are filled
- Verify building exists before creating floor
- Check MongoDB connection

---

## 📝 Next Steps

1. **Add More Locations** - Create departments, labs, offices
2. **Create Routes** - Define paths between locations
3. **Customize Colors** - Use color picker for branding
4. **Add Descriptions** - Fill in room details
5. **Connect Floors** - Use staircases to link floors
6. **Deploy** - Push to production server

---

## 🎓 Understanding the Architecture

```
User Request
    ↓
Frontend (React)
    ├── Redux (State)
    ├── Component (UI)
    └── API Call (Axios)
    ↓
Backend (Express API)
    ├── Routes (/api/buildings, /api/floors, etc.)
    ├── Controllers (Business Logic)
    └── Models (MongoDB)
    ↓
Database (MongoDB)
    ├── Buildings Collection
    ├── Floors Collection
    ├── MapElements Collection
    └── Locations Collection
    ↓
Response Back to Frontend
```

---

## 💡 Pro Tips

1. **Grid Snapping** - Elements automatically snap to 20px grid
2. **Batch Operations** - Multiple elements can be selected and updated
3. **Connections** - Stairs/lifts can connect floors for multi-floor routing
4. **Reusable Elements** - Copy element types across floors
5. **Real-time Sync** - Changes appear immediately without refresh

---

## 📞 Need Help?

### Check These First:
1. See CAMPUS_NAVIGATOR_GUIDE.md for detailed documentation
2. Check browser console (F12) for error messages
3. Verify MongoDB is running
4. Ensure both frontend and backend servers are running

### Common Commands:

```bash
# View backend logs
npm run dev

# View frontend logs
npm run dev

# Start fresh (clear node_modules)
rm -rf node_modules && npm install

# Check MongoDB
mongosh

# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

**You're all set! Enjoy building your Campus Navigator! 🎉**

For detailed documentation, see: `CAMPUS_NAVIGATOR_GUIDE.md`
