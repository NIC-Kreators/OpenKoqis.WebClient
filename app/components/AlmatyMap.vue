<template>
  <div class="almaty-map-wrapper" :class="[dark ? 'is-dark-theme' : 'is-light-theme']">
    <!-- Top Map Toolbar -->
    <div class="map-toolbar">
      <div class="toolbar-left">
        <div class="city-indicator">
          <svg class="city-pin-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span class="city-name">Алматы (OpenStreetMap)</span>
          <span class="coords-tag">43.2389° N, 76.9200° E</span>
        </div>

        <div class="districts-filter">
          <button
            v-for="dist in districts"
            :key="dist.id"
            type="button"
            class="dist-btn"
            :class="{ 'is-active': isDistrictActive(dist.id) }"
            :title="dist.id === 'all' ? 'Показать все районы' : 'Кликните для выбора/снятия района (мультивыбор)'"
            @click="toggleDistrict(dist.id)"
          >
            {{ dist.name }}
          </button>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- Layer Switcher -->
        <div class="tiles-switcher">
          <button
            type="button"
            class="tile-btn"
            :class="{ 'is-active': activeTileLayer === 'dark' }"
            title="Тёмная тема карты без API-ключей"
            @click="switchTileLayer('dark')"
          >
            OSM Тёмная
          </button>
          <button
            type="button"
            class="tile-btn"
            :class="{ 'is-active': activeTileLayer === 'standard' }"
            title="Классический OpenStreetMap"
            @click="switchTileLayer('standard')"
          >
            OSM Стандарт
          </button>
          <button
            type="button"
            class="tile-btn"
            :class="{ 'is-active': activeTileLayer === 'topo' }"
            title="Топографическая карта гор и рельефа"
            @click="switchTileLayer('topo')"
          >
            Рельеф (Topo)
          </button>
        </div>

        <button
          type="button"
          class="route-toggle-btn"
          :class="{ 'is-active': showRoutePolyline }"
          @click="toggleRoute"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 17 10 11 14 15 20 9" />
            <line x1="20" y1="9" x2="15" y2="9" />
          </svg>
          <span>Трасса CVRP</span>
        </button>
      </div>
    </div>

    <!-- Leaflet Container with conditional dark theme class -->
    <div
      ref="mapContainerRef"
      class="leaflet-map-element"
      :class="{ 'is-dark-theme': activeTileLayer === 'dark' }"
    />

    <!-- Mountain View Landmark Tag (Заилийский Алатау к югу от Алматы) -->
    <div class="mountains-tag" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
      <span>← Заилийский Алатау (Тянь-Шань) к югу</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Container } from '~/types/waste'

const props = withDefaults(
  defineProps<{
    containers: Container[]
    selectedBin?: Container | null
    dark?: boolean
    manualDetourBinIds?: string[]
  }>(),
  {
    selectedBin: null,
    dark: true,
    manualDetourBinIds: () => []
  }
)

const emit = defineEmits<{
  (e: 'select', bin: Container): void
}>()

const mapContainerRef = ref<HTMLDivElement | null>(null)
const selectedDistricts = ref<string[]>(['all'])
const activeTileLayer = ref<'dark' | 'standard' | 'topo'>(props.dark ? 'dark' : 'standard')
const showRoutePolyline = ref(true)

let mapInstance: any = null
let L: any = null
let tileLayerInstance: any = null
let markersLayer: any = null
let routePolylineLayer: any = null
let depotMarker: any = null

const districts = [
  { id: 'all', name: 'Все районы' },
  { id: 'Медеуский район', name: 'Медеуский' },
  { id: 'Бостандыкский район', name: 'Бостандыкский' },
  { id: 'Алмалинский район', name: 'Алмалинский' },
  { id: 'Ауэзовский район', name: 'Ауэзовский' },
  { id: 'Жетысуский район', name: 'Жетысуский' }
]

const isDistrictActive = (distId: string) => {
  if (distId === 'all') {
    return selectedDistricts.value.includes('all')
  }
  return selectedDistricts.value.includes(distId)
}

