<template>
  <div class="dashboard-root" :class="[isDark ? 'theme-truckbrain' : 'theme-monitoring']">
    <!-- Top Global Header -->
    <header class="dash-header">
      <div class="header-left">
        <OpenKoqisLogo :dark="isDark" :size="24" />
        <div class="system-badge">
          <span class="pulse-dot" />
          <span>MQTT Mosquitto: Онлайн (almaty/waste/bins/#)</span>
        </div>
        <div class="sanpin-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
          <span>СанПиН РК: Алматы +{{ currentTemp }}°C (Вывоз ежедневно)</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Theme Toggle Switcher (Dark / Light) -->
        <button
          type="button"
          class="theme-toggle-btn"
          :title="isDark ? 'Текущая тема: Тёмная. Нажмите для переключения на светлую' : 'Текущая тема: Светлая. Нажмите для переключения на тёмную'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span class="theme-btn-text">{{ isDark ? 'Тёмная' : 'Светлая' }}</span>
        </button>

        <!-- Mockup Links -->
        <div class="mockup-nav-links">
          <NuxtLink to="/loading" class="header-nav-link">
            Сплэш-экраны
          </NuxtLink>
        </div>

        <!-- User Profile & Keycloak Role Switcher -->
        <div class="user-profile-menu">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-meta">
            <span class="user-name">{{ currentUser?.name || 'Пользователь' }}</span>
            <span class="user-role-label">{{ currentUser?.roleName }}</span>
          </div>
          <div class="role-selector-wrapper">
            <select
              :value="currentUser?.role"
              class="role-select"
              @change="onRoleChange($event)"
            >
              <option value="dispatcher">Диспетчер (ЦУП Алматы)</option>
              <option value="driver">Водитель (Тартып №01)</option>
              <option value="analyst">Аналитик (ML)</option>
              <option value="admin">Root Admin</option>
            </select>
          </div>
          <button type="button" class="logout-btn" title="Выйти" @click="handleLogout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="dash-body">
      <!-- KPI Stats Bar -->
      <section class="kpi-bar">
        <div class="kpi-card">
          <span class="kpi-caption">Всего контейнеров</span>
          <span class="kpi-val">{{ totalContainers }}</span>
          <span class="kpi-sub">Алматы (Smart Data Models)</span>
        </div>

        <div class="kpi-card is-critical">
          <span class="kpi-caption">Критические (≥ 85%)</span>
          <span class="kpi-val">{{ criticalCount }}</span>
          <span class="kpi-sub">Срочный вывоз</span>
        </div>

        <div class="kpi-card is-warning">
          <span class="kpi-caption">Скоро заполнятся (60–84%)</span>
          <span class="kpi-val">{{ warningCount }}</span>
          <span class="kpi-sub">В маршрут TruckBrain</span>
        </div>

        <div class="kpi-card is-normal">
          <span class="kpi-caption">В норме (< 60%)</span>
          <span class="kpi-val">{{ normalCount }}</span>
          <span class="kpi-sub">Регулярный мониторинг</span>
        </div>

        <div class="kpi-card is-cleaning">
          <span class="kpi-caption">Статус Cleaning</span>
          <span class="kpi-val">{{ cleaningCount }}</span>
          <span class="kpi-sub">Обслуживание бака</span>
        </div>

        <div class="kpi-card is-alert" @click="activeTab = 'alerts'">
          <span class="kpi-caption">Активные алерты</span>
          <span class="kpi-val text-alert">{{ alerts.length }}</span>
          <span class="kpi-sub">Hampel / Cleaning / FL</span>
        </div>
      </section>

      <!-- Navigation Tabs -->
      <div class="tabs-bar">
        <button
          type="button"
          class="tab-item"
          :class="{ 'is-active': activeTab === 'map' }"
          @click="activeTab = 'map'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <span>Карта Алматы (OpenStreetMap)</span>
        </button>

        <button
          type="button"
          class="tab-item"
          :class="{ 'is-active': activeTab === 'truckbrain' }"
          @click="activeTab = 'truckbrain'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>TruckBrain & CVRP Маршруты</span>
        </button>

        <button
          type="button"
          class="tab-item"
          :class="{ 'is-active': activeTab === 'driver' }"
          @click="activeTab = 'driver'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <span>Планшет Водителя (Driver UI)</span>
        </button>

        <button
          type="button"
          class="tab-item"
          :class="{ 'is-active': activeTab === 'alerts' }"
          @click="activeTab = 'alerts'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span>Алерты & Аномалии ({{ alerts.length }})</span>
        </button>

        <button
          type="button"
          class="tab-item"
          :class="{ 'is-active': activeTab === 'telemetry' }"
          @click="activeTab = 'telemetry'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>MQTT Телеметрия (ESP32)</span>
        </button>

        <button
          type="button"
          class="tab-item"
          :class="{ 'is-active': activeTab === 'ml' }"
          @click="activeTab = 'ml'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>ML Прогноз (Ridge-регрессия)</span>
        </button>
      </div>

      <!-- ================= TAB 1: CONTAINER MAP ================= -->
      <section v-if="activeTab === 'map'" class="tab-view-container">
        <div class="map-layout">
          <!-- Left: Leaflet OpenStreetMap of Almaty -->
          <div class="map-visual-pane">
            <ClientOnly>
              <AlmatyMap
                :containers="containers"
                :selected-bin="selectedBin"
                :dark="isDark"
                :manual-detour-bin-ids="manualDetourBinIds"
                @select="selectBin"
              />
              <template #fallback>
                <div class="map-loading-fallback">
                  <span>Загрузка карты OpenStreetMap (Алматы)…</span>
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Right: Selected Container Inspector Panel -->
          <div class="map-inspector-pane">
            <div v-if="selectedBin" class="inspector-card">
              <div class="inspector-header">
                <div>
                  <h3 class="inspector-title">{{ selectedBin.name }}</h3>
                  <span class="inspector-addr">{{ selectedBin.address }} ({{ selectedBin.district }})</span>
                </div>
                <span
                  class="inspector-status-badge"
                  :class="selectedBin.status === 'Cleaning' ? 'is-cleaning' : getStatusColorClass(selectedBin.currentFillPct)"
                >
                  {{ selectedBin.status === 'Cleaning' ? 'Cleaning (Обслуживание)' : getStatusText(selectedBin.currentFillPct) }}
                </span>
              </div>

              <!-- Live Level Visualizer -->
              <div class="inspector-level-box">
                <div class="inspector-pct-row">
                  <span class="inspector-pct-big">{{ selectedBin.currentFillPct }}%</span>
                  <span class="inspector-dist-text">Расстояние до мусора: <strong>{{ selectedBin.currentDistCm }} см</strong></span>
                </div>
                <div class="inspector-track">
                  <div
                    class="inspector-fill-bar"
                    :class="getStatusColorClass(selectedBin.currentFillPct)"
                    :style="{ width: `${selectedBin.currentFillPct}%` }"
                  />
                </div>
              </div>

              <!-- Physical Math & Sonar Computation Box -->
              <div class="math-box">
                <div class="math-title">Физический расчёт сонара JSN-SR04T:</div>
                <div class="math-formula">
                  c(T) = 331.3 + 0.606 × (+{{ selectedBin.tempC }}°C) = <strong>{{ (331.3 + 0.606 * selectedBin.tempC).toFixed(2) }} м/с</strong>
                </div>
                <div class="math-formula">
                  FL = [H - (d - d₀)] / H = [{{ selectedBin.depthM }}м - ({{ (selectedBin.currentDistCm/100).toFixed(2) }}м - {{ selectedBin.blindZoneM }}м)] / {{ selectedBin.depthM }}м = <strong>{{ selectedBin.currentFillPct }}%</strong>
                </div>
                <div class="math-pings">
                  Медианная фильтрация 5 импульсов (ESP32): [{{ selectedBin.lastReading.rawPings?.join(', ') }}] см → <strong>{{ selectedBin.currentDistCm }} см</strong>
                </div>
              </div>

              <!-- State Machine Controls -->
              <div class="state-machine-box">
                <div class="sm-title">Машина состояний контейнера (Workflow):</div>
                <div class="sm-status-row">
                  <span>Текущее состояние:</span>
                  <span class="sm-state-tag" :class="selectedBin.status === 'Cleaning' ? 'is-cleaning' : 'is-working'">
                    {{ selectedBin.status }}
                  </span>
                </div>

                <div class="sm-actions">
                  <button
                    type="button"
                    class="sm-btn"
                    :class="selectedBin.status === 'Cleaning' ? 'is-return' : 'is-clean'"
                    @click="toggleContainerStatus(selectedBin.id)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span>{{ selectedBin.status === 'Cleaning' ? 'Завершить вывоз (→ Working)' : 'Начать вывоз (→ Cleaning)' }}</span>
                  </button>

                  <button
                    type="button"
                    class="sm-btn is-pickup"
                    @click="confirmPickup(selectedBin.id)"
                  >
                    <span>Подтвердить факт вывоза (Опустошить)</span>
                  </button>

                  <!-- Dynamic Detour Action -->
                  <button
                    type="button"
                    class="sm-btn is-detour"
                    :class="{
                      'is-auto-route': selectedBin.currentFillPct >= 60,
                      'is-manual-route': isManualDetour(selectedBin.id)
                    }"
                    :title="selectedBin.currentFillPct >= 60 ? 'Контейнер уже включён в маршрут CVRP автоматически (≥ 60%)' : 'Нажмите чтобы добавить или исключить этот бак из маршрута CVRP'"
                    @click="handleToggleDetour(selectedBin.id)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="4 17 10 11 14 15 20 9" />
                      <line x1="20" y1="9" x2="15" y2="9" />
                    </svg>
                    <span v-if="selectedBin.currentFillPct >= 60">
                      В маршруте CVRP (заполнен {{ selectedBin.currentFillPct }}% ≥ 60%) ✓
                    </span>
                    <span v-else-if="isManualDetour(selectedBin.id)">
                      ✓ Заезд запланирован (нажмите для отмены)
                    </span>
                    <span v-else>
                      + Заехать на бак (добавить в маршрут CVRP)
                    </span>
                  </button>
                </div>
              </div>

              <!-- IoT Device Details -->
              <div class="iot-details-grid">
                <div class="iot-cell">
                  <span class="iot-lbl">Node UUID</span>
                  <span class="iot-val">{{ selectedBin.sensor.deviceId.slice(0, 18) }}…</span>
                </div>
                <div class="iot-cell">
                  <span class="iot-lbl">Прошивка</span>
                  <span class="iot-val">{{ selectedBin.sensor.firmware }}</span>
                </div>
                <div class="iot-cell">
                  <span class="iot-lbl">Батарея</span>
                  <span class="iot-val">{{ selectedBin.sensor.batteryV }} В</span>
                </div>
                <div class="iot-cell">
                  <span class="iot-lbl">Связь</span>
                  <span class="iot-val">{{ selectedBin.sensor.modemType }}</span>
                </div>
              </div>

              <!-- Test Telemetry Injection -->
              <div class="test-inject-row">
                <button
                  type="button"
                  class="inject-btn"
                  @click="simulateMqttPing(selectedBin.id, 28.0, 4.5)"
                >
                  ⚡ Симулировать переполнение (FL 97%)
                </button>
                <button
                  type="button"
                  class="inject-btn"
                  @click="simulateMqttPing(selectedBin.id, 120.0, 4.5)"
                >
                  ⚡ Симулировать норму (FL 20%)
                </button>
              </div>
            </div>

            <div v-else class="inspector-placeholder">
              <p>Выберите контейнер на карте Алматы для просмотра физических замеров, формул и управления статусом.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 2: TRUCKBRAIN & CVRP ROUTES ================= -->
      <section v-else-if="activeTab === 'truckbrain'" class="tab-view-container">
        <div class="truckbrain-view">
          <div class="truckbrain-top-card">
            <div class="tb-header">
              <div class="tb-title-group">
                <h2 class="tb-title">Маршруты TruckBrain (Google OR-Tools CVRP Solver — Алматы)</h2>
                <p class="tb-desc">
                  Алгоритм PATH_CHEAPEST_ARC + GUIDED_LOCAL_SEARCH. Ограничения: вместимость 30 контейнеров, смена 8 ч, 2 мин/стоп, коэффициент извилистости улиц Алматы κ = 1.35.
                </p>
              </div>
              <div class="tb-badge-sanpin">
                <span>{{ currentRoute.sanpinRuleApplied }}</span>
              </div>
            </div>

            <div class="route-metrics-bar">
              <div class="rm-item">
                <div class="rm-icon-wrap rm-icon-truck">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div class="rm-text-col">
                  <span class="rm-label">Автомобиль:</span>
                  <span class="rm-val">{{ currentRoute.truck.model }}</span>
                  <span class="rm-code-badge">{{ currentRoute.truck.code }}</span>
                </div>
              </div>

              <div class="rm-item">
                <div class="rm-icon-wrap rm-icon-driver">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div class="rm-text-col">
                  <span class="rm-label">Водитель мусоровоза:</span>
                  <span class="rm-val">{{ currentRoute.truck.assignedDriver }}</span>
                  <span class="rm-sub-tag">ЦУП «Тартып»</span>
                </div>
              </div>

              <div class="rm-item">
                <div class="rm-icon-wrap rm-icon-stops">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div class="rm-text-col">
                  <span class="rm-label">Остановок в рейсе:</span>
                  <span class="rm-val">{{ currentRoute.stops.length }} контейнеров</span>
                  <span class="rm-sub-tag">Приоритет: FL ≥ 60%</span>
                </div>
              </div>

              <div class="rm-item">
                <div class="rm-icon-wrap rm-icon-dist">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a4.5 4.5 0 0 0 0-9H5a3 3 0 0 1 0-6h11" />
                    <circle cx="18" cy="4" r="3" />
                  </svg>
                </div>
                <div class="rm-text-col">
                  <span class="rm-label">Длина трассы CVRP:</span>
                  <span class="rm-val">{{ currentRoute.distanceKm }} км</span>
                  <span class="rm-sub-tag">κ = 1.35 (улицы Алматы)</span>
                </div>
              </div>

              <div class="rm-item">
                <div class="rm-icon-wrap rm-icon-time">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div class="rm-text-col">
                  <span class="rm-label">Расчет времени смены:</span>
                  <span class="rm-val">{{ currentRoute.shiftDurationHours }} ч / 8.0 ч</span>
                  <span class="rm-sub-tag">2 мин/бак + доезд</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Stops Table -->
          <div class="stops-table-card">
            <h3 class="card-section-title">Оптимизированный порядок остановок мусоровоза по Алматы</h3>
            <table class="stops-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Контейнер</th>
                  <th>Адрес</th>
                  <th>Район</th>
                  <th>Заполнение (r + U)</th>
                  <th>Расч. прибытие</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody v-if="currentRoute.stops.length > 0">
                <tr v-for="stop in currentRoute.stops" :key="stop.stopOrder">
                  <td class="order-td">
                    <span class="order-circle">{{ stop.stopOrder }}</span>
                  </td>
                  <td><strong>{{ stop.container.name }}</strong></td>
                  <td>{{ stop.container.address }}</td>
                  <td>{{ stop.container.district }}</td>
                  <td>
                    <div class="fill-cell">
                      <span class="fill-pill" :class="getStatusColorClass(stop.container.currentFillPct)">
                        {{ stop.container.currentFillPct }}%
                      </span>
                      <span class="upper-bound-sub">U₉₀: {{ stop.container.upperBound90Pct }}%</span>
                    </div>
                  </td>
                  <td>{{ stop.estimatedArrival }}</td>
                  <td>
                    <span
                      class="stop-status-pill"
                      :class="stop.completed ? 'is-done' : 'is-pending'"
                    >
                      {{ stop.completed ? 'Вывезено' : 'В плане' }}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="stop-action-btn"
                      @click="confirmPickup(stop.container.id)"
                    >
                      Очистить
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="8" class="empty-route-td">
                    <div class="empty-route-msg">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Все мусорные контейнеры в норме (&lt; 60%). Выезд мусоровоза по маршруту CVRP не требуется.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= TAB 3: DRIVER TABLET UI ================= -->
      <section v-else-if="activeTab === 'driver'" class="tab-view-container">
        <div class="driver-tablet-view">
          <div class="driver-card">
            <!-- Tablet Top Bar -->
            <div class="driver-card-header">
              <div class="driver-header-left">
                <span class="driver-badge">Планшет водителя мусоровоза</span>
                <span class="driver-city-tag">Алматы · Маршрут CVRP №1</span>
              </div>
              <div class="truck-meta-tag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>{{ currentRoute.truck.model }} ({{ currentRoute.truck.code }})</span>
              </div>
            </div>

            <!-- Route Stops Selector (Pills Strip + Dropdown) -->
            <div class="driver-selector-section">
              <div class="selector-top-row">
                <span class="selector-label">Выберите мусорный бак для обслуживания:</span>
                <div class="selector-dropdown-wrap">
                  <select v-model="driverSelectedBinId" class="driver-native-select">
                    <optgroup label="Остановки текущего рейса (OR-Tools)">
                      <option
                        v-for="stop in currentRoute.stops"
                        :key="stop.container.id"
                        :value="stop.container.id"
                      >
                        Остановка №{{ stop.stopOrder }}: {{ stop.container.name }} ({{ stop.container.currentFillPct }}%) {{ stop.completed && stop.container.currentFillPct <= 15 ? '— Вывезено ✓' : '' }}
                      </option>
                    </optgroup>
                    <optgroup label="Все баки Алматы">
                      <option
                        v-for="bin in containers"
                        :key="bin.id"
                        :value="bin.id"
                      >
                        {{ bin.name }} — {{ bin.address }} ({{ bin.currentFillPct }}%)
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <!-- Quick Horizontal Touch Bar for Stops -->
              <div class="stops-scroll-strip">
                <button
                  v-for="stop in currentRoute.stops"
                  :key="stop.container.id"
                  type="button"
                  class="driver-stop-pill"
                  :class="{
                    'is-selected': driverSelectedBinId === stop.container.id,
                    'is-completed': stop.completed && stop.container.currentFillPct <= 15,
                    'is-cleaning': stop.container.status === 'Cleaning'
                  }"
                  @click="driverSelectedBinId = stop.container.id"
                >
                  <span class="pill-order-badge">№{{ stop.stopOrder }}</span>
                  <div class="pill-info-block">
                    <span class="pill-bin-title">{{ stop.container.name }}</span>
                    <span class="pill-fill-val" :class="getStatusColorClass(stop.container.currentFillPct)">
                      {{ (stop.completed && stop.container.currentFillPct <= 15 ? '✓ ' : '') + stop.container.currentFillPct + '%' }}
                    </span>
                  </div>
                  <span v-if="stop.container.status === 'Cleaning'" class="pill-cleaning-tag">Cleaning</span>
                  <span v-else-if="stop.completed && stop.container.currentFillPct <= 15" class="pill-check-icon">✓</span>
                </button>
              </div>
            </div>

            <!-- Active Target Bin Details Card -->
            <div class="target-bin-box">
              <div class="target-header-row">
                <span class="target-sub">
                  {{ driverSelectedStopOrder ? `Остановка №${driverSelectedStopOrder} по плану:` : 'Выбранный контейнер:' }}
                </span>
                <span
                  class="target-status-badge"
                  :class="driverSelectedBin.status === 'Cleaning' ? 'is-cleaning' : 'is-working'"
                >
                  {{ driverSelectedBin.status === 'Cleaning' ? 'Статус: Cleaning (Выгрузка)' : 'Статус: Working (В работе)' }}
                </span>
              </div>

              <h2 class="target-title">{{ driverSelectedBin.name }}</h2>
              <p class="target-address">{{ driverSelectedBin.address }} · {{ driverSelectedBin.district }}</p>

              <!-- Level indicator and progress bar -->
              <div class="target-fill-display">
                <div class="target-pct-row">
                  <div class="target-pct-number" :class="getStatusColorClass(driverSelectedBin.currentFillPct)">
                    {{ driverSelectedBin.currentFillPct }}%
                  </div>
                  <div class="target-dist-data">
                    <span>Расстояние сонара: <strong>{{ driverSelectedBin.currentDistCm }} см</strong></span>
                    <span class="target-temp-data">Температура бака: +{{ driverSelectedBin.tempC }}°C</span>
                  </div>
                </div>

                <div class="target-track-bar">
                  <div
                    class="target-fill-progress"
                    :class="[
                      driverSelectedBin.status === 'Cleaning' ? 'is-cleaning' : getStatusColorClass(driverSelectedBin.currentFillPct),
                      driverSelectedBin.currentFillPct <= 15 ? 'is-cleared' : ''
                    ]"
                    :style="{ width: `${driverSelectedBin.currentFillPct}%` }"
                  />
                </div>
              </div>

              <!-- Success Cleared Banner -->
              <div v-if="driverSelectedBin.currentFillPct <= 15" class="cleared-banner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Бак успешно опустошён (5.0%). Факт вывоза подтверждён и передан на сервер.</span>
              </div>
            </div>

            <!-- Dynamic Buttons (changing based on Working vs Cleaning, matching main screen) -->
            <div class="driver-actions-grid">
              <!-- STATE: WORKING -->
              <template v-if="driverSelectedBin.status === 'Working'">
                <button
                  type="button"
                  class="driver-big-btn is-cleaning-btn"
                  @click="handleDriverToggleStatus"
                >
                  <div class="btn-icon-title-row">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                    </svg>
                    <span>НАЧАТЬ ВЫВОЗ (→ Cleaning)</span>
                  </div>
                  <span class="btn-subtext">Телеметрия сонара временно блокируется на время подъёма крышки</span>
                </button>

                <button
                  type="button"
                  class="driver-big-btn is-working-btn"
                  @click="handleDriverConfirmPickup"
                >
                  <div class="btn-icon-title-row">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                    <span>ПОДТВЕРДИТЬ ФАКТ ВЫВОЗА (ОПУСТОШИТЬ)</span>
                  </div>
                  <span class="btn-subtext">Сброс уровня заполнения до 5%, фиксация события Pickup в MongoDB</span>
                </button>
              </template>

              <!-- STATE: CLEANING -->
              <template v-else>
                <button
                  type="button"
                  class="driver-big-btn is-return-btn"
                  @click="handleDriverToggleStatus"
                >
                  <div class="btn-icon-title-row">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span>ЗАВЕРШИТЬ ВЫВОЗ (→ Working)</span>
                  </div>
                  <span class="btn-subtext">Крышка закрыта, сброс уровня до 5%, возобновление мониторинга сонара</span>
                </button>

                <button
                  type="button"
                  class="driver-big-btn is-working-btn is-primary-action"
                  @click="handleDriverConfirmPickup"
                >
                  <div class="btn-icon-title-row">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                    <span>ПОДТВЕРДИТЬ ФАКТ ВЫВОЗА (ОПУСТОШИТЬ)</span>
                  </div>
                  <span class="btn-subtext">Юридическая фиксация факта Pickup, отметка остановки в путевом листе</span>
                </button>
              </template>
            </div>

            <!-- Next Stop Advance Button if cleared -->
            <div v-if="hasNextPendingStop" class="next-stop-advance-wrap">
              <button
                type="button"
                class="next-stop-btn"
                @click="goToNextStop"
              >
                <span>Перейти к следующему баку маршрута →</span>
              </button>
            </div>

            <!-- Action Notice Toast / Alert -->
            <div v-if="driverNotice" class="driver-toast-notice" :class="`is-${driverNotice.type}`">
              <span>{{ driverNotice.text }}</span>
            </div>

            <!-- Auto-detection info -->
            <div class="auto-detect-card">
              <div class="ad-title">Автоматическая защита от человеческого фактора:</div>
              <p class="ad-text">
                Если водитель забыл нажать кнопку, а бак был опустошен (уровень упал на ≥ 40 п.п. до ≤ 20%), система <strong>OpenKoqis</strong> автоматически зарегистрирует событие <em>«Unmarked Emptying»</em> и уведомит диспетчера.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 4: ALERTS & ANOMALIES ================= -->
      <section v-else-if="activeTab === 'alerts'" class="tab-view-container">
        <div class="alerts-view">
          <div class="alerts-header-row">
            <div>
              <h2 class="alerts-title">Центр алертов и аномалий системы OpenKoqis (Алматы)</h2>
              <p class="alerts-subtitle">Динамический мониторинг переполнений, зависаний и событий вывоза</p>
            </div>
            <div class="alerts-counter-pill" :class="alerts.length === 0 ? 'is-all-clear' : 'has-alerts'">
              {{ alerts.length === 0 ? '✓ Все 12 контейнеров в норме' : `Активных алертов: ${alerts.length}` }}
            </div>
          </div>

          <!-- Empty State when 0 alerts (All bins are clean) -->
          <div v-if="alerts.length === 0" class="alerts-empty-state">
            <div class="empty-icon-circle">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 class="empty-title">Все мусорные контейнеры в норме</h3>
            <p class="empty-desc">
              Активных переполнений, зависаний в статусе Cleaning или сбоев датчиков не зафиксировано. Все контейнеры опустошены либо их заполнение ниже 85%.
            </p>
            <div class="empty-actions">
              <button
                type="button"
                class="empty-sim-btn"
                @click="activeTab = 'map'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                <span>Перейти к карте Алматы</span>
              </button>
            </div>
          </div>

          <!-- Alert Cards List -->
          <div v-else class="alerts-list">
            <div
              v-for="alert in alerts"
              :key="alert.id"
              class="alert-card"
              :class="`is-${alert.severity}`"
            >
              <div class="alert-icon-wrap">
                <svg v-if="alert.severity === 'critical'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C93A2B" stroke-width="2">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <svg v-else-if="alert.severity === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F2A93B" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              <div class="alert-content">
                <div class="alert-top-row">
                  <span class="alert-name">{{ alert.title }}</span>
                  <span class="alert-ts">{{ alert.ts.slice(11, 19) || alert.ts }}</span>
                </div>
                <p class="alert-body">{{ alert.message }}</p>
                <div class="alert-footer">
                  <span class="alert-bin-tag">{{ alert.containerName }} ({{ alert.address }})</span>
                  <div class="alert-btns-group">
                    <button
                      type="button"
                      class="alert-clean-btn"
                      title="Опустошить контейнер и снять алерт"
                      @click="confirmPickup(alert.containerId)"
                    >
                      ✓ Очистить бак (Снять алерт)
                    </button>
                    <button
                      type="button"
                      class="alert-ack-btn"
                      title="Квитировать и удалить алерт"
                      @click="dismissAlert(alert.id)"
                    >
                      Квитировать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 5: MQTT TELEMETRY STREAM ================= -->
      <section v-else-if="activeTab === 'telemetry'" class="tab-view-container">
        <div class="telemetry-view">
          <div class="telemetry-top">
            <div>
              <h2 class="telemetry-title">MQTT Телеметрия (Брокер Mosquitto TLS :8883)</h2>
              <p class="telemetry-topic">Топик: <code>almaty/waste/bins/{id}/telemetry</code> · QoS 1</p>
            </div>
            <button
              type="button"
              class="action-btn-primary"
              @click="injectRandomTelemetry"
            >
              Сгенерировать пакет ESP32
            </button>
          </div>

          <div class="telemetry-console">
            <div class="console-header">
              <span>Время (UTC)</span>
              <span>Контейнер / Топик</span>
              <span>Расстояние (см)</span>
              <span>Заполнение (%)</span>
              <span>Температура (°C)</span>
              <span>Батарея</span>
              <span>Hampel Filter</span>
            </div>
            <div class="console-body">
              <div
                v-for="bin in containers"
                :key="bin.id"
                class="console-row"
              >
                <span class="console-time">{{ bin.lastReading.ts.slice(11, 19) }}</span>
                <span class="console-bin"><code>almaty/waste/bins/{{ bin.name }}</code></span>
                <span class="console-val">{{ bin.currentDistCm }} см</span>
                <span class="console-val" :class="getStatusColorClass(bin.currentFillPct)">{{ bin.currentFillPct }}%</span>
                <span class="console-val">+{{ bin.tempC }} °C</span>
                <span class="console-val">{{ bin.sensor.batteryV }} В</span>
                <span class="console-hampel is-accepted">✓ Принято (Clean)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 6: ML FORECASTING ================= -->
      <section v-else-if="activeTab === 'ml'" class="tab-view-container">
        <div class="ml-view">
          <div class="ml-header-card">
            <h2 class="ml-title">Модель прогнозирования суточного прироста (Ridge-регрессия — Алматы)</h2>
            <p class="ml-desc">
              Экспериментальные параметры: $MAE = 6.00$ п.п., $R^2 = 0.78$. Взаимодействие признаков: $type \times weekday$.
              Верхняя 90%-ная доверительная граница: $U_{i,d} = \hat{A}_{i,d} + 11.9$ п.п.
            </p>
          </div>

          <div class="ml-grid">
            <div class="ml-card">
              <h3 class="card-section-title">Входные признаки модели (Feature Matrix)</h3>
              <ul class="ml-features-list">
                <li>Лаги суточного прироста: 1, 2, 3, 7, 14 дней</li>
                <li>Скользящие средние (Rolling Means): 7 дней и 28 дней</li>
                <li>Стандартное отклонение прироста: 7 дней (волатильность)</li>
                <li>Среднее значение за тот же день недели за 2 недели</li>
                <li>Циклическое синус-косинус кодирование дня недели</li>
                <li>Флаги государственных праздников и выходных дней РК</li>
                <li>Тип контейнера (residential, commercial, public)</li>
              </ul>
            </div>

            <div class="ml-card">
              <h3 class="card-section-title">Интеграция с OR-Tools CVRP</h3>
              <p class="ml-p">
                Условие включения бака в утренний маршрут (07:00):
              </p>
              <div class="ml-formula-badge">
                r_{i,d} + U_{i,d} ≥ τ (где τ = 75%)
              </div>
              <p class="ml-p">
                Применение границы $U_{i,d}$ исключает переполнение контейнеров даже при всплесках накопления, а жесткое требование СанПиН РК гарантирует регулярность обслуживания спальных районов и окраин Алматы.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, type UserRole } from '~/composables/useAuth'
