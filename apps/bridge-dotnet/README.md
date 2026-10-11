# EFB Bridge Starter

This project is the Windows-side bridge for the MSFS 2024 EFB.

## Purpose

- listen on a local WiFi address such as `ws://192.168.1.20:4001`
- pull live aircraft telemetry from Microsoft Flight Simulator
- stream that data to the iPad app over WebSocket

## Current state

This starter is configured to run without requiring the full SimConnect SDK at compile time. It emits realistic mock telemetry to prove the app-to-bridge flow works end-to-end.

## Real SimConnect step

When you are ready to connect to MSFS directly, replace the mock data in `SimConnectBridge.cs` with a proper `SimConnect` client connection and request the aircraft variables you need:

- latitude, longitude, altitude
- heading, pitch, roll
- IAS, TAS, GS
- vertical speed
- engine RPM, fuel remaining, oil temp
- autopilot, gear, flap state

## Run

From a Windows machine:

```bash
dotnet run --project apps/bridge-dotnet/EfbBridge.csproj
```

Then connect the mobile app to:

```text
ws://192.168.1.20:4001/
```

## Notes

This is intentionally a starter for the actual simulator integration layer. The next step is wiring the real SimConnect values into the same JSON payload used by the mobile device.