const toggleDistrict = (distId: string) => {
  if (distId === 'all') {
    selectedDistricts.value = ['all']
  } else {
    if (selectedDistricts.value.includes('all')) {
      selectedDistricts.value = [distId]
    } else if (selectedDistricts.value.includes(distId)) {
      const next = selectedDistricts.value.filter(d => d !== distId)
      selectedDistricts.value = next.length > 0 ? next : ['all']
    } else {
      selectedDistricts.value.push(distId)
      const realDistricts = districts.filter(d => d.id !== 'all').map(d => d.id)
      if (realDistricts.every(d => selectedDistricts.value.includes(d))) {
        selectedDistricts.value = ['all']
      }
    }
  }

  renderMarkers()
  if (showRoutePolyline.value) {
    drawRoute()
  }
}

// 100% Free OpenStreetMap & OpenTopoMap URLs - NO API KEY REQUIRED!
const tileURLs = {
  dark: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  standard: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
}

const tileAttributions = {
  dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  standard: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  topo: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (&copy; OSM)'
}

onMounted(async () => {
  if (import.meta.client) {
    L = await import('leaflet')
    initMap()
  }
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})

const initMap = () => {
  if (!mapContainerRef.value || !L) return

  // Almaty center coordinates
  mapInstance = L.map(mapContainerRef.value, {
    center: [43.2389, 76.9200],
    zoom: 13,
    zoomControl: false,
    attributionControl: false
  })

  // Add zoom control at bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

  // Initial tile layer
  const mode = activeTileLayer.value
  tileLayerInstance = L.tileLayer(tileURLs[mode], {
    attribution: tileAttributions[mode],
    maxZoom: 19,
    subdomains: mode === 'topo' ? 'abc' : ''
  }).addTo(mapInstance)

  markersLayer = L.layerGroup().addTo(mapInstance)

  // Add Almaty Depot Marker (Автобаза Тартып)
  addDepotMarker()

  // Render container markers
  renderMarkers()

  // Draw CVRP Route
  if (showRoutePolyline.value) {
    drawRoute()
  }
}

const switchTileLayer = (mode: 'dark' | 'standard' | 'topo') => {
  activeTileLayer.value = mode
  if (!mapInstance || !L) return

  if (tileLayerInstance) {
    mapInstance.removeLayer(tileLayerInstance)
  }

  tileLayerInstance = L.tileLayer(tileURLs[mode], {
    attribution: tileAttributions[mode],
    maxZoom: 19,
    subdomains: mode === 'topo' ? 'abc' : ''
  }).addTo(mapInstance)
}

const addDepotMarker = () => {
  if (!mapInstance || !L) return

  const depotCoords = [43.2750, 76.8850] // Автобаза «Тартып»
  const depotIcon = L.divIcon({
    className: 'custom-depot-icon',
    html: `
      <div class="depot-marker-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span class="depot-label">Депо «Тартып»</span>
      </div>
    `,
    iconSize: [120, 36],
    iconAnchor: [60, 18]
  })

  depotMarker = L.marker(depotCoords, { icon: depotIcon })
    .bindPopup('<b>Автобаза мусоровозов «Тартып»</b><br>Точка старта и финиша маршрутов CVRP<br>Алматы, пр. Рыскулова 57')
    .addTo(mapInstance)
}