import { useWasteStore } from '~/composables/useWasteStore'
import type { Container } from '~/types/waste'

const router = useRouter()
const { currentUser, logout, switchRole } = useAuth()
const wasteStore = useWasteStore()

const isDark = ref(true)

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem('openkoqis_theme')
    if (saved) {
      isDark.value = saved === 'dark'
    }
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (import.meta.client) {
    localStorage.setItem('openkoqis_theme', isDark.value ? 'dark' : 'light')
  }
}

const {
  containers,
  trucks,
  alerts,
  totalContainers,
  criticalCount,
  warningCount,
  normalCount,
  cleaningCount,
  currentTemp,
  toggleContainerStatus,
  confirmPickup,
  dismissAlert,
  manualDetourBinIds,
  isManualDetour,
  toggleManualDetour,
  getOptimizedRoute,
  simulateMqttPing
} = wasteStore

const activeTab = ref<'map' | 'truckbrain' | 'driver' | 'alerts' | 'telemetry' | 'ml'>('map')
const selectedBin = ref<Container | null>(containers.value[0])
const driverSelectedBinId = ref<string>('alm-bin-102')

const driverSelectedBin = computed<Container>(() => {
  return containers.value.find(c => c.id === driverSelectedBinId.value) || containers.value[0]
})

const driverSelectedStopOrder = computed<number | null>(() => {
  const stop = currentRoute.value.stops.find(s => s.container.id === driverSelectedBin.value.id)
  return stop ? stop.stopOrder : null
})

