export interface Product {
  slug: string;
  title: string;
  summary: string;
  description: string;
}

export const products: Product[] = [
  {
    slug: "asset-tracking",
    title: "Real-Time Asset Tracking",
    summary: "Track equipment and shipments live on a single map.",
    description:
      "Hubble's asset tracking module gives you a live map of every tagged asset, with geofencing alerts and historical location playback.",
  },
  {
    slug: "environmental-monitoring",
    title: "Environmental Monitoring",
    summary: "Monitor temperature, humidity, and air quality remotely.",
    description:
      "Deploy wireless sensors across your sites to monitor environmental conditions in real time, with threshold alerts sent straight to your team.",
  },
  {
    slug: "predictive-maintenance",
    title: "Predictive Maintenance",
    summary: "Catch equipment issues before they cause downtime.",
    description:
      "Hubble analyses vibration, temperature, and usage data from your machines to flag maintenance needs before a breakdown happens.",
  },
  {
    slug: "fleet-management",
    title: "Fleet Management",
    summary: "Manage routes, fuel, and driver behaviour in one place.",
    description:
      "Get a unified view of your vehicle fleet — live locations, route history, fuel usage, and driver behaviour scoring.",
  },
  {
    slug: "custom-dashboards",
    title: "Custom Dashboards",
    summary: "Build dashboards tailored to your operations team.",
    description:
      "Combine any of Hubble's data streams into dashboards built for your team, with role-based access and exportable reports.",
  },
];
