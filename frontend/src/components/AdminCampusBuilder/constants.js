import {
  Square,
  DoorOpen,
  Armchair,
  FlaskConical,
  BriefcaseBusiness,
  Route,
  Accessibility,
  ArrowUpDown,
} from "lucide-react";

export const ELEMENT_TYPES = [
  {
    type: "room",
    label: "Room",
    icon: Square,
    color: "#DBEAFE",
  },
  {
    type: "classroom",
    label: "Classroom",
    icon: Armchair,
    color: "#DCFCE7",
  },
  {
    type: "lab",
    label: "Lab",
    icon: FlaskConical,
    color: "#FEF3C7",
  },
  {
    type: "office",
    label: "Office",
    icon: BriefcaseBusiness,
    color: "#F3E8FF",
  },
  {
    type: "corridor",
    label: "Corridor",
    icon: Route,
    color: "#E2E8F0",
  },
  {
    type: "door",
    label: "Door",
    icon: DoorOpen,
    color: "#FDE68A",
  },
  {
    type: "staircase",
    label: "Stairs",
    icon: ArrowUpDown,
    color: "#FECACA",
  },
  {
    type: "lift",
    label: "Lift",
    icon: Accessibility,
    color: "#CFFAFE",
  },
  {
    type: "washroom",
    label: "Washroom",
    icon: Accessibility,
    color: "#E0E7FF",
  },
];

export const CAMPUS_TOOLS = [
  {
    type: "road",
    label: "Road",
    color: "#475569",
  },
];

export const DEFAULT_FLOOR_WIDTH = 1000;
export const DEFAULT_FLOOR_HEIGHT = 650;

export const DEFAULT_CAMPUS_WIDTH = 1800;
export const DEFAULT_CAMPUS_HEIGHT = 1000;

export const DEFAULT_ELEMENT_SIZE = {
  room: {
    width: 150,
    height: 100,
  },
  classroom: {
    width: 180,
    height: 120,
  },
  lab: {
    width: 200,
    height: 130,
  },
  office: {
    width: 150,
    height: 100,
  },
  corridor: {
    width: 250,
    height: 50,
  },
  door: {
    width: 70,
    height: 30,
  },
  staircase: {
    width: 100,
    height: 100,
  },
  lift: {
    width: 80,
    height: 80,
  },
  washroom: {
    width: 100,
    height: 80,
  },
};