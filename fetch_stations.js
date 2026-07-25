#!/usr/bin/env node
// Fetches REM and Metro station data from OSM via Overpass API
// and generates a GeoJSON file with station points + 1/4 mile hiding zones

const fs = require('fs');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// 1/4 mile in meters
const QUARTER_MILE_M = 402.336;

// Metro line membership by station name. REM stations are assigned "REM" by system.
// A station may belong to multiple lines (transfer stations, e.g. Berri-UQAM).
const METRO_LINES = {
  Green: ["Angrignon","Monk","Jolicoeur","Verdun","De l'Église","LaSalle","Charlevoix","Atwater","Guy-Concordia","Peel","McGill","Place-des-Arts","Saint-Laurent","Berri-UQAM","Beaudry","Papineau","Frontenac","Préfontaine","Joliette","Pie IX","Viau","Assomption","Cadillac","Langelier","Radisson","Honoré-Beaugrand"],
  Orange: ["Côte-Vertu","Du Collège","De La Savane","Namur","Plamondon","Côte-Sainte-Catherine","Snowdon","Villa-Maria","Vendôme","Place Saint-Henri","Georges-Vanier","Lucien-L'Allier","Bonaventure","Square-Victoria-OACI","Place d'Armes","Champ-de-Mars","Berri-UQAM","Sherbrooke","Mont-Royal","Laurier","Rosemont","Beaubien","Jean-Talon","Jarry","Crémazie","Sauvé","Henri-Bourassa","Cartier","De la Concorde","Montmorency"],
  Yellow: ["Berri-UQAM","Jean-Drapeau","Longueuil-Université-de-Sherbrooke"],
  Blue: ["Snowdon","Côte-des-Neiges","Université-de-Montréal","Édouard-Montpetit","Outremont","Acadie","Parc","De Castelnau","Jean-Talon","Fabre","D'Iberville","Saint-Michel"]
};
// Normalize curly apostrophes and en/em dashes so name matching is robust.
const normName = s => s.replace(/[’‘`]/g, "'").replace(/[–—]/g, '-');
const LINE_LOOKUP = (() => {
  const m = {};
  for (const [line, names] of Object.entries(METRO_LINES))
    for (const n of names) { const k = normName(n); (m[k] = m[k] || []).push(line); }
  return m;
})();
function linesFor(name, system) {
  if (system === 'REM') return ['REM'];
  return (LINE_LOOKUP[normName(name)] || []).slice();
}

// Overpass query for Montreal Metro and REM stations
// Bounding box covering Greater Montreal area (Laval, Longueuil, Brossard, etc.)
const BBOX = '45.35,-74.05,45.75,-73.40';

const QUERY = `
[out:json][timeout:60];
(
  node["station"="subway"](${BBOX});
  node["station"="light_rail"](${BBOX});
  node["railway"="station"]["network"~"REM|Réseau express"](${BBOX});
);
out body;
`;

// ARTM Zone classification based on geography
// Zone A = Island of Montreal
// Zone B = Laval, Longueuil, South Shore, etc.
// We'll classify by checking if station is on the island of Montreal
function classifyZone(lat, lon, tags) {
  // Rough bounding box for Island of Montreal
  // The island is roughly: lat 45.40-45.71, lon -73.97 to -73.47
  // But we need to be more precise for edge cases

  // Known Zone B Metro stations (off-island)
  const zoneBStations = [
    // Laval (Orange line extension)
    'Montmorency', 'De la Concorde', 'Cartier',
    // Longueuil (Yellow line)
    'Longueuil–Université-de-Sherbrooke', 'Longueuil'
  ];

  const name = tags.name || '';
  if (zoneBStations.some(s => name.includes(s))) return 'B';

  // REM stations off-island (Zone B = Laval, South Shore)
  const zoneBREM = [
    'Gare Rive-Sud', 'Brossard', 'Du Quartier', 'Panama',
    'Gare de Laval', 'Île-Bigras', 'Sainte-Dorothée'
  ];
  if (zoneBREM.some(s => name.includes(s))) return 'B';

  // Zone C stations (beyond B - Deux-Montagnes, Grand-Moulin etc.)
  const zoneCStations = ['Deux-Montagnes', 'Grand-Moulin', 'Sunnybrooke'];
  if (zoneCStations.some(s => name.includes(s))) return 'C';

  // Default: if on island of Montreal, Zone A
  // Simple check: most of island is between these coords
  if (lat >= 45.40 && lat <= 45.71 && lon >= -73.98 && lon <= -73.47) {
    return 'A';
  }

  return 'B';
}

// Generate a circle polygon (GeoJSON) around a point
function createCircle(centerLon, centerLat, radiusMeters, numPoints = 64) {
  const coords = [];
  const earthRadius = 6371000; // meters

  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const dLat = (radiusMeters / earthRadius) * Math.cos(angle);
    const dLon = (radiusMeters / (earthRadius * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);

    coords.push([
      centerLon + (dLon * 180 / Math.PI),
      centerLat + (dLat * 180 / Math.PI)
    ]);
  }

  return {
    type: 'Polygon',
    coordinates: [coords]
  };
}

async function main() {
  console.log('Fetching station data from Overpass API...');

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'jetlag-map-generator/1.0 (one-off station data fetch)',
      'Referer': 'https://jetlag-map.local'
    },
    body: 'data=' + encodeURIComponent(QUERY)
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Got ${data.elements.length} raw elements from OSM`);

  // Deduplicate by name (some stations have multiple nodes)
  const stationMap = new Map();

  for (const el of data.elements) {
    if (el.type !== 'node') continue;
    const name = el.tags?.name;
    if (!name) continue;

    // Determine system type
    const network = el.tags?.network || '';
    let system;
    if (network.includes('REM') || network.includes('Réseau express')) {
      system = 'REM';
    } else if (network.includes('STM') || network.includes('Métro')) {
      system = 'Metro';
    } else if (el.tags?.station === 'subway') {
      system = 'Metro';
    } else if (el.tags?.station === 'light_rail') {
      system = 'REM';
    } else {
      system = 'Unknown';
    }

    const key = `${name}-${system}`;
    if (!stationMap.has(key)) {
      stationMap.set(key, {
        name,
        system,
        lat: el.lat,
        lon: el.lon,
        zone: classifyZone(el.lat, el.lon, el.tags),
        osmId: el.id,
        tags: el.tags
      });
    }
  }

  const stations = Array.from(stationMap.values());
  console.log(`Deduplicated to ${stations.length} unique stations`);

  // Filter to Zone A and B only, exclude YUL airport station
  const filtered = stations.filter(s => (s.zone === 'A' || s.zone === 'B') && !s.name.includes('YUL'));
  console.log(`Zone A: ${filtered.filter(s => s.zone === 'A').length} stations`);
  console.log(`Zone B: ${filtered.filter(s => s.zone === 'B').length} stations`);
  console.log(`Metro: ${filtered.filter(s => s.system === 'Metro').length}`);
  console.log(`REM: ${filtered.filter(s => s.system === 'REM').length}`);

  // Build GeoJSON
  const features = [];

  for (const station of filtered) {
    // Station point
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [station.lon, station.lat]
      },
      properties: {
        name: station.name,
        system: station.system,
        zone: station.zone,
        lines: linesFor(station.name, station.system),
        featureType: 'station'
      }
    });

    // Hiding zone (1/4 mile circle)
    features.push({
      type: 'Feature',
      geometry: createCircle(station.lon, station.lat, QUARTER_MILE_M),
      properties: {
        name: station.name,
        system: station.system,
        zone: station.zone,
        lines: linesFor(station.name, station.system),
        featureType: 'hidingZone',
        radiusMiles: 0.25
      }
    });
  }

  const geojson = {
    type: 'FeatureCollection',
    features
  };

  fs.writeFileSync('stations.geojson', JSON.stringify(geojson, null, 2));
  console.log(`\nWrote ${features.length} features to stations.geojson`);

  // Print station list
  console.log('\n--- Stations ---');
  for (const s of filtered.sort((a, b) => a.system.localeCompare(b.system) || a.name.localeCompare(b.name))) {
    console.log(`  [${s.system}] [Zone ${s.zone}] ${s.name}`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