const driverNotice = ref<{ text: string; type: 'success' | 'info' } | null>(null)
let driverNoticeTimer: ReturnType<typeof setTimeout> | null = null

const setDriverNotice = (text: string, type: 'success' | 'info' = 'success') => {
  if (driverNoticeTimer) clearTimeout(driverNoticeTimer)
  driverNotice.value = { text, type }
  driverNoticeTimer = setTimeout(() => {
    driverNotice.value = null
  }, 4500)
}

const handleDriverToggleStatus = () => {
  const bin = driverSelectedBin.value
  const wasWorking = bin.status === 'Working'
  toggleContainerStatus(bin.id)
  if (wasWorking) {
    setDriverNotice(`Статус изменён: ${bin.name} переведён в Cleaning (выгрузка начата). Входящая телеметрия сонара временно заблокирована на время открытой крышки.`, 'info')
  } else {
    setDriverNotice(`Выгрузка завершена! ${bin.name} возвращён в Working, заполнение сброшено до 5.0%, вывоз подтверждён.`, 'success')
  }
}

const handleDriverConfirmPickup = () => {
  const bin = driverSelectedBin.value
  confirmPickup(bin.id)
  setDriverNotice(`Факт вывоза зафиксирован! Заполнение ${bin.name} снижено до 5.0% (${bin.currentDistCm} см). Остановка отмечена в путевом листе.`, 'success')
}

const handleToggleDetour = (containerId: string) => {
  const bin = containers.value.find(c => c.id === containerId)
  if (!bin) return
  if (bin.currentFillPct >= 60) {
    setDriverNotice(`Контейнер ${bin.name} уже включён в маршрут CVRP автоматически (заполнение ${bin.currentFillPct}% ≥ 60%).`, 'info')
    return
  }
  toggleManualDetour(containerId)
  if (isManualDetour(containerId)) {
    setDriverNotice(`Спец. заезд на ${bin.name} добавлен в маршрут CVRP! Трасса перестроена от Депо «Тартып».`, 'success')
  } else {
    setDriverNotice(`Заезд на ${bin.name} исключён из маршрута CVRP. Трасса пересчитана.`, 'info')
  }
}

const hasNextPendingStop = computed(() => {
  return currentRoute.value.stops.some(s => !s.completed && s.container.currentFillPct > 15 && s.container.id !== driverSelectedBin.value.id)
})

const goToNextStop = () => {
  const next = currentRoute.value.stops.find(s => !s.completed && s.container.currentFillPct > 15 && s.container.id !== driverSelectedBin.value.id)
  if (next) {
    driverSelectedBinId.value = next.container.id
  }
}

const userInitials = computed(() => {
  if (!currentUser.value?.name) return 'OK'
  return currentUser.value.name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

const currentRoute = computed(() => getOptimizedRoute())

const selectBin = (bin: Container) => {
  selectedBin.value = bin
}

const onRoleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  switchRole(target.value as UserRole)
}

const handleLogout = () => {
  logout()
  router.push('/login')
}

const getStatusColorClass = (fillPct: number) => {
  if (fillPct >= 85) return 'is-critical'
  if (fillPct >= 60) return 'is-warning'
  return 'is-normal'
}

const getStatusText = (fillPct: number) => {
  if (fillPct >= 85) return 'Пора вывозить'
  if (fillPct >= 60) return 'Скоро заполнится'
  return 'Норма'
}

const injectRandomTelemetry = () => {
  const randomBin = containers.value[Math.floor(Math.random() * containers.value.length)]
  const randomDist = Math.round(30 + Math.random() * 100)
  simulateMqttPing(randomBin.id, randomDist, 4.5)
}
</script>

<style scoped>
.dashboard-root {
  min-height: 100vh;
  background: #050605;
  color: #F2F5F1;
  font-family: var(--font-sans);
  display: flex;
  flex-direction: column;
}

/* Header */
.dash-header {
  height: 64px;
  background: rgba(14, 17, 15, 0.95);
  border-bottom: 1px solid #1F2521;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.system-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(76, 209, 55, 0.1);
  border: 1px solid #243026;
  font-size: 12px;
  color: #7FE06C;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4CD137;
  animation: okBlink 1.5s ease-in-out infinite;
}

.sanpin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #1F2521;
  font-size: 12px;
  color: #C3CBC4;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #2F3631;
  background: rgba(255, 255, 255, 0.05);
  color: #F2F5F1;
  font-size: 13px;
  font-family: var(--font-sans);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-toggle-btn:hover {
  border-color: #4CD137;
  color: #4CD137;
}
.theme-btn-text {
  font-size: 12px;
  font-weight: 500;
}

.mockup-nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-nav-link {
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  color: #A9B2AA;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #1F2521;
  transition: all 0.15s ease;
}
.header-nav-link:hover {
  color: #4CD137;
  border-color: #4CD137;
}

.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1B2A1C;
  color: #7FE06C;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.user-meta {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #F2F5F1;
}
.user-role-label {
  font-size: 11px;
  color: #A9B2AA;
}

