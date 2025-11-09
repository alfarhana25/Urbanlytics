# 🌆 Urbanlytics — Neighbourhood Analytics Platform

Urbanlytics is an interactive web application that helps users explore and understand different neighbourhoods within a city using **data-driven insights** and **visual analytics**.  
It transforms raw city data into a clear, visual story — empowering residents, policymakers, and businesses to make informed decisions about safety, affordability, and livability.

---

## 🚀 Overview

CityScope provides a **map-based visualization platform** where users can:
- Search for any **city** and view its **neighbourhoods** outlined on the map.  
- Select key urban indicators such as **crime rate**, **housing prices**, **pollution**, and **population density**.  
- Instantly view a **heat map** representation of the selected indicator.  
- Click on any neighbourhood to open a **detailed analytics card** with multiple statistics and trends.  

Whether you’re finding a safe place to live, studying urban development, or planning inclusive city policies — CityScope gives you the insights you need at a glance.

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

2. **Backend**:  
   Powered by **Node.js** or **Firebase**, handling city search, dataset queries, and API calls to retrieve real-time neighbourhood data.

3. **Visualization Layer**:  
   Dynamic heat maps are generated using **Mapbox GL JS** or **Leaflet**, adapting color scales based on normalized indicator values.

---

## 🧩 Tech Stack

| Component | Technology |
|------------|-------------|
| Frontend |  |
| Map Visualization | Mapbox API  |
| Backend |  |
| Styling | Tailwind CSS |
| Data Sources |  |
| Deployment |  |

---

## 🖥️ Getting Started

### Prerequisites
- Node.js (v20+)
- npm or yarn
- A Mapbox API token (free for developers)

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
