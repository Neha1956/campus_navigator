import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Location from "../models/Location.js";
import Route from "../models/Route.js";

dotenv.config();

const seedRoutes = async () => {
  try {
    await connectDB();

    console.log("Finding campus locations...");

    const locations = await Location.find({ isActive: true });

    const getLocation = (name) => {
      return locations.find(
        (location) =>
          location.name.toLowerCase() === name.toLowerCase()
      );
    };

    if (locations.length < 2) {
      throw new Error("At least two locations are required. Please seed locations first.");
    }

    // Remove existing routes
    await Route.deleteMany({});

    const connected = [getLocation("Main Gate") || locations[0]];
    const remaining = locations.filter(
      (location) => location._id.toString() !== connected[0]._id.toString()
    );
    const routes = [];

    while (remaining.length) {
      let nearestLocation = remaining[0];
      let nearestParent = connected[0];
      let nearestDistance = Infinity;

      remaining.forEach((location) => {
        connected.forEach((parent) => {
          const distance = Math.round(
            Math.hypot(location.x - parent.x, location.y - parent.y)
          );

          if (distance < nearestDistance) {
            nearestLocation = location;
            nearestParent = parent;
            nearestDistance = distance;
          }
        });
      });

      routes.push({
        from: nearestParent._id,
        to: nearestLocation._id,
        distance: Math.max(nearestDistance, 1),
        walkingTime: Math.max(Math.ceil(nearestDistance / 80), 1),
      });

      connected.push(nearestLocation);
      remaining.splice(remaining.indexOf(nearestLocation), 1);
    }
    await Route.insertMany(routes);

    console.log("Routes seeded successfully ✅");
    console.log(`Total routes: ${routes.length}`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Route seeding failed:", error.message);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedRoutes();