# EFB Flight Sim architecture

## Overview

This repository is designed around a classic EFB architecture:

- a Windows PC bridge reads flight data from MSFS
- a local WebSocket service streams that data over WiFi
- the iPad app renders live operational pages

## Why this layout works

This pattern separates concerns cleanly:

- the simulator is the source of truth
- the bridge handles telemetry conversion and transport
- the mobile client handles presentation, cockpit monitoring, and user interactions

## Data flow

1. MSFS exposes live aircraft data
2. The Windows bridge subscribes to the relevant variables
3. The bridge converts them into a standard JSON telemetry object
4. The bridge pushes updates over WebSocket to the connected iPad
5. The app updates dashboard, nav, checklist, and other components

## Main modules

### Windows bridge

The bridge should be responsible for:
- SimConnect or other simulator connection
- variable registration
- data sampling and conversion
- local JSON publication
- WebSocket broadcasting to connected clients

### Mobile app

The app should be responsible for:
- connection to the bridge over WiFi
- UI rendering of live flight data
- checklists, route summary, and operational modules
- future airport/weather/performance pages

## Recommended interface contract

The mobile app should receive a single payload that is stable and consistent across updates.

Example payload shape:

```ts
{
  timestamp: 1712345678901,
  aircraft: {
    type: 'Cessna 172',
    callsign: 'N123AB',
    registration: 'N123AB'
  },
  position: {
    latitude: 51.47,
    longitude: -0.4543,
    altitude: 2400,
    heading: 145,
    pitch: 2.1,
    roll: -0.8
  },
  airdata: {
    indicatedAirspeed: 125,
    trueAirspeed: 132,
    groundSpeed: 128,
    verticalSpeed: 230,
    pressureAltitude: 2450
  },
  engine: {
    rpm: 2200,
    fuelFlow: 19.5,
    fuelRemaining: 120,
    oilTemp: 86
  },
  nav: {
    activeWaypoint: 'EGLL',
    nextWaypoint: 'MCT',
    distanceRemaining: 14.8,
    bearing: 182
  },
  environment: {
    windDirection: 210,
    windSpeed: 17,
    temperature: 12,
    pressure: 1013
  },
  systems: {
    flaps: 10,
    gear: false,
    autopilot: true
  }
}
```

## Operational pages

The app should evolve through these screens:

- Dashboard: core live data
- Nav: waypoint and route information
- Checklist: flight items and phase checks
- Performance: takeoff, approach, and landing metrics
- Weather: METAR, winds, and conditions
- Airport: runway, CTAF, charts, and local data

## Future requirements

This repo is intentionally structured to support future expansion without breaking the live telemetry contract.

The key long-term capability is preserving a stable app data model while swapping the simulator source from mock telemetry to real SimConnect values.
