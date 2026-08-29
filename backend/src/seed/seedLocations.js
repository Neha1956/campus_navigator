import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Location from "../models/Location.js";

dotenv.config();

const locations = [
  // =========================
  // MAIN ROAD / GATES (Floor 0)
  // =========================
  {
    name: "Main Road",
    category: "Road",
    building: "Campus",
    floor: 0,
    description: "Main road running along the university campus",
    x: 100,
    y: 500,
    icon: "road",
  },
  {
    name: "Main Gate",
    category: "Gate",
    building: "Campus",
    floor: 0,
    description: "First main entrance of the university from the main road",
    x: 150,
    y: 500,
    icon: "gate",
  },
  {
    name: "Second Gate",
    category: "Gate",
    building: "Campus",
    floor: 0,
    description: "Second entrance gate of the university",
    x: 850,
    y: 500,
    icon: "gate",
  },
  {
    name: "Third Gate",
    category: "Gate",
    building: "Campus",
    floor: 0,
    description: "Third gate near the hospital and temple side",
    x: 1050,
    y: 500,
    icon: "gate",
  },

  // =========================
  // MAIN ROAD SIDE
  // =========================
  {
    name: "Annapurna Restaurant",
    category: "Restaurant",
    building: "Campus",
    floor: 0,
    description: "Restaurant located on the right side of the main road near the first gate",
    x: 230,
    y: 450,
    icon: "restaurant",
  },
  {
    name: "ATM / Money Withdrawal Shop",
    category: "Shop",
    building: "Campus",
    floor: 0,
    description: "Shop providing ATM or money withdrawal facility",
    x: 400,
    y: 380,
    icon: "store",
  },

  // =========================
  // FIRST ROAD / ACADEMIC SIDE
  // =========================
  {
    name: "University Block",
    category: "Academic",
    building: "Campus",
    floor: 0,
    description: "University academic block located on the left side of the internal road",
    x: 350,
    y: 300,
    icon: "building",
  },
  {
    name: "Nursing College",
    category: "College",
    building: "Campus",
    floor: 0,
    description: "Nursing college building",
    x: 500,
    y: 350,
    icon: "building",
  },
  {
    name: "B.Pharm College",
    category: "College",
    building: "Campus",
    floor: 0,
    description: "Bachelor of Pharmacy college building",
    x: 650,
    y: 350,
    icon: "building",
  },
  {
    name: "D.Pharm College",
    category: "College",
    building: "Campus",
    floor: 0,
    description: "Diploma in Pharmacy college building",
    x: 750,
    y: 350,
    icon: "building",
  },
  {
    name: "Independence / Republic Day Stage",
    category: "Stage",
    building: "Campus",
    floor: 0,
    description: "Open stage used for Republic Day, Independence Day and university programs",
    x: 700,
    y: 250,
    icon: "stage",
  },
  {
    name: "MBBS Building",
    category: "Medical College",
    building: "Campus",
    floor: 0,
    description: "MBBS college building located after the B.Pharm and D.Pharm buildings",
    x: 850,
    y: 350,
    icon: "building",
  },
  {
    name: "University Hospital",
    category: "Hospital",
    building: "Campus",
    floor: 0,
    description: "Large hospital located near the third gate",
    x: 950,
    y: 350,
    icon: "hospital",
  },
  {
    name: "Temple",
    category: "Temple",
    building: "Campus",
    floor: 0,
    description: "Temple located beyond the hospital near the third gate",
    x: 1050,
    y: 350,
    icon: "temple",
  },

  // =========================
  // SECOND GATE SIDE
  // =========================
  {
    name: "Guest House",
    category: "Guest House",
    building: "Campus",
    floor: 0,
    description: "Guest house located on the left side after entering through the second gate",
    x: 750,
    y: 550,
    icon: "home",
  },
  {
    name: "Campus Shop",
    category: "Shop",
    building: "Campus",
    floor: 0,
    description: "Shop located on the right side after entering through the second gate",
    x: 900,
    y: 550,
    icon: "store",
  },
  {
    name: "University School",
    category: "School",
    building: "Campus",
    floor: 0,
    description: "School located ahead of the campus shop",
    x: 950,
    y: 600,
    icon: "school",
  },
  {
    name: "Boys Hostel",
    category: "Hostel",
    building: "Campus",
    floor: 0,
    description: "Boys hostel located near the school and canteen",
    x: 850,
    y: 700,
    icon: "hostel",
  },
  {
    name: "Girls Hostel",
    category: "Hostel",
    building: "Campus",
    floor: 0,
    description: "Girls hostel located beyond the guest house",
    x: 650,
    y: 700,
    icon: "hostel",
  },
  {
    name: "Campus Canteen",
    category: "Canteen",
    building: "Campus",
    floor: 0,
    description: "Campus canteen located near the boys hostel",
    x: 950,
    y: 700,
    icon: "utensils",
  },

  // =========================
  // CENTRAL GROUND
  // =========================
  {
    name: "Central Ground",
    category: "Ground",
    building: "Campus",
    floor: 0,
    description: "Large open ground located between the boys hostel and girls hostel roads",
    x: 750,
    y: 800,
    icon: "ground",
  },

  // =========================
  // RCIT BUILDING - GROUND & FIRST FLOORS (Indoor Mapping)
  // =========================
  {
    name: "B.Tech Block",
    category: "Academic",
    building: "RCIT Building",
    floor: 0,
    description: "Large academic building containing BCA, B.Tech and Polytechnic classes",
    x: 750,
    y: 950,
    icon: "building",
  },
  {
    name: "BCA Department",
    category: "Department",
    building: "RCIT Building",
    floor: 0, // Lower floor
    description: "BCA classes are located on the lower floor of the main academic building",
    x: 680,
    y: 950,
    icon: "computer",
  },
  {
    name: "B.Tech Department",
    category: "Department",
    building: "RCIT Building",
    floor: 1, // 1st Floor
    description: "B.Tech classes are located above the BCA section",
    x: 750,
    y: 950,
    icon: "computer",
  },
  {
    name: "Polytechnic Department",
    category: "Department",
    building: "RCIT Building",
    floor: 1, // Upper floor
    description: "Polytechnic classes are located on the upper floor",
    x: 820,
    y: 950,
    icon: "building",
  },
  {
    name: "Central Library",
    category: "Library",
    building: "RCIT Building",
    floor: 0,
    description: "Central library located near the main academic building",
    x: 900,
    y: 900,
    icon: "library",
  },
  {
    name: "Principal Office",
    category: "Office",
    building: "RCIT Building",
    floor: 0,
    description: "Principal office located inside the main academic building",
    x: 650,
    y: 900,
    icon: "office",
  },

  // =========================
  // DEPARTMENTS / HOD OFFICES
  // =========================
  {
    name: "CSE Department",
    category: "Department",
    building: "RCIT Building",
    floor: 1,
    description: "Computer Science and Engineering department",
    x: 550,
    y: 1000,
    icon: "computer",
  },
  {
    name: "CSE HOD Office",
    category: "HOD Office",
    building: "RCIT Building",
    floor: 1,
    description: "Head of Department office for CSE",
    x: 550,
    y: 1050,
    icon: "office",
  },
  {
    name: "Mechanical Engineering Department",
    category: "Department",
    building: "RCIT Building",
    floor: 0,
    description: "Mechanical Engineering department",
    x: 650,
    y: 1050,
    icon: "building",
  },
  {
    name: "ME HOD Office",
    category: "HOD Office",
    building: "RCIT Building",
    floor: 0,
    description: "Head of Department office for Mechanical Engineering",
    x: 650,
    y: 1100,
    icon: "office",
  },
  {
    name: "Civil Engineering Department",
    category: "Department",
    building: "RCIT Building",
    floor: 0,
    description: "Civil Engineering department",
    x: 750,
    y: 1050,
    icon: "building",
  },
  {
    name: "Civil HOD Office",
    category: "HOD Office",
    building: "RCIT Building",
    floor: 0,
    description: "Head of Department office for Civil Engineering",
    x: 750,
    y: 1100,
    icon: "office",
  },
  {
    name: "ECE Department",
    category: "Department",
    building: "RCIT Building",
    floor: 0,
    description: "Electronics and Communication Engineering department",
    x: 850,
    y: 1050,
    icon: "building",
  },
  {
    name: "ECE HOD Office",
    category: "HOD Office",
    building: "RCIT Building",
    floor: 0,
    description: "Head of Department office for ECE",
    x: 850,
    y: 1100,
    icon: "office",
  },
  {
    name: "Electrical Engineering Department",
    category: "Department",
    building: "RCIT Building",
    floor: 0,
    description: "Electrical Engineering department",
    x: 950,
    y: 1050,
    icon: "building",
  },
  {
    name: "Electrical HOD Office",
    category: "HOD Office",
    building: "RCIT Building",
    floor: 0,
    description: "Head of Department office for Electrical Engineering",
    x: 950,
    y: 1100,
    icon: "office",
  },

  // =========================
  // ADMIN
  // =========================
  {
    name: "Admin Block",
    category: "Admin",
    building: "Campus",
    floor: 0,
    description: "Administrative block of the university",
    x: 1000,
    y: 800,
    icon: "building",
  },
];

const seedLocations = async () => {
  try {
    await connectDB();

    // Pehle purana sara data delete karega taaki duplicate/old records na rahein
    await Location.deleteMany({});
    console.log("Old locations deleted successfully.");

    // Naye updated locations insert karega
    const createdLocations = await Location.insertMany(locations);

    console.log("New campus locations seeded successfully!");
    console.log(`Total locations: ${createdLocations.length}`);

    createdLocations.forEach((location) => {
      console.log(
        `${location.name} [Building: ${location.building} | Floor ${location.floor}] → ${location._id}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedLocations();