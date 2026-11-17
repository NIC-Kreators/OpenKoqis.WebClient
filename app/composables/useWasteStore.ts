import { ref, computed } from 'vue'
import type { Container, Reading, Truck, WasteRoute, SmartAlert } from '~/types/waste'

// 1. Physical and Sonar Math
export function speedOfSound(tempC: number): number {
  return 331.3 + 0.606 * tempC
}

export function calculateFillPercentage(distCm: number, depthM: number = 1.20, blindZoneM: number = 0.25): number {
  const distM = distCm / 100
  const effectiveDistance = Math.max(blindZoneM, distM)
  const fill = ((depthM - (effectiveDistance - blindZoneM)) / depthM) * 100
  return Math.min(100, Math.max(0, parseFloat(fill.toFixed(1))))
}

export function isHampelOutlier(x_t: number, median_m: number, mad: number, minThreshold: number = 6.0): boolean {
  const diff = Math.abs(x_t - median_m)
  const threshold = Math.max(3 * 1.4826 * mad, minThreshold)
  return diff > threshold
}

// Almaty (Алматы) Waste Containers Data
const almatyContainers: Container[] = [
  {
    id: 'alm-bin-101',
    name: 'ALM-BIN-101',
    address: 'пр. Достык, 89 (гостиница Казахстан)',
    district: 'Медеуский район',
    type: 'residential',
    lat: 43.2425,
    lon: 76.9582,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 88.5,
    currentDistCm: 38.8,
    tempC: 4.5,
    consecutiveHighPings: 1,
    predictedFillTomorrow: 96.0,
    upperBound90Pct: 104.2,
    lastPickupAt: '2026-11-15T08:30:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7001-esp32-alm001',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.84,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -68
    },
    lastReading: {
      binId: 'alm-bin-101',
      ts: '2026-11-16T17:20:00Z',
      seq: 142,
      distCm: 38.8,
      fillPct: 88.5,
      tempC: 4.5,
      smokeFlag: false,
      isFault: false,
      rawPings: [38.5, 39.1, 38.8, 38.7, 39.0],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-102',
    name: 'ALM-BIN-102',
    address: 'пр. Аль-Фараби, 77 (ТРЦ Esentai Mall)',
    district: 'Бостандыкский район',
    type: 'commercial',
    lat: 43.2185,
    lon: 76.9288,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 96.2,
    currentDistCm: 29.5,
    tempC: 4.8,
    consecutiveHighPings: 3,
    predictedFillTomorrow: 105.0,
    upperBound90Pct: 114.5,
    lastPickupAt: '2026-11-15T19:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7002-esp32-alm002',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.79,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -62
    },
    lastReading: {
      binId: 'alm-bin-102',
      ts: '2026-11-16T17:22:00Z',
      seq: 201,
      distCm: 29.5,
      fillPct: 96.2,
      tempC: 4.8,
      smokeFlag: false,
      isFault: false,
      rawPings: [29.2, 29.8, 29.5, 29.6, 29.4],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-103',
    name: 'ALM-BIN-103',
    address: 'ул. Панфилова / ул. Толе би (Пешеходная зона)',
    district: 'Алмалинский район',
    type: 'public',
    lat: 43.2558,
    lon: 76.9452,
    volumeM3: 0.24,
    depthM: 0.90,
    blindZoneM: 0.20,
    status: 'Working',
    currentFillPct: 45.0,
    currentDistCm: 69.5,
    tempC: 5.1,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 62.0,
    upperBound90Pct: 73.9,
    lastPickupAt: '2026-11-16T06:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7003-esp32-alm003',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.91,
      modemType: 'Wi-Fi',
      lastRssiDbm: -52
    },
    lastReading: {
      binId: 'alm-bin-103',
      ts: '2026-11-16T17:24:00Z',
      seq: 88,
      distCm: 69.5,
      fillPct: 45.0,
      tempC: 5.1,
      smokeFlag: false,
      isFault: false,
      rawPings: [69.0, 70.0, 69.5, 69.3, 69.6],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-104',
    name: 'ALM-BIN-104',
    address: 'ул. Розыбакиева, 247 (ТРЦ Mega Center)',
    district: 'Бостандыкский район',
    type: 'commercial',
    lat: 43.2032,
    lon: 76.8924,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 74.5,
    currentDistCm: 55.6,
    tempC: 4.2,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 88.0,
    upperBound90Pct: 99.9,
    lastPickupAt: '2026-11-15T14:10:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7004-esp32-alm004',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.82,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -65
    },
    lastReading: {
      binId: 'alm-bin-104',
      ts: '2026-11-16T17:15:00Z',
      seq: 312,
      distCm: 55.6,
      fillPct: 74.5,
      tempC: 4.2,
      smokeFlag: false,
      isFault: false,
      rawPings: [55.4, 55.9, 55.6, 55.7, 55.5],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-105',
    name: 'ALM-BIN-105',
    address: 'пр. Абая / ул. Байтурсынова (Дворец Спорта)',
    district: 'Алмалинский район',
    type: 'public',
    lat: 43.2398,
    lon: 76.9238,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 32.0,
    currentDistCm: 106.6,
    tempC: 4.9,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 48.0,
    upperBound90Pct: 59.9,
    lastPickupAt: '2026-11-16T07:15:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7005-esp32-alm005',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.88,
      modemType: 'Wi-Fi',
      lastRssiDbm: -58
    },
    lastReading: {
      binId: 'alm-bin-105',
      ts: '2026-11-16T17:21:00Z',
      seq: 155,
      distCm: 106.6,
      fillPct: 32.0,
      tempC: 4.9,
      smokeFlag: false,
      isFault: false,
      rawPings: [106.2, 106.9, 106.6, 106.5, 106.8],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-106',
    name: 'ALM-BIN-106',
    address: 'мкр. Самал-2, дом 15',
    district: 'Медеуский район',
    type: 'residential',
    lat: 43.2285,
    lon: 76.9542,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 91.2,
    currentDistCm: 35.5,
    tempC: 4.6,
    consecutiveHighPings: 2,
    predictedFillTomorrow: 98.5,
    upperBound90Pct: 108.4,
    lastPickupAt: '2026-11-15T09:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7006-esp32-alm006',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.75,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -72
    },
    lastReading: {
      binId: 'alm-bin-106',
      ts: '2026-11-16T17:18:00Z',
      seq: 260,
      distCm: 35.5,
      fillPct: 91.2,
      tempC: 4.6,
      smokeFlag: false,
      isFault: false,
      rawPings: [35.2, 35.8, 35.5, 35.4, 35.6],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-107',
    name: 'ALM-BIN-107',
    address: 'ул. Гоголя, 58 (Парк 28 панфиловцев)',
    district: 'Медеуский район',
    type: 'public',
    lat: 43.2592,
    lon: 76.9535,
    volumeM3: 0.24,
    depthM: 0.90,
    blindZoneM: 0.20,
    status: 'Working',
    currentFillPct: 68.0,
    currentDistCm: 48.8,
    tempC: 5.0,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 82.0,
    upperBound90Pct: 93.9,
    lastPickupAt: '2026-11-15T11:20:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7007-esp32-alm007',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.86,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -67
    },
    lastReading: {
      binId: 'alm-bin-107',
      ts: '2026-11-16T17:19:00Z',
      seq: 180,
      distCm: 48.8,
      fillPct: 68.0,
      tempC: 5.0,
      smokeFlag: false,
      isFault: false,
      rawPings: [48.5, 49.0, 48.8, 48.6, 48.9],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-108',
    name: 'ALM-BIN-108',
    address: 'пр. Алтынсарина / ул. Жандосова',
    district: 'Ауэзовский район',
    type: 'residential',
    lat: 43.2198,
    lon: 76.8585,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 18.2,
    currentDistCm: 123.1,
    tempC: 4.3,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 35.0,
    upperBound90Pct: 46.9,
    lastPickupAt: '2026-11-16T12:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7008-esp32-alm008',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.89,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -64
    },
    lastReading: {
      binId: 'alm-bin-108',
      ts: '2026-11-16T17:23:00Z',
      seq: 220,
      distCm: 123.1,
      fillPct: 18.2,
      tempC: 4.3,
      smokeFlag: false,
      isFault: false,
      rawPings: [122.9, 123.3, 123.1, 123.0, 123.2],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-109',
    name: 'ALM-BIN-109',
    address: 'ул. Тимирязева, 42 (КазНУ им. аль-Фараби)',
    district: 'Бостандыкский район',
    type: 'residential',
    lat: 43.2241,
    lon: 76.9142,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Cleaning',
    cleaningStartedAt: '2026-11-16T16:05:00Z', // > 1 hour ago! Alert trigger!
    currentFillPct: 5.0,
    currentDistCm: 139.0,
    tempC: 4.7,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 25.0,
    upperBound90Pct: 36.9,
    lastPickupAt: '2026-11-16T16:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7009-esp32-alm009',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.81,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -70
    },
    lastReading: {
      binId: 'alm-bin-109',
      ts: '2026-11-16T16:04:00Z',
      seq: 95,
      distCm: 139.0,
      fillPct: 5.0,
      tempC: 4.7,
      smokeFlag: false,
      isFault: false,
      rawPings: [138.8, 139.2, 139.0, 138.9, 139.1],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-110',
    name: 'ALM-BIN-110',
    address: 'ул. Толе би / ул. Ауэзова',
    district: 'Алмалинский район',
    type: 'residential',
    lat: 43.2520,
    lon: 76.9035,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 14.5,
    currentDistCm: 127.6,
    tempC: 5.2,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 30.0,
    upperBound90Pct: 41.9,
    lastPickupAt: '2026-11-16T15:10:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7010-esp32-alm010',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.78,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -71
    },
    lastReading: {
      binId: 'alm-bin-110',
      ts: '2026-11-16T17:10:00Z',
      seq: 140,
      distCm: 127.6,
      fillPct: 14.5,
      tempC: 5.2,
      smokeFlag: false,
      isFault: false,
      rawPings: [127.2, 127.9, 127.6, 127.4, 127.7],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-111',
    name: 'ALM-BIN-111',
    address: 'мкр. Орбита-3, дом 22',
    district: 'Бостандыкский район',
    type: 'residential',
    lat: 43.1975,
    lon: 76.8785,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 82.0,
    currentDistCm: 46.6,
    tempC: 4.1,
    consecutiveHighPings: 1,
    predictedFillTomorrow: 94.0,
    upperBound90Pct: 105.9,
    lastPickupAt: '2026-11-15T10:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7011-esp32-alm011',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.83,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -66
    },
    lastReading: {
      binId: 'alm-bin-111',
      ts: '2026-11-16T17:21:00Z',
      seq: 190,
      distCm: 46.6,
      fillPct: 82.0,
      tempC: 4.1,
      smokeFlag: false,
      isFault: false,
      rawPings: [46.3, 46.9, 46.6, 46.5, 46.7],
      hampelAccepted: true
    }
  },
  {
    id: 'alm-bin-112',
    name: 'ALM-BIN-112',
    address: 'пр. Сейфуллина / пр. Райымбека (Саяхат)',
    district: 'Жетысуский район',
    type: 'commercial',
    lat: 43.2685,
    lon: 76.9421,
    volumeM3: 1.1,
    depthM: 1.20,
    blindZoneM: 0.25,
    status: 'Working',
    currentFillPct: 54.0,
    currentDistCm: 80.2,
    tempC: 5.4,
    consecutiveHighPings: 0,
    predictedFillTomorrow: 70.0,
    upperBound90Pct: 81.9,
    lastPickupAt: '2026-11-16T08:00:00Z',
    sensor: {
      deviceId: '018f4c22-7b11-7012-esp32-alm012',
      firmware: 'v2.4.1-esp32',
      batteryV: 3.87,
      modemType: 'SIM7080G (NB-IoT)',
      lastRssiDbm: -63
    },
    lastReading: {
      binId: 'alm-bin-112',
      ts: '2026-11-16T17:23:00Z',
      seq: 110,
      distCm: 80.2,
      fillPct: 54.0,
      tempC: 5.4,
      smokeFlag: false,
      isFault: false,
      rawPings: [79.9, 80.5, 80.2, 80.1, 80.3],
      hampelAccepted: true
    }
  }
]

