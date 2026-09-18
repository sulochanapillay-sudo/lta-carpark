import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Carpark, Coordinates } from '../types';
import { getAvailabilityStatus } from '../data/singaporeCarparks';
import { Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface CarparkMapProps {
  carparks: Carpark[];
  selectedCarpark: Carpark | null;
  onSelectCarpark: (carpark: Carpark) => void;
  centerLocation: Coordinates;
  centerLocationName: string;
}

export const CarparkMap: React.FC<CarparkMapProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  centerLocation,
  centerLocationName,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [centerLocation.lat, centerLocation.lng],
      zoom: 15,
      zoomControl: false, // We render clean custom zoom buttons
      attributionControl: false,
    });

    // Crisp, fast CartoDB Voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add subtle attribution in the corner
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '© OpenStreetMap & CARTO',
      })
      .addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update target center location marker and pan map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Pan map to search center
    map.flyTo([centerLocation.lat, centerLocation.lng], 15, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    // Remove old center marker
    if (centerMarkerRef.current) {
      centerMarkerRef.current.remove();
    }

    // Create custom user/target location pulse marker
    const centerIcon = L.divIcon({
      className: 'custom-center-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-40 animate-ping"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([centerLocation.lat, centerLocation.lng], {
      icon: centerIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    marker.bindTooltip(
      `<div class="text-xs font-semibold text-slate-800 px-1 py-0.5">${centerLocationName}</div>`,
      {
        permanent: false,
        direction: 'top',
        offset: [0, -14],
      }
    );

    centerMarkerRef.current = marker;
  }, [centerLocation, centerLocationName]);

  // Render Carpark Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    carparks.forEach((cp) => {
      const isSelected = selectedCarpark?.id === cp.id;
      const statusInfo = getAvailabilityStatus(cp.availableLots, cp.totalLots);

      // Distinct pin colors based on availability
      const bgHex =
        statusInfo.status === 'available'
          ? '#059669' // Emerald
          : statusInfo.status === 'filling'
          ? '#d97706' // Amber
          : '#e11d48'; // Rose

      const markerHtml = `
        <div class="group relative cursor-pointer transform transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div style="background-color: ${bgHex};" 
               class="flex items-center justify-center px-2 py-1 rounded-full shadow-lg border-2 border-white text-white font-bold text-[11px] whitespace-nowrap min-w-[42px]">
            <span class="tracking-tight">${cp.availableLots}</span>
            <span class="text-[9px] opacity-85 ml-0.5">lots</span>
          </div>
          <div style="border-top-color: ${bgHex};" 
               class="w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] drop-shadow-sm -mt-0.5"></div>
          ${
            isSelected
              ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-white animate-pulse"></span>'
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-carpark-pin',
        html: markerHtml,
        iconSize: [50, 32],
        iconAnchor: [25, 30],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([cp.latitude, cp.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 500 : 100,
      });

      marker.on('click', () => {
        onSelectCarpark(cp);
      });

      markersGroup.addLayer(marker);
    });
  }, [carparks, selectedCarpark, onSelectCarpark]);

  // When a carpark is selected externally (e.g. from list), fly to it
  useEffect(() => {
    if (!selectedCarpark || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedCarpark.latitude, selectedCarpark.longitude], 16, {
      duration: 1.0,
    });
  }, [selectedCarpark]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([centerLocation.lat, centerLocation.lng], 15, {
      duration: 0.8,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-100 overflow-hidden">
      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls (Zoom, Recenter) */}
      <div className="absolute right-4 bottom-24 md:bottom-6 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-md border border-slate-200 flex items-center justify-center transition active:scale-95 cursor-pointer"
          title="Recenter to search location"
        >
          <Navigation className="w-4 h-4 text-emerald-600" />
        </button>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition border-b border-slate-100 active:scale-95 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend Pill */}
      <div className="absolute left-4 top-4 z-20 hidden sm:flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 text-xs font-medium text-slate-700">
        <span className="text-slate-400 font-normal">Lots:</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          Filling Fast
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          Full
        </span>
      </div>
    </div>
  );
};