.role-select {
  padding: 6px 10px;
  border-radius: 8px;
  background: #0B0D0C;
  border: 1px solid #2F3631;
  color: #F2F5F1;
  font: 500 12px var(--font-sans);
  cursor: pointer;
}

.logout-btn {
  background: transparent;
  border: none;
  color: #A9B2AA;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: color 0.15s ease;
}
.logout-btn:hover {
  color: #C93A2B;
}

/* Dashboard Body */
.dash-body {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* KPI Bar */
.kpi-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}

.kpi-card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(14, 17, 15, 0.8);
  border: 1px solid #1F2521;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.15s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
}

.kpi-card.is-critical {
  border-color: rgba(201, 58, 43, 0.4);
}
.kpi-card.is-warning {
  border-color: rgba(242, 169, 59, 0.4);
}
.kpi-card.is-normal {
  border-color: rgba(76, 209, 55, 0.4);
}
.kpi-card.is-cleaning {
  border-color: rgba(155, 89, 182, 0.4);
}
.kpi-card.is-alert {
  cursor: pointer;
  border-color: #C93A2B;
  background: rgba(201, 58, 43, 0.08);
}

.kpi-caption {
  font-size: 13px;
  color: #A9B2AA;
}
.kpi-val {
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 26px;
  font-weight: 600;
  color: #F2F5F1;
}
.kpi-sub {
  font-size: 12px;
  color: #6F7A70;
}
.text-alert {
  color: #C93A2B;
}

/* Tabs Bar */
.tabs-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  border-bottom: 1px solid #1F2521;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #A9B2AA;
  font: 500 14px var(--font-sans);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.tab-item:hover {
  color: #F2F5F1;
  background: rgba(255, 255, 255, 0.04);
}
.tab-item.is-active {
  background: #1B2A1C;
  color: #4CD137;
  font-weight: 600;
}

/* Tab View Container */
.tab-view-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Layout for Map */
.map-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 20px;
  min-height: 560px;
}

@media (max-width: 1080px) {
  .map-layout {
    grid-template-columns: 1fr;
  }
}

.map-visual-pane {
  background: #080A09;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 540px;
}

.map-loading-fallback {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A9B2AA;
  font-size: 14px;
}

/* Inspector Pane */
.map-inspector-pane {
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.inspector-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inspector-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.inspector-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.inspector-addr {
  font-size: 13px;
  color: #A9B2AA;
}

.inspector-status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.inspector-status-badge.is-critical {
  background: rgba(201, 58, 43, 0.2);
  color: #FF7675;
}
.inspector-status-badge.is-warning {
  background: rgba(242, 169, 59, 0.2);
  color: #F2A93B;
}
.inspector-status-badge.is-normal {
  background: rgba(76, 209, 55, 0.15);
  color: #7FE06C;
}
.inspector-status-badge.is-cleaning {
  background: rgba(155, 89, 182, 0.2);
  color: #D2B4DE;
}

.inspector-level-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inspector-pct-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.inspector-pct-big {
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 32px;
  font-weight: 700;
}

.inspector-dist-text {
  font-size: 13px;
  color: #C3CBC4;
}

.inspector-track {
  height: 8px;
  border-radius: 4px;
  background: #1C211D;
  overflow: hidden;
}

.inspector-fill-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
.inspector-fill-bar.is-critical {
  background: #C93A2B;
}
.inspector-fill-bar.is-warning {
  background: #F2A93B;
}
.inspector-fill-bar.is-normal {
  background: #4CD137;
}

/* Math Box */
.math-box {
  padding: 14px;
  border-radius: 12px;
  background: #0A0D0B;
  border: 1px solid #1F2521;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.math-title {
  font-weight: 600;
  color: #4CD137;
}
.math-formula {
  color: #C3CBC4;
  font-family: monospace;
}
.math-pings {
  color: #8F998F;
}

/* State Machine Box */
.state-machine-box {
  padding: 14px;
  border-radius: 12px;
  background: #0B0E0C;
  border: 1px solid #2F3631;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sm-title {
  font-size: 13px;
  font-weight: 600;
}

.sm-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.sm-state-tag {
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
}
.sm-state-tag.is-working {
  background: #1B2A1C;
  color: #4CD137;
}
.sm-state-tag.is-cleaning {
  background: rgba(155, 89, 182, 0.25);
  color: #D2B4DE;
}

.sm-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sm-btn {
  height: 40px;
  border-radius: 10px;
  border: 1px solid;
  cursor: pointer;
  font: 600 13px var(--font-sans);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;
}
.sm-btn.is-clean {
  background: #241D2B;
  border-color: #9B59B6;
  color: #D2B4DE;
}
.sm-btn.is-return {
  background: #1B2A1C;
  border-color: #4CD137;
  color: #4CD137;
}
.sm-btn.is-pickup {
  background: transparent;
  border-color: #2F3631;
  color: #C3CBC4;
}
.sm-btn.is-pickup:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #F2F5F1;
}

.sm-btn.is-detour {
  background: rgba(84, 160, 255, 0.1);
  border-color: #2980B9;
  color: #70A1FF;
}
.sm-btn.is-detour:hover {
  background: rgba(84, 160, 255, 0.2);
  border-color: #54A0FF;
  color: #FFFFFF;
}
.sm-btn.is-detour.is-manual-route {
  background: #103355;
  border-color: #54A0FF;
  color: #FFFFFF;
  box-shadow: 0 0 10px rgba(84, 160, 255, 0.3);
}
.sm-btn.is-detour.is-auto-route {
  background: rgba(76, 209, 55, 0.12);
  border-color: #4CD137;
  color: #7FE06C;
  cursor: default;
}

.empty-route-td {
  padding: 36px 16px !important;
  text-align: center;
}
.empty-route-msg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #7FE06C;
}

/* IoT Details Grid */
.iot-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.iot-cell {
  padding: 8px 10px;
  border-radius: 8px;
  background: #080A09;
  border: 1px solid #1F2521;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.iot-lbl {
  font-size: 11px;
  color: #6F7A70;
}
.iot-val {
  font-size: 12px;
  font-weight: 500;
  color: #F2F5F1;
}

.test-inject-row {
  display: flex;
  gap: 8px;
}
.inject-btn {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px dashed #2F3631;
  background: transparent;
  color: #A9B2AA;
  font-size: 11px;
  cursor: pointer;
}
.inject-btn:hover {
  border-color: #4CD137;
  color: #4CD137;
}

/* TruckBrain View */
.truckbrain-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.truckbrain-top-card {
  padding: 24px;
  border-radius: 16px;
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tb-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.tb-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 22px;
  font-weight: 600;
}
.tb-desc {
  margin: 4px 0 0;
  font-size: 14px;
  color: #C3CBC4;
  max-width: 700px;
}

.tb-badge-sanpin {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(76, 209, 55, 0.1);
  border: 1px solid #243026;
  font-size: 13px;
  color: #7FE06C;
  font-weight: 500;
}

.route-metrics-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  padding-top: 16px;
  border-top: 1px solid #1F2521;
}

.rm-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #1F2521;
  transition: all 0.2s ease;
}
.rm-item:hover {
  border-color: #2F3D32;
  background: rgba(255, 255, 255, 0.05);
}

