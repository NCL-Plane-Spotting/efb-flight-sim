# EFB Flight Sim

A local WiFi-connected EFB for Microsoft Flight Simulator 2024, designed for iPad-first use and a Windows PC bridge.

## Architecture

- `apps/bridge`: Windows PC service that reads sim telemetry and exposes it over WebSocket
- `apps/mobile`: React Native app for iPad
- `apps/shared`: telemetry contracts and types shared by both sides

## Goals

- Real-time flight data over local WiFi
- Live cockpit dashboards
- Checklist and navigation modules
- Future airport/weather/performance features

## Quick start

1. Open the bridge app and start the local telemetry server
2. Connect the iPad app to the PC IP on the local WiFi network
3. Stream flight data into the dashboard

## First milestone

- Live dashboard: altitude, IAS, GS, heading, vertical speed
- Navigation summary: active waypoint, ETA, distance remaining
- Checklist screen
- Basic map placeholder screen

## Planned phases

### Phase 1: live telemetry
- SimConnect bridge
- WebSocket feed
- dashboard data rendering

### Phase 2: operational utility
- flight planning
- checklists
- airport data
- weather

### Phase 3: advanced EFB
- charts
- performance pages
- fuel and weight calculations
- aircraft systems view

## Local connection example

The bridge listens on a local IP such as:

- `ws://192.168.1.20:4001`

The mobile app will connect to this address over WiFi.

## Notes

This repository is deliberately scaffolded as a starter project rather than a complete production app. The next step is to implement the bridge telemetry layer and then the dashboard screens.