const almatyTrucks: Truck[] = [
  {
    id: 'trk-alm-01',
    code: 'TRUCK-01-ALM',
    model: 'КамАЗ-КО-440-4Д (18 м³)',
    capacityBins: 30,
    depot: {
      name: 'Автобаза «Тартып» (Алматы, пр. Рыскулова 57)',
      lat: 43.2750,
      lon: 76.8850
    },
    assignedDriver: 'Куандыков Бексултан',
    currentLoadBins: 19,
    status: 'On Route'
  },
  {
    id: 'trk-alm-02',
    code: 'TRUCK-02-ALM',
    model: 'MAN TGM 26.290 (22 м³)',
    capacityBins: 30,
    depot: {
      name: 'Автобаза «Тартып» (Алматы, пр. Рыскулова 57)',
      lat: 43.2750,
      lon: 76.8850
    },
    assignedDriver: 'Ерлан Сапаров',
    currentLoadBins: 0,
    status: 'In Depot'
  }
]

// Initial 3 Canonical Smart Alerts for OpenKoqis Almaty
const almatyAlerts: SmartAlert[] = [
  {
    id: 'alt-alm-001',
    type: 'overflow',
    title: 'Критическое переполнение контейнера',
    message: 'Уровень заполнения 96.2% держится ≥ 2 замеров подряд (расстояние до мусора 29.5 см).',
    containerId: 'alm-bin-102',
    containerName: 'ALM-BIN-102',
    address: 'пр. Аль-Фараби, 77 (ТРЦ Esentai Mall)',
    ts: '2026-11-16T17:22:00Z',
    severity: 'critical',
    acknowledged: false
  },
  {
    id: 'alt-alm-002',
    type: 'cleaning_timeout',
    title: 'Зависание в статусе Cleaning (> 1 часа)',
    message: 'Контейнер находится в статусе «Cleaning» более 75 минут. Возможно, водитель забыл закрыть крышку или переключить статус.',
    containerId: 'alm-bin-109',
    containerName: 'ALM-BIN-109',
    address: 'ул. Тимирязева, 42 (КазНУ)',
    ts: '2026-11-16T17:10:00Z',
    severity: 'warning',
    acknowledged: false
  },
  {
    id: 'alt-alm-003',
    type: 'unmarked_emptying',
    title: 'Автодетекция забытого вывоза (Unmarked Emptying)',
    message: 'Уровень заполнения упал на 67 п.п. (с 82% до 15%) в статусе Working без цикла Cleaning. Факт вывоза зафиксирован автоматически.',
    containerId: 'alm-bin-110',
    containerName: 'ALM-BIN-110',
    address: 'ул. Толе би / ул. Ауэзова',
    ts: '2026-11-16T15:15:00Z',
    severity: 'info',
    acknowledged: false
  }
]