.rm-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.rm-icon-truck { color: #4CD137; background: rgba(76, 209, 55, 0.12); }
.rm-icon-driver { color: #54A0FF; background: rgba(84, 160, 255, 0.12); }
.rm-icon-stops { color: #FECA57; background: rgba(254, 202, 87, 0.12); }
.rm-icon-dist { color: #1DD1A1; background: rgba(29, 209, 161, 0.12); }
.rm-icon-time { color: #FF9FF3; background: rgba(255, 159, 243, 0.12); }

.rm-text-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.rm-label {
  font-size: 11px;
  font-weight: 500;
  color: #8C968D;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.rm-val {
  font-size: 14px;
  font-weight: 600;
  color: #F2F5F1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rm-code-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 10px;
  font-family: monospace;
  font-weight: 600;
  color: #7FE06C;
  background: rgba(76, 209, 55, 0.12);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(76, 209, 55, 0.25);
  margin-top: 2px;
}
.rm-sub-tag {
  font-size: 11px;
  color: #6F7A70;
}

.stops-table-card {
  padding: 24px;
  border-radius: 16px;
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
  overflow-x: auto;
}

.card-section-title {
  margin: 0 0 16px;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.stops-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
}

.stops-table th {
  padding: 12px 14px;
  color: #A9B2AA;
  font-weight: 500;
  border-bottom: 1px solid #1F2521;
}

.stops-table td {
  padding: 14px;
  border-bottom: 1px solid #161A17;
}

.order-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1B2A1C;
  color: #4CD137;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.fill-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.fill-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12px;
}
.fill-pill.is-critical {
  background: rgba(201, 58, 43, 0.2);
  color: #FF7675;
}
.fill-pill.is-warning {
  background: rgba(242, 169, 59, 0.2);
  color: #F2A93B;
}
.fill-pill.is-normal {
  background: rgba(76, 209, 55, 0.15);
  color: #7FE06C;
}

.upper-bound-sub {
  font-size: 11px;
  color: #6F7A70;
}

.stop-status-pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}
.stop-status-pill.is-done {
  background: rgba(76, 209, 55, 0.15);
  color: #7FE06C;
}
.stop-status-pill.is-pending {
  background: rgba(255, 255, 255, 0.05);
  color: #C3CBC4;
}

.stop-action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #2F3631;
  background: transparent;
  color: #C3CBC4;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s ease;
}
.stop-action-btn:hover {
  background: #4CD137;
  color: #08130A;
  border-color: #4CD137;
}

/* Driver Tablet View */
.driver-tablet-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.driver-card {
  width: 100%;
  max-width: 720px;
  padding: 32px;
  border-radius: 20px;
  background: rgba(14, 17, 15, 0.94);
  border: 1px solid #1F2521;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
}

.driver-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.driver-header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.driver-badge {
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #4CD137;
}

.driver-city-tag {
  font-size: 12px;
  color: #7FE06C;
  opacity: 0.8;
}

.truck-meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #1B2A1C;
  border: 1px solid #2F4030;
  font-size: 12px;
  font-weight: 500;
  color: #F2F5F1;
}

/* Stops Selector */
.driver-selector-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 14px;
  background: #0B0E0C;
  border: 1px solid #1C231E;
}

.selector-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.selector-label {
  font-size: 13px;
  font-weight: 600;
  color: #C3CBC4;
}

.driver-native-select {
  padding: 6px 12px;
  border-radius: 8px;
  background: #141A16;
  border: 1px solid #2F3631;
  color: #F2F5F1;
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  outline: none;
  max-width: 320px;
}
.driver-native-select:focus {
  border-color: #4CD137;
}

/* Horizontal scrollable pills strip */
.stops-scroll-strip {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.stops-scroll-strip::-webkit-scrollbar {
  height: 4px;
}
.stops-scroll-strip::-webkit-scrollbar-thumb {
  background: #2F3631;
  border-radius: 2px;
}

.driver-stop-pill {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #242D26;
  background: #101512;
  color: #A9B2AA;
  cursor: pointer;
  transition: all 0.15s ease;
}
.driver-stop-pill:hover {
  border-color: #3E4B41;
  color: #F2F5F1;
}
.driver-stop-pill.is-selected {
  background: rgba(76, 209, 55, 0.12);
  border-color: #4CD137;
  color: #F2F5F1;
  box-shadow: 0 0 12px rgba(76, 209, 55, 0.2);
}
.driver-stop-pill.is-completed {
  border-color: #2F7A22;
  background: rgba(76, 209, 55, 0.08);
}
.driver-stop-pill.is-cleaning {
  border-color: #9B59B6;
  background: rgba(155, 89, 182, 0.15);
}

.pill-order-badge {
  font-size: 11px;
  font-weight: 700;
  color: #7FE06C;
}
.pill-info-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.pill-bin-title {
  font-size: 12px;
  font-weight: 600;
  color: #F2F5F1;
}
.pill-fill-val {
  font-size: 11px;
  font-weight: 700;
}
.pill-fill-val.is-critical { color: #FF7675; }
.pill-fill-val.is-warning { color: #F2A93B; }
.pill-fill-val.is-normal { color: #7FE06C; }

.pill-check-icon {
  font-size: 13px;
  color: #4CD137;
  font-weight: 700;
}
.pill-cleaning-tag {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
  background: #9B59B6;
  color: #FFFFFF;
}

/* Target Bin Box */
.target-bin-box {
  padding: 24px;
  border-radius: 16px;
  background: #080A09;
  border: 1px solid #232B25;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.target-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.target-sub {
  font-size: 13px;
  color: #8F998F;
}

.target-status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.target-status-badge.is-working {
  background: rgba(76, 209, 55, 0.15);
  color: #7FE06C;
  border: 1px solid #2F7A22;
}
.target-status-badge.is-cleaning {
  background: rgba(155, 89, 182, 0.25);
  color: #D2B4DE;
  border: 1px solid #9B59B6;
}

.target-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 24px;
}
.target-address {
  margin: 0;
  font-size: 14px;
  color: #A9B2AA;
}

.target-fill-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.target-pct-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.target-pct-number {
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 1;
}
.target-pct-number.is-critical { color: #FF7675; }
.target-pct-number.is-warning { color: #F2A93B; }
.target-pct-number.is-normal { color: #4CD137; }

.target-dist-data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  color: #A9B2AA;
}
.target-temp-data {
  font-size: 11px;
  color: #6F7A70;
}

.target-track-bar {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: #161C18;
  overflow: hidden;
}

.target-fill-progress {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease, background-color 0.4s ease;
}
.target-fill-progress.is-critical { background: #C93A2B; }
.target-fill-progress.is-warning { background: #F2A93B; }
.target-fill-progress.is-normal { background: #4CD137; }
.target-fill-progress.is-cleaning { background: #9B59B6; }
.target-fill-progress.is-cleared { background: #4CD137; box-shadow: 0 0 10px #4CD137; }

.cleared-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(76, 209, 55, 0.12);
  border: 1px solid #2F7A22;
  font-size: 13px;
  font-weight: 500;
  color: #7FE06C;
}

/* Big Action Buttons */
.driver-actions-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.driver-big-btn {
  min-height: 76px;
  padding: 14px 20px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font: 700 16px var(--font-sans);
  transition: transform 0.15s ease, filter 0.15s ease;
}
.driver-big-btn:hover {
  transform: translateY(-2px);
}

.btn-icon-title-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.is-cleaning-btn {
  background: #9B59B6;
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(155, 89, 182, 0.35);
}
.is-cleaning-btn:hover {
  background: #8E44AD;
}

.is-return-btn {
  background: #1B2A1C;
  border: 1.5px solid #4CD137;
  color: #4CD137;
}
.is-return-btn:hover {
  background: #243B26;
}

.is-working-btn {
  background: #4CD137;
  color: #08130A;
  box-shadow: 0 4px 14px rgba(76, 209, 55, 0.3);
}
.is-working-btn:hover {
  background: #3DB82A;
}

.is-primary-action {
  box-shadow: 0 0 20px rgba(76, 209, 55, 0.5);
  animation: okPop 0.3s ease;
}

.btn-subtext {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
}

/* Next Stop advance button */
.next-stop-advance-wrap {
  display: flex;
  justify-content: center;
}
.next-stop-btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px dashed #4CD137;
  background: rgba(76, 209, 55, 0.08);
  color: #7FE06C;
  font: 600 14px var(--font-sans);
  cursor: pointer;
  transition: all 0.15s ease;
}
.next-stop-btn:hover {
  background: rgba(76, 209, 55, 0.2);
  color: #F2F5F1;
}

/* Toast Notice */
.driver-toast-notice {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  animation: okFade 0.25s ease;
}
.driver-toast-notice.is-success {
  background: #1B2A1C;
  border: 1px solid #4CD137;
  color: #7FE06C;
}
.driver-toast-notice.is-info {
  background: #231C2A;
  border: 1px solid #9B59B6;
  color: #D2B4DE;
}

.auto-detect-card {
  padding: 14px;
  border-radius: 12px;
  background: rgba(76, 209, 55, 0.06);
  border: 1px solid #243026;
  font-size: 13px;
  color: #C3CBC4;
}

.ad-title {
  font-weight: 600;
  color: #7FE06C;
  margin-bottom: 4px;
}
.ad-text {
  margin: 0;
  line-height: 1.5;
}

/* Alerts View */
.alerts-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alerts-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.alerts-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 600;
}

.alerts-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #8F998F;
}

.alerts-counter-pill {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}
.alerts-counter-pill.is-all-clear {
  background: rgba(76, 209, 55, 0.15);
  border: 1px solid #2F7A22;
  color: #7FE06C;
}
.alerts-counter-pill.has-alerts {
  background: rgba(201, 58, 43, 0.2);
  border: 1px solid rgba(201, 58, 43, 0.6);
  color: #FF7675;
}

/* Empty State */
.alerts-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  border-radius: 16px;
  background: rgba(14, 17, 15, 0.6);
  border: 1px dashed #2F3631;
  gap: 16px;
  max-width: 640px;
  margin: 20px auto;
}

.empty-icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(76, 209, 55, 0.1);
  border: 2px solid #4CD137;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(76, 209, 55, 0.2);
}

.empty-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #F2F5F1;
}

.empty-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #A9B2AA;
  max-width: 480px;
}

.empty-actions {
  margin-top: 8px;
}

.empty-sim-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  background: #1B2A1C;
  border: 1px solid #4CD137;
  color: #4CD137;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.empty-sim-btn svg {
  flex-shrink: 0;
}
.empty-sim-btn:hover {
  background: #4CD137;
  color: #08130A;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 14px;
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
}

.alert-card.is-critical {
  border-color: rgba(201, 58, 43, 0.5);
  background: rgba(201, 58, 43, 0.06);
}
.alert-card.is-warning {
  border-color: rgba(242, 169, 59, 0.5);
  background: rgba(242, 169, 59, 0.06);
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alert-top-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.alert-name {
  font-size: 16px;
  font-weight: 600;
  color: #F2F5F1;
}

.alert-ts {
  font-size: 12px;
  color: #6F7A70;
}

.alert-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #C3CBC4;
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.alert-bin-tag {
  font-size: 13px;
  color: #7FE06C;
}

.alert-btns-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-clean-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #4CD137;
  background: rgba(76, 209, 55, 0.12);
  color: #7FE06C;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.alert-clean-btn:hover {
  background: #4CD137;
  color: #08130A;
}

.alert-ack-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #2F3631;
  background: transparent;
  color: #C3CBC4;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.alert-ack-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #F2F5F1;
}

