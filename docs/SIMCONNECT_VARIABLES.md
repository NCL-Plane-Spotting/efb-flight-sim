# MSFS SimConnect variable recommendations

This document lists the most useful variables for a real EFB bridge.

## Core flight data

- PLANE LATITUDE
- PLANE LONGITUDE
- PLANE ALTITUDE
- PLANE HEADING DEGREES MAGNETIC
- PLANE HEADING DEGREES TRUE
- PITCH DEGREES
- ROLL DEGREES
- INDICATED ALTITUDE
- BAROMETER PRESSURE
- KOHLSMAN SETTING HG
- GPS GROUND SPEED
- GPS GROUND TRUE TRACK
- GPS MAGVAR
- AIRSPEED INDICATED
- AIRSPEED TRUE
- VERTICAL SPEED
- SURFACE WIND DIRECTION
- SURFACE WIND VELOCITY
- AMBIENT TEMPERATURE
- PRESSURE ALTITUDE

## Engine and fuel

- ENGINES RPM
- FUEL FLOW GPH
- FUEL LEFT QUANTITY
- FUEL RIGHT QUANTITY
- FUEL TOTAL QUANTITY
- FUEL TANK CAPACITY
- ENGINE OIL TEMP
- ENGINE OIL PRESSURE
- THROTTLE POSITION
- MIXTURE POSITION
- PROP RPM

## Systems

- GEAR HANDLE POSITION
- GEAR POSITION
- FLAPS HANDLE PERCENT
- BRAKE PRESSURE
- AUTOPILOT MASTER
- AUTOPILOT HEADING LOCK
- AUTOPILOT ALTITUDE LOCK
- AUTOPILOT VERTICAL HOLD
- AUTOPILOT PITCH HOLD
- AUTOPILOT APPROACH HOLD

## Navigation and route

- GPS POSITION LAT
- GPS POSITION LON
- GPS WP NEXT LAT
- GPS WP NEXT LON
- GPS WP NEXT ID
- GPS WP DISTANCE
- GPS WP BEARING
- GPS WP TRUE BEARING
- GPS COURSE
- NAV ACTIVE FREQUENCY
- NAV RADIAL ERROR
- NAV CDI
- NAV GLIDE SLOPE ERROR

## Aircraft metadata

- TITLE
- ATC AIRLINE
- ATC FLIGHT NUMBER
- ATC ID
- AIRCRAFT MODEL
- PAYLOAD STATION WEIGHT
- EMPTY WEIGHT
- WEIGHT ON WHEELS
- SIM ON GROUND

## Recommended mapping

- latitude, longitude, altitude, heading -> `position`
- IAS, TAS, GS, verticalSpeed -> `airdata`
- fuelRemaining, rpm, oilTemp -> `engine`
- next waypoint, distance, bearing -> `nav`
- wind, temperature, pressure -> `environment`
- gear, flaps, autopilot -> `systems`

## Implementation note

The bridge should request the variables at a fixed interval and map them into a stable JSON payload so the mobile app remains decoupled from the simulator specifics.
