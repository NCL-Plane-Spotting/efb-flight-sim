export type FlightState = {
  timestamp: number;
  aircraft: {
    type: string;
    callsign: string;
    registration: string;
  };
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
    heading: number;
    pitch: number;
    roll: number;
  };
  airdata: {
    indicatedAirspeed: number;
    trueAirspeed: number;
    groundSpeed: number;
    verticalSpeed: number;
    pressureAltitude: number;
  };
  engine: {
    rpm: number;
    fuelFlow: number;
    fuelRemaining: number;
    oilTemp: number;
  };
  nav: {
    activeWaypoint: string;
    nextWaypoint: string;
    distanceRemaining: number;
    bearing: number;
  };
  environment: {
    windDirection: number;
    windSpeed: number;
    temperature: number;
    pressure: number;
  };
  systems: {
    flaps: number;
    gear: boolean;
    autopilot: boolean;
  };
};