/* Telemetry View */
.telemetry-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.telemetry-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.telemetry-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 20px;
}
.telemetry-topic {
  margin: 4px 0 0;
  font-size: 13px;
  color: #A9B2AA;
}

.telemetry-console {
  border-radius: 14px;
  background: #080A09;
  border: 1px solid #1F2521;
  overflow: hidden;
  font-family: monospace;
}

.console-header {
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 120px 100px 140px;
  padding: 12px 16px;
  background: #0E110F;
  border-bottom: 1px solid #1F2521;
  font-size: 12px;
  font-weight: 600;
  color: #A9B2AA;
}

.console-body {
  max-height: 480px;
  overflow-y: auto;
}

.console-row {
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 120px 100px 140px;
  padding: 10px 16px;
  border-bottom: 1px solid #121614;
  font-size: 12px;
  align-items: center;
}

.console-time {
  color: #6F7A70;
}
.console-bin code {
  color: #7FE06C;
}
.console-val {
  color: #C3CBC4;
}
.console-hampel.is-accepted {
  color: #4CD137;
}

/* ML View */
.ml-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ml-header-card {
  padding: 24px;
  border-radius: 16px;
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
}

.ml-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-size: 20px;
}
.ml-desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: #C3CBC4;
  line-height: 1.6;
}

.ml-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.ml-card {
  padding: 24px;
  border-radius: 16px;
  background: rgba(14, 17, 15, 0.85);
  border: 1px solid #1F2521;
}

.ml-features-list {
  margin: 0;
  padding-left: 20px;
  color: #C3CBC4;
  font-size: 14px;
  line-height: 1.8;
}

.ml-p {
  font-size: 14px;
  line-height: 1.6;
  color: #C3CBC4;
}

.ml-formula-badge {
  padding: 12px 16px;
  border-radius: 10px;
  background: #0B0D0C;
  border: 1px solid #4CD137;
  font-family: monospace;
  font-size: 16px;
  color: #4CD137;
  margin: 12px 0;
}

/* ================= LIGHT THEME (THEME-MONITORING) ================= */
.dashboard-root.theme-monitoring {
  background: #F4F6F2;
  color: #0E1410;
}

/* Header Light */
.theme-monitoring .dash-header {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #E0E5DE;
  box-shadow: 0 1px 3px rgba(14, 20, 16, 0.05);
}
.theme-monitoring .system-badge {
  background: #EEF7EC;
  border-color: #CDE8CA;
  color: #2F7A22;
}
.theme-monitoring .sanpin-badge {
  background: #F4F6F2;
  border-color: #E0E5DE;
  color: #3E4840;
}
.theme-monitoring .theme-toggle-btn {
  background: #FFFFFF;
  border-color: #DCE2DA;
  color: #3E4840;
}
.theme-monitoring .theme-toggle-btn:hover {
  background: #EEF1EC;
  color: #2F7A22;
  border-color: #2F7A22;
}
.theme-monitoring .header-nav-link {
  background: #FFFFFF;
  border-color: #DCE2DA;
  color: #4E5950;
}
.theme-monitoring .header-nav-link:hover {
  background: #EEF1EC;
  color: #2F7A22;
  border-color: #2F7A22;
}
.theme-monitoring .user-profile-menu {
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
  padding: 4px 10px;
  border-radius: 10px;
}
.theme-monitoring .user-avatar {
  background: #EEF7EC;
  color: #2F7A22;
}
.theme-monitoring .user-name {
  color: #0E1410;
}
.theme-monitoring .user-role-label {
  color: #6F7A70;
}
.theme-monitoring .role-select {
  background: #F4F6F2;
  border-color: #DCE2DA;
  color: #0E1410;
}
.theme-monitoring .logout-btn {
  background: #F4F6F2;
  border-color: #DCE2DA;
  color: #4E5950;
}

/* KPI Bar Light */
.theme-monitoring .kpi-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 3px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .kpi-caption {
  color: #6F7A70;
}
.theme-monitoring .kpi-val {
  color: #0E1410;
}
.theme-monitoring .kpi-sub {
  color: #8F998F;
}
.theme-monitoring .kpi-card.is-critical {
  background: #FFF5F4;
  border-color: #F8C6C2;
}
.theme-monitoring .kpi-card.is-warning {
  background: #FFFAF0;
  border-color: #FDE2B5;
}
.theme-monitoring .kpi-card.is-normal {
  background: #F6FCF5;
  border-color: #CDE8CA;
}
.theme-monitoring .kpi-card.is-cleaning {
  background: #FAF5FC;
  border-color: #E6D0F2;
}
.theme-monitoring .kpi-card.is-alert {
  background: #FFF4F2;
  border-color: #F9C5C0;
}

/* Tabs Bar Light */
.theme-monitoring .tabs-bar {
  background: #FFFFFF;
  border-bottom: 1px solid #E0E5DE;
  box-shadow: 0 1px 3px rgba(14, 20, 16, 0.03);
}
.theme-monitoring .tab-item {
  color: #4E5950;
}
.theme-monitoring .tab-item:hover {
  color: #0E1410;
  background: #F4F6F2;
}
.theme-monitoring .tab-item.is-active {
  background: #EEF7EC;
  color: #2F7A22;
  border-bottom: 2px solid #2F7A22;
}

/* Map Inspector Light */
.theme-monitoring .map-visual-pane {
  background: #FFFFFF;
  border-color: #E0E5DE;
}
.theme-monitoring .map-loading-fallback {
  color: #4E5950;
  background: #F4F6F2;
}
.theme-monitoring .map-inspector-pane {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.05);
}
.theme-monitoring .inspector-title {
  color: #0E1410;
}
.theme-monitoring .inspector-addr {
  color: #4E5950;
}
.theme-monitoring .inspector-level-box {
  background: #F8FAF7;
  border-color: #E0E5DE;
}
.theme-monitoring .inspector-track {
  background: #E4EAE2;
}
.theme-monitoring .math-box {
  background: #F4F6F2;
  border-color: #E0E5DE;
  color: #2E3830;
}
.theme-monitoring .math-title {
  color: #2F7A22;
}
.theme-monitoring .math-formula {
  color: #2E3830;
}
.theme-monitoring .math-pings {
  color: #4E5950;
}
.theme-monitoring .state-machine-box {
  background: #F8FAF7;
  border-color: #E0E5DE;
}
.theme-monitoring .sm-title {
  color: #2D372F;
}
.theme-monitoring .sm-status-row {
  color: #4E5950;
}
.theme-monitoring .sm-btn.is-pickup {
  border-color: #DCE2DA;
  color: #3E4840;
}
.theme-monitoring .sm-btn.is-pickup:hover {
  background: #F4F6F2;
}
.theme-monitoring .sm-btn.is-detour {
  background: #EDF4FB;
  border-color: #BCD4EB;
  color: #1B65A4;
}
.theme-monitoring .sm-btn.is-detour:hover {
  background: #DEECF8;
  border-color: #1B65A4;
}
.theme-monitoring .sm-btn.is-detour.is-manual-route {
  background: #1B65A4;
  border-color: #1B65A4;
  color: #FFFFFF;
}
.theme-monitoring .sm-btn.is-detour.is-auto-route {
  background: #EEF7EC;
  border-color: #2F7A22;
  color: #2F7A22;
  cursor: default;
}
.theme-monitoring .empty-route-msg {
  color: #2F7A22;
}
.theme-monitoring .iot-cell {
  background: #F4F6F2;
  border-color: #E0E5DE;
}
.theme-monitoring .iot-val {
  color: #0E1410;
}
.theme-monitoring .inject-btn {
  border-color: #DCE2DA;
  color: #4E5950;
}
.theme-monitoring .inject-btn:hover {
  border-color: #2F7A22;
  color: #2F7A22;
}
.theme-monitoring .inspector-placeholder {
  color: #6F7A70;
}