const renderMarkers = () => {
  if (!markersLayer || !L) return

  markersLayer.clearLayers()

  const filtered = selectedDistricts.value.includes('all')
    ? props.containers
    : props.containers.filter(c => selectedDistricts.value.includes(c.district))

  filtered.forEach(bin => {
    let colorClass = 'pin-normal'
    if (bin.status === 'Cleaning') colorClass = 'pin-cleaning'
    else if (bin.currentFillPct >= 85) colorClass = 'pin-critical'
    else if (bin.currentFillPct >= 60) colorClass = 'pin-warning'

    const isSel = props.selectedBin?.id === bin.id
    const isDetour = props.manualDetourBinIds?.includes(bin.id)

    const iconHtml = `
      <div class="osm-bin-pin ${colorClass} ${isSel ? 'is-selected' : ''} ${isDetour ? 'is-detour-stop' : ''}">
        <div class="pin-ring"></div>
        <div class="pin-core">
          <span class="pin-val">${bin.currentFillPct}%</span>
        </div>
        <div class="pin-sub-tag">${bin.name}${isDetour ? ' (Заезд)' : ''}</div>
      </div>
    `

    const icon = L.divIcon({
      className: 'custom-bin-div-icon',
      html: iconHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    })

    const marker = L.marker([bin.lat, bin.lon], { icon })

    marker.on('click', () => {
      emit('select', bin)
    })

    marker.bindPopup(`
      <div style="font-family: Inter, sans-serif; font-size: 13px; color: #0E1410">
        <strong style="font-size: 14px">${bin.name}</strong><br>
        <span>${bin.address}</span><br>
        <span>Район: ${bin.district}</span><br>
        <div style="margin-top: 6px; font-weight: 600">
          Заполнение: <span style="color: ${bin.currentFillPct >= 85 ? '#C93A2B' : '#2F7A22'}">${bin.currentFillPct}%</span> (${bin.currentDistCm} см)
        </div>
        <div>Статус: <b>${bin.status}</b></div>
        <div style="font-size: 11px; color: #666; margin-top: 4px">ESP32: ${bin.sensor.deviceId.slice(0, 16)}…</div>
      </div>
    `)

    markersLayer.addLayer(marker)
  })
}

function solveTspOrder(
  start: [number, number],
  points: Array<{ lat: number; lon: number; bin: Container }>
): Array<{ lat: number; lon: number; bin: Container }> {
  if (points.length <= 1) return points
  const remaining = [...points]
  const ordered: Array<{ lat: number; lon: number; bin: Container }> = []
  let currLat = start[0]
  let currLon = start[1]

  while (remaining.length > 0) {
    let bestIdx = 0
    let bestDist = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const p = remaining[i]
      if (!p) continue
      const dist = Math.hypot(p.lat - currLat, p.lon - currLon)
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = i
      }
    }
    const nextPoint = remaining.splice(bestIdx, 1)[0]
    if (nextPoint) {
      ordered.push(nextPoint)
      currLat = nextPoint.lat
      currLon = nextPoint.lon
    }
  }
  return ordered
}

const drawRoute = () => {
  if (!mapInstance || !L) return

  if (routePolylineLayer) {
    mapInstance.removeLayer(routePolylineLayer)
    routePolylineLayer = null
  }

  const visibleContainers = selectedDistricts.value.includes('all')
    ? props.containers
    : props.containers.filter(c => selectedDistricts.value.includes(c.district))

  // Route candidates: ONLY containers with >= 60% OR explicitly requested via manualDetourBinIds
  const candidates = visibleContainers.filter(
    c => c.currentFillPct >= 60 || (props.manualDetourBinIds && props.manualDetourBinIds.includes(c.id))
  )

  // If no containers need pickup, route polyline is NOT drawn at all!
  if (candidates.length === 0) return

  const depotCoords: [number, number] = [43.2750, 76.8850] // Автобаза «Тартып»

  const candidatePoints = candidates.map(c => ({
    lat: c.lat,
    lon: c.lon,
    bin: c
  }))

  const orderedPoints = solveTspOrder(depotCoords, candidatePoints)

  const latLngs: Array<[number, number]> = [
    depotCoords,
    ...orderedPoints.map(p => [p.lat, p.lon] as [number, number]),
    depotCoords
  ]

  const routeColor = props.dark ? '#4CD137' : '#1E824C'

  routePolylineLayer = L.polyline(latLngs, {
    color: routeColor,
    weight: 4,
    opacity: 0.92,
    dashArray: '8, 8',
    lineJoin: 'round'
  }).addTo(mapInstance)

  const districtNames = selectedDistricts.value.includes('all')
    ? 'Все районы Алматы'
    : selectedDistricts.value.map(d => d.replace(' район', '')).join(', ')

  routePolylineLayer.bindTooltip(
    `<b>Трасса CVRP (${districtNames}):</b><br>Точек: ${orderedPoints.length} баков + Депо «Тартып»`,
    { sticky: true }
  )
}

