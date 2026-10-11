# EFB Flight Sim

A local WiFi-connected EFB stack for Microsoft Flight Simulator 2024.

## Architecture

- Windows bridge: .NET app that connects to the simulator and exposes telemetry over WiFi
- Mobile app: Expo + React Native for iPad
- Shared contract: JSON payload used by both sides

## Current repository state

- local bridge starter with WebSocket listener
- Expo mobile dashboard starter
- shared telemetry model
- Windows .NET bridge project scaffold

## Planned live data flow

1. The Windows bridge reads aircraft telemetry from MSFS
2. It converts it into a standard JSON flight-state payload
3. It sends that payload over WebSocket to the iPad
4. The mobile app renders live flight information

## Real simulator integration target

The bridge should read live data such as:
- latitude, longitude, altitude
- heading, pitch, roll
- IAS, TAS, GS, vertical speed
- engine RPM, fuel remaining, oil temp
- gear, flaps, autopilot state

## Milestones

### Phase 1: Live telemetry
- Establish the simulator connection
- Send real-time flight data to the client
- Display altitude, IAS, heading, fuel, and nav values

### Phase 2: Operations
- route planning
- checklists
- airport info
- nav page

### Phase 3: Advanced EFB
- weather
- charts
- performance calculations
- aircraft systems overview

## Example local endpoint

```text
ws://192.168.1.20:4001/
```

## Notes

This is a real project scaffold for an iPad-first EFB. The next technical step is to integrate the Windows bridge with the simulator telemetry source and stream that data to the mobile app without mock values.
