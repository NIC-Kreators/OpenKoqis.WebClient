export type ContainerType = 'residential' | 'commercial' | 'public'
export type ContainerStatus = 'Working' | 'Cleaning'

export interface SensorNode {
  deviceId: string // UUID v7
  firmware: string // e.g. "v2.4.1-esp32"
  batteryV: number // e.g. 3.85V
  modemType: 'SIM7080G (NB-IoT)' | 'Wi-Fi'
  lastRssiDbm: number
}

export interface Reading {
  binId: string
  ts: string // ISO 8601
  seq: number
  distCm: number
  fillPct: number // 0-100%
  tempC: number
  smokeFlag: boolean
  isFault: boolean
  rawPings?: number[] // 5 raw pings before median filter
  hampelAccepted?: boolean
}

export interface Container {
  id: string
  name: string
  address: string
  district: string // e.g. "Есильский район", "Алматинский район", "Сарыарка", "Байконур"
  type: ContainerType
  lat: number
  lon: number
  volumeM3: number // 1.1 or 0.24
  depthM: number // H, e.g. 1.20m
  blindZoneM: number // d0, e.g. 0.25m
  status: ContainerStatus
  cleaningStartedAt?: string | null
  currentFillPct: number
  currentDistCm: number
  tempC: number
  sensor: SensorNode
  lastReading: Reading
  lastPickupAt?: string
  predictedFillTomorrow: number
  upperBound90Pct: number
  consecutiveHighPings: number
}

export interface Pickup {
  id: string
  containerId: string
  containerName: string
  address: string
  ts: string
  fillBefore: number
  confirmed: boolean // confirmed by driver or auto-detected
  isAutoDetected?: boolean
  driverName?: string
}

export interface Truck {
  id: string
  code: string
  model: string // e.g. "КамАЗ-КО-440", "Scania P280 GeesinkNorba"
  capacityBins: number // standard 30 containers
  depot: {
    name: string
    lat: number
    lon: number
  }
  assignedDriver: string
  currentLoadBins: number
  status: 'In Depot' | 'On Route' | 'Unloading' | 'Maintenance'
}

export interface RouteStop {
  stopOrder: number
  container: Container
  estimatedArrival: string
  completed: boolean
  fillAtArrival?: number
}

export interface WasteRoute {
  id: string
  date: string
  truck: Truck
  distanceKm: number
  detourFactor: number // kappa = 1.35
  stops: RouteStop[]
  status: 'Planned' | 'In Progress' | 'Completed'
  sanpinRuleApplied: string // e.g. "T > 0°C: вывоз не реже 1 раза в сутки"
  shiftDurationHours: number
}

export interface SmartAlert {
  id: string
  type: 'overflow' | 'cleaning_timeout' | 'unmarked_emptying' | 'sensor_fault'
  title: string
  message: string
  containerId: string
  containerName: string
  address: string
  ts: string
  severity: 'critical' | 'warning' | 'info'
  acknowledged: boolean
}
