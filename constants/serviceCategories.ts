


export const serviceCategories = [
  {
    key: "general",
    name: "Periodic Services",
    icon: "/icons/maintenance (1).png",
    isActive: true,
  },
  {
    key: "ac",
    name: "AC Service & Repair",
    icon: "/icons/car-ac.png",
    isActive: false,
  },
  {
    key: "battery",
    name: "Batteries",
    icon: "/icons/battery.png",
    isActive: false,
  },
  {
    key: "tyres",
    name: "Tyres & Wheel Care",
    icon: "/icons/wheels.png",
    isActive: false,
  },
  {
    key: "dent",
    name: "Denting & Painting",
    icon: "/icons/bender.png",
    isActive: false,
  },
  {
    key: "detailing",
    name: "Detailing Services",
    icon: "/icons/specification.png",
    isActive: false,
  },
  {
    key: "emergency",
    name: "Emergency Services",
    icon: "/icons/siren.png",
    isActive: false,
  },
] as const
export type ServiceCategoryKey = typeof serviceCategories[number]["key"];
export const categoryKeys = [
  "general",
  "ac",
  "battery",
  "tyres",
  "dent",
  "detailing",
  "emergency",
] as const;