// Global reactive states
const currentCity = ref<'almaty' | 'astana'>('almaty')
const containers = ref<Container[]>(almatyContainers)
const trucks = ref<Truck[]>(almatyTrucks)
const alerts = ref<SmartAlert[]>(almatyAlerts)
const telemetryStream = ref<Reading[]>([])
const isMqttConnected = ref(true)
const completedContainerIds = ref<string[]>([])
const manualDetourBinIds = ref<string[]>([])

function solveTspOrder<T extends { lat: number; lon: number }>(
  start: [number, number],
  points: T[]
): T[] {
  if (points.length <= 1) return [...points]
  const remaining = [...points]
  const ordered: T[] = []
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

export function useWasteStore() {
  const totalContainers = computed(() => containers.value.length)
  const criticalCount = computed(() => containers.value.filter(c => c.currentFillPct >= 85).length)
  const warningCount = computed(() => containers.value.filter(c => c.currentFillPct >= 60 && c.currentFillPct < 85).length)
  const normalCount = computed(() => containers.value.filter(c => c.currentFillPct < 60).length)
  const cleaningCount = computed(() => containers.value.filter(c => c.status === 'Cleaning').length)

  // In Almaty, current temperature is +4.5°C (> 0°C) -> Daily pickup required under SanPiN RK!
  const currentTemp = computed(() => (currentCity.value === 'almaty' ? 4.5 : -4.2))
  const sanpinIntervalDays = computed(() => (currentTemp.value > 0 ? 1 : 3))
  const sanpinRuleText = computed(() =>
    currentTemp.value > 0
      ? `T = ${currentTemp.value}°C (> 0°C) — СанПиН РК: вывоз не реже 1 раза в сутки (каждые 24 часа)`
      : `T = ${currentTemp.value}°C (≤ 0°C) — СанПиН РК: гарантированный вывоз не реже 1 раза в 3 суток`
  )

  // State Machine Toggle: Working <-> Cleaning
  const toggleContainerStatus = (containerId: string) => {
    const target = containers.value.find(c => c.id === containerId)
    if (!target) return

    if (target.status === 'Working') {
      target.status = 'Cleaning'
      target.cleaningStartedAt = new Date().toISOString()

      // Add cleaning alert
      alerts.value = alerts.value.filter(a => !(a.containerId === containerId && a.type === 'cleaning_timeout'))
      alerts.value.unshift({
        id: `alt-cleaning-${containerId}-${Date.now()}`,
        type: 'cleaning_timeout',
        title: `Контейнер в статусе Cleaning`,
        message: `${target.name} переведён в статус «Cleaning». Идёт выгрузка мусора, телеметрия сонара временно заблокирована.`,
        containerId: target.id,
        containerName: target.name,
        address: target.address,
        ts: new Date().toISOString(),
        severity: 'warning',
        acknowledged: false
      })
    } else {
      // Exiting Cleaning -> Working: container is emptied and back in service!
      target.status = 'Working'
      target.cleaningStartedAt = null
      target.currentFillPct = 5.0
      target.currentDistCm = 139.0
      target.lastPickupAt = new Date().toISOString()
      target.consecutiveHighPings = 0

      if (!completedContainerIds.value.includes(containerId)) {
        completedContainerIds.value.push(containerId)
      }

      // Remove from manual detour if emptied
      manualDetourBinIds.value = manualDetourBinIds.value.filter(id => id !== containerId)

      // Remove ALL active alerts for this cleaned container!
      alerts.value = alerts.value.filter(a => a.containerId !== containerId)
    }
  }

  // Confirm Pickup Action (Driver / Dispatcher button)
  const confirmPickup = (containerId: string) => {
    const target = containers.value.find(c => c.id === containerId)
    if (!target) return

    target.status = 'Working'
    target.cleaningStartedAt = null
    target.currentFillPct = 5.0
    target.currentDistCm = 139.0
    target.lastPickupAt = new Date().toISOString()
    target.consecutiveHighPings = 0

    if (!completedContainerIds.value.includes(containerId)) {
      completedContainerIds.value.push(containerId)
    }

    // Remove from manual detour if emptied
    manualDetourBinIds.value = manualDetourBinIds.value.filter(id => id !== containerId)

    // Container is emptied -> remove ALL alerts associated with it!
    alerts.value = alerts.value.filter(a => a.containerId !== containerId)
  }

  // Dismiss / Acknowledge alert
  const dismissAlert = (alertId: string) => {
    alerts.value = alerts.value.filter(a => a.id !== alertId)
  }

  // Manual Detour for specific bin
  const isManualDetour = (containerId: string): boolean => {
    return manualDetourBinIds.value.includes(containerId)
  }

  const toggleManualDetour = (containerId: string) => {
    if (manualDetourBinIds.value.includes(containerId)) {
      manualDetourBinIds.value = manualDetourBinIds.value.filter(id => id !== containerId)
    } else {
      manualDetourBinIds.value.push(containerId)
    }
  }

  // Generate OR-Tools optimized route
  const getOptimizedRoute = (): WasteRoute => {
    const fallbackTruck: Truck = trucks.value[0] || {
      id: 'trk-alm-01',
      code: 'TRUCK-01-ALM',
      model: 'КамАЗ-КО-440-4Д (18 м³)',
      capacityBins: 30,
      depot: {
        name: 'Автобаза «Тартып» (Алматы, пр. Рыскулова 57)',
        lat: 43.2750,
        lon: 76.8850
      },
      assignedDriver: 'Куандыков Бексултан',
      currentLoadBins: 0,
      status: 'On Route'
    }

    // STRICT: Candidates are ONLY bins with currentFillPct >= 60 OR requested via manualDetourBinIds
    const candidates = containers.value.filter(
      c => c.currentFillPct >= 60 || manualDetourBinIds.value.includes(c.id)
    )

    if (candidates.length === 0) {
      return {
        id: 'RT-ALM-2026-11-16-01',
        date: '16.11.2026',
        truck: fallbackTruck,
        distanceKm: 0,
        detourFactor: 1.35,
        stops: [],
        status: 'Completed',
        sanpinRuleApplied: sanpinRuleText.value,
        shiftDurationHours: 0
      }
    }

    const depotCoords: [number, number] = [43.2750, 76.8850]
    const ordered = solveTspOrder(
      depotCoords,
      candidates.map(c => ({ lat: c.lat, lon: c.lon, bin: c }))
    )

    let totalDistKm = 0
    let prev = depotCoords
    ordered.forEach(p => {
      const dLat = (p.lat - prev[0]) * 111
      const dLon = (p.lon - prev[1]) * 111 * Math.cos((prev[0] * Math.PI) / 180)
      totalDistKm += Math.hypot(dLat, dLon)
      prev = [p.lat, p.lon]
    })
    const dLat = (depotCoords[0] - prev[0]) * 111
    const dLon = (depotCoords[1] - prev[1]) * 111 * Math.cos((depotCoords[0] * Math.PI) / 180)
    totalDistKm += Math.hypot(dLat, dLon)
    totalDistKm = parseFloat((totalDistKm * 1.35).toFixed(1))

    const shiftHours = parseFloat((ordered.length * (2 / 60) + totalDistKm / 25).toFixed(1))

    const stops = ordered.map((p, index) => {
      const bin = p.bin
      const isCompleted = completedContainerIds.value.includes(bin.id) && bin.currentFillPct <= 15
      return {
        stopOrder: index + 1,
        container: bin,
        estimatedArrival: `08:${(30 + index * 12).toString().padStart(2, '0')}`,
        completed: isCompleted,
        fillAtArrival: bin.currentFillPct
      }
    })

    return {
      id: 'RT-ALM-2026-11-16-01',
      date: '16.11.2026',
      truck: fallbackTruck,
      distanceKm: totalDistKm,
      detourFactor: 1.35,
      stops,
      status: 'In Progress',
      sanpinRuleApplied: sanpinRuleText.value,
      shiftDurationHours: Math.min(8.0, shiftHours)
    }
  }

  // Simulate incoming MQTT Telemetry
  const simulateMqttPing = (containerId: string, distCm: number, tempC: number) => {
    const target = containers.value.find(c => c.id === containerId)
    if (!target) return

    if (target.status === 'Cleaning') {
      return
    }

    const fillPct = calculateFillPercentage(distCm, target.depthM, target.blindZoneM)
    const newSeq = target.lastReading.seq + 1

    const newReading: Reading = {
      binId: containerId,
      ts: new Date().toISOString(),
      seq: newSeq,
      distCm,
      fillPct,
      tempC,
      smokeFlag: false,
      isFault: distCm < 0,
      rawPings: [distCm - 0.3, distCm + 0.4, distCm, distCm + 0.1, distCm - 0.2],
      hampelAccepted: true
    }

    target.lastReading = newReading
    target.currentFillPct = fillPct
    target.currentDistCm = distCm
    target.tempC = tempC

    if (fillPct > 15) {
      completedContainerIds.value = completedContainerIds.value.filter(id => id !== containerId)
    }

    if (fillPct >= 85 || distCm < 35) {
      target.consecutiveHighPings += 1
      if (!alerts.value.some(a => a.containerId === containerId && a.type === 'overflow')) {
        alerts.value.unshift({
          id: `alt-overflow-${containerId}-${Date.now()}`,
          type: 'overflow',
          title: `Критическое переполнение ${target.name}`,
          message: `Уровень заполнения ${fillPct}% (расстояние ${distCm} см). Необходим срочный вывоз!`,
          containerId: target.id,
          containerName: target.name,
          address: target.address,
          ts: new Date().toISOString(),
          severity: 'critical',
          acknowledged: false
        })
      }
    } else {
      target.consecutiveHighPings = 0
      // If fill is below threshold (e.g. simulated norm 20%), remove any overflow alert for this bin!
      alerts.value = alerts.value.filter(a => !(a.containerId === containerId && a.type === 'overflow'))
    }

    telemetryStream.value.unshift(newReading)
    if (telemetryStream.value.length > 50) {
      telemetryStream.value.pop()
    }
  }

  return {
    currentCity,
    containers,
    trucks,
    alerts,
    telemetryStream,
    isMqttConnected,
    completedContainerIds,
    totalContainers,
    criticalCount,
    warningCount,
    normalCount,
    cleaningCount,
    currentTemp,
    sanpinIntervalDays,
    sanpinRuleText,
    toggleContainerStatus,
    confirmPickup,
    dismissAlert,
    manualDetourBinIds,
    isManualDetour,
    toggleManualDetour,
    getOptimizedRoute,
    simulateMqttPing
  }
}