const toggleRoute = () => {
  showRoutePolyline.value = !showRoutePolyline.value
  if (showRoutePolyline.value) {
    drawRoute()
  } else if (routePolylineLayer && mapInstance) {
    mapInstance.removeLayer(routePolylineLayer)
    routePolylineLayer = null
  }
}

// Watchers
watch(
  () => props.containers,
  () => {
    renderMarkers()
    if (showRoutePolyline.value) drawRoute()
  },
  { deep: true }
)

watch(
  () => props.selectedBin,
  newBin => {
    renderMarkers()
    if (newBin && mapInstance) {
      mapInstance.panTo([newBin.lat, newBin.lon], { animate: true, duration: 0.6 })
    }
  }
)

watch(
  () => props.dark,
  isDark => {
    switchTileLayer(isDark ? 'dark' : 'standard')
    if (showRoutePolyline.value) {
      drawRoute()
    }
  }
)

watch(
  () => props.manualDetourBinIds,
  () => {
    renderMarkers()
    if (showRoutePolyline.value) {
      drawRoute()
    }
  },
  { deep: true }
)
</script>

<style>
/* Leaflet Global Marker & Dark Tile Styling */
.custom-bin-div-icon,
.custom-depot-icon {
  background: transparent;
  border: none;
}

/* Hide Leaflet & OpenStreetMap attribution bar */
.leaflet-control-attribution {
  display: none !important;
}

/* 100% Free Dark Mode for OpenStreetMap Tiles without any API Key */
.leaflet-map-element.is-dark-theme .leaflet-tile-pane {
  filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(92%);
}
.leaflet-tile-pane {
  transition: filter 0.3s ease;
}

.osm-bin-pin {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.osm-bin-pin:hover,
.osm-bin-pin.is-selected {
  transform: scale(1.2);
  z-index: 1000 !important;
}

.pin-core {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #050605;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 700;
  font-size: 11px;
}

.pin-sub-tag {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #F2F5F1;
  background: rgba(5, 6, 5, 0.9);
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 2px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* Status colors */
.pin-critical .pin-core {
  background: #C93A2B;
  color: #FFFFFF;
}
.pin-warning .pin-core {
  background: #F2A93B;
  color: #08130A;
}
.pin-normal .pin-core {
  background: #4CD137;
  color: #08130A;
}
.pin-cleaning .pin-core {
  background: #9B59B6;
  color: #FFFFFF;
}

/* Manual detour marker style */
.osm-bin-pin.is-detour-stop .pin-core {
  box-shadow: 0 0 0 3px #54A0FF, 0 4px 14px rgba(0, 0, 0, 0.6);
}
.osm-bin-pin.is-detour-stop .pin-sub-tag {
  background: #0D2137;
  color: #70A1FF;
  border: 1px solid #2980B9;
}

/* Pulsing aura */
.pin-critical .pin-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: 12px;
  border-radius: 50%;
  border: 2px solid #C93A2B;
  animation: okBlink 1.5s ease-in-out infinite;
}

/* Depot Marker */
.depot-marker-box {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #1B2A1C;
  border: 1.5px solid #4CD137;
  color: #4CD137;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
}

.almaty-map-wrapper.is-light-theme .depot-marker-box {
  background: #FFFFFF;
  border: 1.5px solid #2F7A22;
  color: #2F7A22;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.almaty-map-wrapper.is-light-theme .depot-marker-box svg {
  stroke: #2F7A22;
}
</style>

<style scoped>
.almaty-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 540px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #080A09;
  border: 1px solid #1F2521;
}

