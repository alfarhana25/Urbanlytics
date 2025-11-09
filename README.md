# 🌆 Urbanlytics — Neighbourhood Analytics Platform

Urbanlytics is an interactive web application that helps users explore and understand different neighbourhoods within a city using **data-driven insights** and **visual analytics**.  
It transforms raw city data into a clear, visual story — empowering residents, policymakers, and businesses to make informed decisions about safety, affordability, and livability.

---

## 🚀 Overview

Urbanlytics provides a **map-based visualization platform** where users can:
- Search for any **city** and view its **neighbourhoods** outlined on the map.  
- Select key urban indicators such as **crime rate**, **housing prices** & **pollution**.  
- Instantly view a **heat map** representation of the selected indicator.  
- Click on any neighbourhood to open a **detailed analytics card** with multiple statistics and trends.  

Whether you’re finding a safe place to live, studying urban development, or planning inclusive city policies — Urbanlytics gives you the insights you need at a glance.

---

## 🗺️ Core Features

### 1. 🔍 Smart City Search  
Enter the name of your city to load a map with all neighbourhood boundaries clearly marked.

### 2. 🌡️ Dynamic Heat Maps  
Toggle between data layers (crime, price, pollution, or population density). The map dynamically updates to visualize the chosen dataset using colour gradients.

### 3. 📊 Neighbourhood Analytics Panel  
Click on a neighbourhood to view:
- Average housing price  
- Crime index  
- Pollution levels (air quality)  
- Population density  
- Community demographics and growth trends  

### 4. ⚡ Real-Time Data Integration  
Our system can integrate open data APIs (e.g. **OpenStreetMap**, **World Bank**, **Socrata**, or **Carbon Interface**) to fetch and visualize the latest statistics.

---

## 🧠 How It Works

1. **Frontend**:  
   Built using **React (Next.js)** with **Mapbox** for geospatial rendering.  
   The interface uses a clean, minimal UI for accessibility and performance.

2. **Visualization Layer**:  
   Dynamic heat maps are generated using **Leaflet**, adapting color scales based on normalized indicator values.

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| Frontend | TypeScript |
| Map Visualization | Leaflet API  |
| Styling | Tailwind CSS |
| Deployment | Netlify |

# 🗂️ Data Sources

This project combines open and public datasets to provide community-level insights for Calgary, including safety, air quality, and housing metrics.

---

### 🧾 Crime Statistics
**Source:** [Socrata Open Data API](https://dev.socrata.com/docs/endpoints.html)  
**Provider:** City of Calgary Open Data Portal  
- Offers community-based crime and incident data.  
- Used to generate **Crime Rate** and **Safety Score** metrics.

---

### 🌫️ Air Pollution
**Source:** [IQAir – Calgary Air Quality Map](https://www.iqair.com/ca/air-quality-map?zoomLevel=10&lat=51.0814&lng=-114.1403)  
**Provider:** IQAir / AirVisual  
- Provides real-time AQI and PM2.5 readings from Calgary monitoring stations.  
- Used to calculate the **Air Quality** and **Environmental Health** scores.

---

### 🏡 Housing Prices
**Source:** [RentFaster.ca](https://www.rentfaster.ca/)  
**Provider:** RentFaster Canada  
- Aggregates rental and housing market data by community.  
- Used to estimate **Cost of Living** and **Property Value** indicators.


All datasets are aggregated for visualization and insight purposes under fair-use and open-data guidelines.


---

## 🖥️ Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/cityscope.git
cd cityscope

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Mapbox token and API keys inside .env.local

# Run the development server
npm run dev
```

Visit **http://localhost:3000** to explore CityScope.

---

## 📈 Future Enhancements

- Predictive analytics for real estate and safety trends  
- Integration with live sensor or city IoT data  
- Accessibility mode for visually impaired users  
- User accounts and saved neighbourhood dashboards  
- Comparison view for multiple neighbourhoods  

---

## 🤝 Contributors

| Name | Role |
|------|------|
| Mehvish Shakeel | Frontend & UI Development |
| Anfaal Mahbub | Backend & API Integration |
| Al Farhana Siddique | Data Processing & Visualization |
| Nimna Wijedasa | UX Design & Analytics |
| Aly Mohammed Masani | Project Coordination & Full Stack Development |

---

## 💡 Vision

CityScope envisions a world where **urban data is transparent, accessible, and empowering**.  
By turning complex statistics into interactive visuals, we help build **smarter, safer, and more inclusive cities** — one neighbourhood at a time.
