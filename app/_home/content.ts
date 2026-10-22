// Single source of truth for every word and link the home page shows.
// Studio copy is the live site's copy (main @ 9f02a84), with only the
// wrong facts fixed. WaterFlow facts come from its App Store listing
// (checked 2026-10-22). Do not add claims that are not in this file.

import waterflowIcon from "@/public/apps/waterflow/icon-1024.jpg";
import shotWidget from "@/public/apps/waterflow/screenshots/01-widget.jpg";
import shotByState from "@/public/apps/waterflow/screenshots/02-by-state.jpg";
import shotFavorites from "@/public/apps/waterflow/screenshots/03-favorites.jpg";
import shotDetail from "@/public/apps/waterflow/screenshots/04-station-detail.jpg";
import shotDetailDark from "@/public/apps/waterflow/screenshots/05-station-detail-dark.jpg";
import shotMap from "@/public/apps/waterflow/screenshots/06-map.jpg";

export const studio = {
  name: "Thundergrouse",
  legalName: "Thundergrouse LLC",
  tagline: "iOS Apps Crafted in the Pacific Northwest",
  intro: "We build thoughtful, beautifully designed apps for iPhone and iPad.",
  location: "Woodland, Washington",
  about: {
    heading: "About Us",
    who: {
      heading: "Who We Are",
      body:
        "Thundergrouse is a two-person studio founded by brothers Luke and John Stanley. " +
        "Based in Washington State, we create iOS applications that respect your time and attention.",
    },
    philosophy: {
      heading: "Our Philosophy",
      body:
        "We believe apps should enhance your life, not consume it. " +
        "Every feature we build is intentional, every interaction considered. " +
        "Quality over quantity, always.",
    },
  },
  openSource: {
    heading: "Open Source",
    body: "Check out our work on GitHub. We believe in building in the open.",
    links: [
      { label: "@Steelhead-Command", href: "https://github.com/Steelhead-Command" },
      { label: "@ChocolateGrouse", href: "https://github.com/ChocolateGrouse" },
    ],
  },
  copyright: "© 2026 Thundergrouse LLC. All rights reserved.",
} as const;

export const waterflow = {
  kind: "utility" as const,
  // App Store name. Use "WaterFlow" for short, as the listing itself does.
  name: "USGS WaterFlow",
  shortName: "WaterFlow",
  status: "Available on the App Store",
  // Opening line of the App Store description, verbatim.
  summary:
    "WaterFlow turns every USGS streamgauge in the country into a pocket-sized field guide for moving water.",
  // The App Store description's own words, minus its parentheses and "no middleman".
  detail:
    "Real-time flow rates in cubic feet per second, gauge height, water temperature and the local NOAA forecast, drawn straight from the official sources.",
  facts: [
    { label: "Price", value: "Free" },
    { label: "Category", value: "Weather" },
    { label: "Devices", value: "iPhone and iPad" },
    { label: "Requires", value: "iOS 17 or later" },
  ],
  // Every feature named in the App Store listing, in the listing's order.
  features: [
    {
      name: "Home Screen widget",
      body: "Live flows for the gauges you watch, each with a seven-day sparkline. Small, Medium and Large sizes, plus Lock Screen widgets.",
    },
    {
      name: "By State",
      body: "Pick a state and see every active gauge in it, sorted by flow, name or distance.",
    },
    {
      name: "Nearby",
      body: "Find every gauge within a radius you choose.",
    },
    {
      name: "Favorites",
      body: "Save the gauges you watch most, each with its current flow and the last seven days.",
    },
    {
      name: "Map",
      body: "Every USGS gauge in the country on one map.",
    },
    {
      name: "Station Detail",
      body: "Flow in cubic feet per second, gauge height, water temperature and the NOAA forecast, with charts for the last seven days.",
    },
    {
      name: "Flow Alerts",
      body: "Set a low or high flow threshold on any gauge and get a notification when the river crosses it.",
    },
  ],
  // From the listing's privacy section.
  privacy: "WaterFlow doesn't track you. No analytics, no advertising, no third-party SDKs.",
  // From the listing's data note. Show it wherever USGS or NOAA data is mentioned.
  dataNote:
    "Data from the U.S. Geological Survey and the National Weather Service. WaterFlow is not affiliated with either agency.",
  links: {
    appStore: {
      label: "View on the App Store",
      href: "https://apps.apple.com/us/app/usgs-waterflow/id6759414459",
    },
    support: {
      label: "Support",
      href: "https://steelhead-command.github.io/waterflow-support/",
    },
    privacy: {
      label: "Privacy Policy",
      href: "https://steelhead-command.github.io/waterflow-support/privacy.html",
    },
  },
  icon: { src: waterflowIcon, alt: "USGS WaterFlow app icon" },
  // Real App Store screenshots, 1287 x 2796. Status bars are part of the image.
  screenshots: [
    { key: "widget", src: shotWidget, caption: "Home Screen widget", alt: "WaterFlow widget on an iPhone Home Screen showing live flows for two Columbia River gauges" },
    { key: "favorites", src: shotFavorites, caption: "Favorites", alt: "Favorites screen with the current flow and a seven-day sparkline for two gauges" },
    { key: "detail", src: shotDetail, caption: "Station Detail", alt: "Station detail for the Columbia River at Vancouver, Washington, with a seven-day flow history chart" },
    { key: "detailDark", src: shotDetailDark, caption: "Station Detail, dark mode", alt: "Station detail in dark mode with a seven-day flow history chart" },
    { key: "byState", src: shotByState, caption: "By State", alt: "List of Washington gauges sorted by flow" },
    { key: "map", src: shotMap, caption: "Map", alt: "Map of USGS gauges across Washington and Oregon" },
  ],
} as const;

export const chop = {
  kind: "game" as const,
  name: "CHOP",
  status: "In development",
  // Live site copy, unchanged.
  summary:
    "A satisfying wood chopping arcade game with furnace crafting and gathering mechanics. Simple to play, hard to master.",
  links: {
    github: { label: "View on GitHub", href: "https://github.com/Steelhead-Command/CHOP" },
  },
  // CHOP has no icon, art or screenshots yet. Show a plain lettered tile, never invented art.
  // Auburn is the colour the live site already gives CHOP's tile.
  color: "#8B5A3C",
} as const;

// Everything the studio makes, in display order. New apps and games go here.
export const products = [waterflow, chop] as const;