.map-toolbar {
  padding: 12px 18px;
  background: rgba(14, 17, 15, 0.95);
  border-bottom: 1px solid #1F2521;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  z-index: 500;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.city-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}
.city-pin-svg {
  color: #4CD137;
}
.city-name {
  font-size: 14px;
  font-weight: 600;
  color: #F2F5F1;
}
.coords-tag {
  font-size: 11px;
  color: #7FE06C;
  background: rgba(76, 209, 55, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.districts-filter {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dist-btn {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #2F3631;
  background: transparent;
  color: #A9B2AA;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.dist-btn.is-active {
  background: #1B2A1C;
  border-color: #4CD137;
  color: #4CD137;
  font-weight: 600;
}

.tiles-switcher {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #2F3631;
}

.tile-btn {
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: #A9B2AA;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tile-btn.is-active {
  background: #2F3631;
  color: #F2F5F1;
  font-weight: 600;
}

.route-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #2F3631;
  background: transparent;
  color: #A9B2AA;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.route-toggle-btn.is-active {
  background: rgba(76, 209, 55, 0.15);
  border-color: #4CD137;
  color: #7FE06C;
  font-weight: 600;
}

.leaflet-map-element {
  flex: 1;
  width: 100%;
  min-height: 480px;
  background: #080A09;
}

/* ================= DARK OSM THEME FILTER (NO API KEY REQUIRED) ================= */
/* Invert only the tile pane so roads, land, and contours become dark/cyberpunk,
   while keeping markers, route polyline and popups untouched in their true colors! */
:deep(.leaflet-map-element.is-dark-theme .leaflet-tile-pane) {
  filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(92%);
}

.mountains-tag {
  position: absolute;
  bottom: 12px;
  left: 16px;
  z-index: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
  font-size: 11px;
  color: #A9B2AA;
  pointer-events: none;
  backdrop-filter: blur(6px);
}

/* ================= LIGHT THEME FOR MAP WRAPPER & TOOLBAR ================= */
.almaty-map-wrapper.is-light-theme {
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.05);
}

.almaty-map-wrapper.is-light-theme .map-toolbar {
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #E0E5DE;
}

.almaty-map-wrapper.is-light-theme .city-name {
  color: #0E1410;
}

.almaty-map-wrapper.is-light-theme .city-pin-svg {
  color: #2F7A22;
}

.almaty-map-wrapper.is-light-theme .coords-tag {
  color: #2F7A22;
  background: #EEF7EC;
  border: 1px solid #D2EBD0;
}

.almaty-map-wrapper.is-light-theme .dist-btn {
  border: 1px solid #DCE2DA;
  background: #FFFFFF;
  color: #4E5950;
}

.almaty-map-wrapper.is-light-theme .dist-btn:hover {
  border-color: #2F7A22;
  color: #2F7A22;
}

.almaty-map-wrapper.is-light-theme .dist-btn.is-active {
  background: #EEF7EC;
  border-color: #2F7A22;
  color: #2F7A22;
  font-weight: 600;
}

.almaty-map-wrapper.is-light-theme .tiles-switcher {
  border: 1px solid #DCE2DA;
  background: #FFFFFF;
}

.almaty-map-wrapper.is-light-theme .tile-btn {
  color: #4E5950;
  background: transparent;
}

.almaty-map-wrapper.is-light-theme .tile-btn:hover {
  color: #0E1410;
}

.almaty-map-wrapper.is-light-theme .tile-btn.is-active {
  background: #EEF1EC;
  color: #0E1410;
  font-weight: 600;
}

.almaty-map-wrapper.is-light-theme .route-toggle-btn {
  border: 1px solid #DCE2DA;
  background: #FFFFFF;
  color: #4E5950;
}

.almaty-map-wrapper.is-light-theme .route-toggle-btn:hover {
  border-color: #2F7A22;
  color: #2F7A22;
}

.almaty-map-wrapper.is-light-theme .route-toggle-btn.is-active {
  background: #EEF7EC;
  border-color: #2F7A22;
  color: #2F7A22;
  font-weight: 600;
}

.almaty-map-wrapper.is-light-theme .leaflet-map-element {
  background: #E8ECE6;
}

.almaty-map-wrapper.is-light-theme .mountains-tag {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #E0E5DE;
  color: #4E5950;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
