import { WebSocketServer } from 'ws';
import type { FlightState } from '../../shared/src/index';

const PORT = 4001;

const mockTelemetry: FlightState = {
  timestamp: Date.now(),
  aircraft: {
    type: 'Cessna 172',
    callsign: 'N123AB',
    registration: 'N123AB',
  },
  position: {
    latitude: 51.4700,
    longitude: -0.4543,
    altitude: 2400,
    heading: 145,
    pitch: 2.1,
    roll: -0.8,
  },
  airdata: {
    indicatedAirspeed: 125,
    trueAirspeed: 132,
    groundSpeed: 128,
    verticalSpeed: 230,
    pressureAltitude: 2450,
  },
  engine: {
    rpm: 2200,
    fuelFlow: 19.5,
    fuelRemaining: 120,
    oilTemp: 86,
  },
  nav: {
    activeWaypoint: 'EGLL',
    nextWaypoint: 'MCT',
    distanceRemaining: 14.8,
    bearing: 182,
  },
  environment: {
    windDirection: 210,
    windSpeed: 17,
    temperature: 12,
    pressure: 1013,
  },
  systems: {
    flaps: 10,
    gear: false,
    autopilot: true,
  },
};

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  console.log('Client connected');

  const interval = setInterval(() => {
    const payload: FlightState = {
      ...mockTelemetry,
      timestamp: Date.now(),
      position: {
        ...mockTelemetry.position,
        altitude: mockTelemetry.position.altitude + Math.sin(Date.now() / 1000) * 8,
      },
    };

    socket.send(JSON.stringify(payload));
  }, 1000);

  socket.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log(`Telemetry bridge listening on ws://localhost:${PORT}`);
