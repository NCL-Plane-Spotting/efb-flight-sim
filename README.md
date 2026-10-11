# EFB Flight Sim

A local WiFi-connected EFB for Microsoft Flight Simulator 2024, built for an iPad-first workflow and a Windows PC bridge.

## Architecture

- `apps/bridge`: Windows PC service that reads simulator telemetry and exposes it over WebSocket
- `apps/mobile`: React Native / Expo app for iPad
- `apps/shared`: shared telemetry contracts and types used by both sides

## What works today

- local WiFi bridge scaffold
- shared telemetry model
- mobile app shell with live dashboard connection logic
- a first-pass dashboard that displays real-time mock telemetry from the bridge

## Current flow

1. Start the bridge server on the PC
2. Connect the iPad app to the local WiFi IP on the PC
3. Receive live flight data via WebSocket
4. Render the dashboard in the app

## First milestone delivered

- bridge startup server
- live telemetry payload format
- mobile dashboard screen shell
- network connection to local WiFi endpoint

## Planned phases

### Phase 1: live simulator data
- SimConnect bridge layer
- real telemetry ingest
- live dashboard stream

### Phase 2: operational EFB
- flight planning
- checklists
- airport and route data
- nav / waypoint display

### Phase 3: advanced capabilities
- weather integration
- charts
- performance calculations
- aircraft systems, fuel, and weight calculations

## Local connection example

The bridge listens on a local endpoint such as:

- `ws://192.168.1.20:4001`

The mobile app connects to this address over WiFi on the same network.

## Notes

This repo is intentionally structured as a working starter project rather than a complete production app. The next implementation step is to replace the mock telemetry stream with real MSFS data and then expand the dashboard into operational pages.
