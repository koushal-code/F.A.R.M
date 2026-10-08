// Live GPS tracking & Regional Precision Service for Indian agriculture
// Provides real-time geolocation with WatchPosition, reverse geocoding via OpenStreetMap Nominatim,
// and agro-climatic region detection.

export interface LiveGpsCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
}

export interface GeocodedRegionalAddress {
  displayName: string;
  village?: string;
  subdistrict?: string; // tehsil / taluk / mandal
  district?: string;
  state?: string;
  stateCode?: string;
  pincode?: string;
  country?: string;
  agroClimaticZone?: string;
  soilZoneHint?: string;
}

export interface LiveGpsState {
  coords: LiveGpsCoordinates | null;
  address: GeocodedRegionalAddress | null;
  isTracking: boolean;
  isLocating: boolean;
  error: string | null;
  highAccuracy: boolean;
}

// Agro-climatic zone heuristics for Indian agriculture based on ICAR & Ministry of Agriculture classifications
export function inferAgroClimaticZone(lat: number, lon: number, state?: string): { zone: string; soil: string } {
  const st = (state || '').toLowerCase();
  
  if (st.includes('telangana') || (lat >= 15.8 && lat <= 19.8 && lon >= 77.2 && lon <= 81.8)) {
    return {
      zone: 'Southern Plateau & Hills Zone (Telangana)',
      soil: 'Red Sandy Loam & Deep Black Soils (Vertisols)'
    };
  }
  if (st.includes('andhra') || (lat >= 13.5 && lat <= 19.1 && lon >= 79.5 && lon <= 84.8)) {
    return {
      zone: 'East Coast Plains & Hills Zone (Andhra)',
      soil: 'Coastal Alluvium & Deltaic Clay Loams'
    };
  }
  if (st.includes('karnataka') || (lat >= 11.5 && lat <= 18.5 && lon >= 74.0 && lon <= 78.5)) {
    return {
      zone: 'Southern Plateau Zone (Karnataka)',
      soil: 'Red Sandy / Laterite & Black Clayey Soils'
    };
  }
  if (st.includes('tamil nadu') || (lat >= 8.0 && lat <= 13.5 && lon >= 76.2 && lon <= 80.3)) {
    return {
      zone: 'Southern Coastal Plains Zone (Tamil Nadu)',
      soil: 'Red Soil, Sandy Alluvium & Black Cotton Soil'
    };
  }
  if (st.includes('punjab') || st.includes('haryana') || (lat >= 28.0 && lat <= 32.5 && lon >= 73.8 && lon <= 77.6)) {
    return {
      zone: 'Trans-Gangetic Plains Zone',
      soil: 'Fertile Alluvial Loam (Indo-Gangetic)'
    };
  }
  if (st.includes('maharashtra') || (lat >= 15.6 && lat <= 22.0 && lon >= 72.6 && lon <= 80.9)) {
    return {
      zone: 'Western Plateau & Hills Zone (Deccan)',
      soil: 'Black Cotton Soil (Regur) & Medium Red Loam'
    };
  }
  if (lat >= 20.0 && lat <= 28.5 && lon >= 78.0 && lon <= 88.5) {
    return {
      zone: 'Middle & Eastern Gangetic Plains Zone',
      soil: 'Alluvial Silt Loam & Clayey Loam'
    };
  }

  return {
    zone: 'Tropical Agro-Climatic Zone',
    soil: 'Regional Loam & Sandy Soils'
  };
}

// Server or Nominatim Reverse Geocoding with fallback
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<GeocodedRegionalAddress> {
  // 1. Try our proxy /api/reverse-geocode first (handles rate limits & caching)
  try {
    const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.address) {
        const { zone, soil } = inferAgroClimaticZone(lat, lon, data.address.state);
        return {
          ...data.address,
          agroClimaticZone: zone,
          soilZoneHint: soil
        };
      }
    }
  } catch (_e) {
    // Continue to direct client fallback
  }

  // 2. Direct OpenStreetMap Nominatim with respectful user-agent headers
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FarmCropAIEngine/2.0'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const village = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.town;
      const subdistrict = addr.county || addr.state_district || addr.subdistrict;
      const district = addr.state_district || addr.district || addr.county;
      const state = addr.state;
      const pincode = addr.postcode;
      const country = addr.country || 'India';

      // Build short recognizable label
      const parts: string[] = [];
      if (village) parts.push(village);
      if (subdistrict && subdistrict !== village) parts.push(subdistrict);
      if (district && district !== subdistrict) parts.push(district);
      if (state && !parts.includes(state)) parts.push(state);

      const displayName = parts.slice(0, 3).join(', ') || data.name || `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
      const { zone, soil } = inferAgroClimaticZone(lat, lon, state);

      return {
        displayName,
        village,
        subdistrict,
        district,
        state,
        pincode,
        country,
        agroClimaticZone: zone,
        soilZoneHint: soil
      };
    }
  } catch (_e) {
    // Fallback
  }

  const { zone, soil } = inferAgroClimaticZone(lat, lon);
  return {
    displayName: `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`,
    agroClimaticZone: zone,
    soilZoneHint: soil
  };
}