/* TruckBrain Light */
.theme-monitoring .truckbrain-top-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.05);
}
.theme-monitoring .tb-title {
  color: #0E1410;
}
.theme-monitoring .tb-desc {
  color: #4E5950;
}
.theme-monitoring .route-metrics-bar {
  background: transparent;
  border-top-color: #E0E5DE;
}
.theme-monitoring .rm-item {
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
  box-shadow: 0 1px 3px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .rm-item:hover {
  background: #F8FAF7;
  border-color: #CBD5C9;
}
.theme-monitoring .rm-icon-truck { color: #2F7A22; background: #EEF7EC; }
.theme-monitoring .rm-icon-driver { color: #1B65A4; background: #EDF4FB; }
.theme-monitoring .rm-icon-stops { color: #B37400; background: #FFF8E6; }
.theme-monitoring .rm-icon-dist { color: #167E65; background: #E9F7F3; }
.theme-monitoring .rm-icon-time { color: #8F3B84; background: #FBEFF9; }
.theme-monitoring .rm-label {
  color: #6F7A70;
}
.theme-monitoring .rm-val {
  color: #0E1410;
}
.theme-monitoring .rm-code-badge {
  color: #2F7A22;
  background: #EEF7EC;
  border-color: #CDE8CA;
}
.theme-monitoring .rm-sub-tag {
  color: #7A857B;
}
.theme-monitoring .stops-table-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.05);
}
.theme-monitoring .stops-table th {
  background: #F8FAF7;
  border-color: #E0E5DE;
  color: #6F7A70;
}
.theme-monitoring .stops-table td {
  border-color: #EEF1EC;
  color: #0E1410;
}
.theme-monitoring .stop-action-btn {
  border-color: #DCE2DA;
  color: #3E4840;
}
.theme-monitoring .stop-status-pill.is-pending {
  background: #F4F6F2;
  color: #4E5950;
}

/* Driver Tablet Light */
.theme-monitoring .driver-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 12px 32px rgba(14, 20, 16, 0.06);
}
.theme-monitoring .driver-badge {
  color: #2F7A22;
}
.theme-monitoring .truck-meta-tag {
  background: #EEF7EC;
  border-color: #CDE8CA;
  color: #235A1A;
}
.theme-monitoring .driver-selector-section {
  background: #F8FAF7;
  border-color: #E0E5DE;
}
.theme-monitoring .selector-label {
  color: #2D372F;
}
.theme-monitoring .driver-native-select {
  background: #FFFFFF;
  border-color: #DCE2DA;
  color: #0E1410;
}
.theme-monitoring .driver-stop-pill {
  background: #FFFFFF;
  border-color: #DCE2DA;
  color: #4E5950;
}
.theme-monitoring .driver-stop-pill.is-selected {
  background: #EEF7EC;
  border-color: #2F7A22;
  color: #0E1410;
}
.theme-monitoring .pill-bin-title {
  color: #0E1410;
}
.theme-monitoring .target-bin-box {
  background: #F8FAF7;
  border-color: #E0E5DE;
}
.theme-monitoring .target-title {
  color: #0E1410;
}
.theme-monitoring .target-address {
  color: #4E5950;
}
.theme-monitoring .target-track-bar {
  background: #E4EAE2;
}
.theme-monitoring .cleared-banner {
  background: #EEF7EC;
  border-color: #BEE3B9;
  color: #1E5C16;
}
.theme-monitoring .auto-detect-card {
  background: #F6FCF5;
  border-color: #D0EBD0;
  color: #3E4A3E;
}
.theme-monitoring .ad-title {
  color: #2F7A22;
}

/* Alerts Light */
.theme-monitoring .alerts-title {
  color: #0E1410;
}
.theme-monitoring .alerts-subtitle {
  color: #6F7A70;
}
.theme-monitoring .alert-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .alert-card.is-critical {
  background: #FFF7F6;
  border-color: #F8C6C2;
}
.theme-monitoring .alert-card.is-warning {
  background: #FFFAF2;
  border-color: #FDE2B5;
}
.theme-monitoring .alert-name {
  color: #0E1410;
}
.theme-monitoring .alert-body {
  color: #3E4840;
}
.theme-monitoring .alert-ack-btn {
  background: #FFFFFF;
  border-color: #DCE2DA;
  color: #4E5950;
}
.theme-monitoring .alert-ack-btn:hover {
  background: #F4F6F2;
  color: #0E1410;
}
.theme-monitoring .alerts-counter-pill.is-all-clear {
  background: #EEF7EC;
  border-color: #A2D49B;
  color: #2F7A22;
}
.theme-monitoring .alerts-counter-pill.has-alerts {
  background: #FDF0EE;
  border-color: #F5B7B1;
  color: #C93A2B;
}
.theme-monitoring .alerts-empty-state {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .empty-icon-circle {
  background: #EEF7EC;
  border: 2px solid #2F7A22;
  box-shadow: 0 0 20px rgba(47, 122, 34, 0.12);
}
.theme-monitoring .empty-icon-circle svg {
  stroke: #2F7A22;
}
.theme-monitoring .empty-title {
  color: #0E1410;
}
.theme-monitoring .empty-desc {
  color: #4E5950;
}
.theme-monitoring .empty-sim-btn {
  background: #EEF7EC;
  border: 1px solid #2F7A22;
  color: #2F7A22;
  box-shadow: 0 1px 4px rgba(47, 122, 34, 0.08);
}
.theme-monitoring .empty-sim-btn:hover {
  background: #2F7A22;
  border-color: #2F7A22;
  color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(47, 122, 34, 0.22);
}
.theme-monitoring .next-stop-btn {
  background: #EEF7EC;
  border: 1px dashed #2F7A22;
  color: #2F7A22;
}
.theme-monitoring .next-stop-btn:hover {
  background: #2F7A22;
  color: #FFFFFF;
}

/* Telemetry Console Light */
.theme-monitoring .telemetry-top h2 {
  color: #0E1410;
}
.theme-monitoring .telemetry-topic {
  color: #4E5950;
}
.theme-monitoring .telemetry-btn {
  background: #FFFFFF;
  border: 1px solid #DCE2DA;
  color: #2F7A22;
  box-shadow: 0 1px 3px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .telemetry-btn:hover {
  background: #EEF7EC;
  border-color: #2F7A22;
}
.theme-monitoring .telemetry-console {
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.05);
}
.theme-monitoring .console-header {
  background: #F4F6F2;
  border-bottom: 1px solid #E0E5DE;
  color: #4E5950;
  font-weight: 600;
}
.theme-monitoring .console-row {
  border-bottom: 1px solid #EEF1EC;
  background: #FFFFFF;
}
.theme-monitoring .console-row:hover {
  background: #F8FAF7;
}
.theme-monitoring .console-time {
  color: #6F7A70;
}
.theme-monitoring .console-bin code {
  color: #2F7A22;
  background: #EEF7EC;
  border: 1px solid #D2EBD0;
  padding: 2px 6px;
  border-radius: 4px;
}
.theme-monitoring .console-val {
  color: #0E1410;
}
.theme-monitoring .console-hampel.is-accepted {
  color: #2F7A22;
  font-weight: 600;
}

/* ML View Light */
.theme-monitoring .ml-header-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .ml-title {
  color: #0E1410;
}
.theme-monitoring .ml-desc {
  color: #4E5950;
}
.theme-monitoring .ml-card {
  background: #FFFFFF;
  border-color: #E0E5DE;
  box-shadow: 0 1px 4px rgba(14, 20, 16, 0.04);
}
.theme-monitoring .ml-features-list {
  color: #3E4840;
}
.theme-monitoring .ml-p {
  color: #3E4840;
}
.theme-monitoring .ml-formula-badge {
  background: #F4F6F2;
  border-color: #2F7A22;
  color: #2F7A22;
}
</style>
