# EFB Flight Sim

A local WiFi-connected EFB stack for Microsoft Flight Simulator 2024.

## Purpose

This project is a starter platform for an iPad-first Electronic Flight Bag (EFB) that connects over local WiFi to a Windows PC bridge. The bridge reads live flight data from MSFS and publishes it to the mobile app.

## Repository layout

- `apps/mobile` — Expo + React Native app for iPad
- `apps/bridge-dotnet` — Windows-side .NET bridge prototype
- `apps/bridge` — Node-style local bridge prototype for testing
- `docs` — architecture and telemetry documentation

## Architecture overview

- The Windows PC hosts the telemetry bridge
- The bridge reads flight data from MSFS using SimConnect or a mock data source
- The bridge sends JSON telemetry over WebSocket to the iPad
- The mobile app renders the live dashboard, navigation view, and checklist data

## Local connection

The mobile app connects to the bridge over WiFi, for example:

```text
ws://192.168.1.20:4001/
```

## What is included

- live telemetry schema
- Windows bridge starter
- Expo mobile starter app
- dashboard, nav, and checklist UI structure
- architecture notes and SimConnect variable recommendations

## Project phases

### Phase 1 — Live telemetry
- connect to MSFS telemetry source
- stream data over WiFi
- render live altitude, IAS, heading, fuel, and nav values

### Phase 2 — Operational EFB
- route planning
- checklists
- runway / airport data
- map and nav integration

### Phase 3 — Advanced capability
- weather overlays
- charts
- performance calculations
- aircraft systems monitoring

## Quick start

### Windows bridge

```bash
dotnet run --project apps/bridge-dotnet/EfbBridge.csproj -- --mode mock
```

### Mobile app

```bash
cd apps/mobile
npx expo start
```

## Data contract

The app and bridge share a common JSON structure for live flight data. The shared keys include:

- timestamp
- aircraft
- position
- airdata
- engine
- nav
- environment
- systems

## Documents

- `docs/ARCHITECTURE.md`
- `docs/SIMCONNECT_VARIABLES.md`

## Notes

This project is intentionally configured as a real architecture starter rather than a mock-only demo. The key next improvement is moving the bridge from mock data to live SimConnect values while leaving the mobile app data contract unchanged.
