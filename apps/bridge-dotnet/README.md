# EFB Bridge Starter

This Windows-side bridge is the live telemetry layer for the EFB project.

## What it does

- starts a local WebSocket server on the PC
- publishes a standard JSON flight-state payload over WiFi
- supports two modes:
  - `mock` for local testing and app validation
  - `simconnect` for the real MSFS integration hook

## Run it

```bash
dotnet run --project apps/bridge-dotnet/EfbBridge.csproj -- --mode mock
```

For custom host/port:

```bash
dotnet run --project apps/bridge-dotnet/EfbBridge.csproj -- --host 0.0.0.0 --port 4001 --mode mock
```

## Endpoint

The mobile app connects to:

```text
ws://192.168.1.20:4001/
```

## Real SimConnect integration roadmap

The `SimConnectDataSource` is the extension point for actual simulator data.

The future implementation will do the following:

1. connect to MSFS with SimConnect
2. request telemetry variables
3. map them into `FlightState`
4. publish the same JSON payload to the same WebSocket stream

This keeps the mobile app unaffected while the data source changes from mock to live telemetry.
