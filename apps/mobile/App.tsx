import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { FlightState } from '../../shared/src/index';

const MOBILE_WS_URL = 'ws://192.168.1.20:4001';

export default function App() {
  const [flightData, setFlightData] = useState<FlightState | null>(null);

  useEffect(() => {
    const socket = new WebSocket(MOBILE_WS_URL);

    socket.onopen = () => {
      console.log('Connected to flight bridge');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as FlightState;
        setFlightData(data);
      } catch (error) {
        console.warn('Invalid telemetry payload', error);
      }
    };

    socket.onerror = (error) => {
      console.warn('WebSocket error', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => socket.close();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>EFB Flight Dashboard</Text>

        {flightData ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Aircraft</Text>
              <Text style={styles.value}>{flightData.aircraft.type}</Text>
              <Text style={styles.value}>Callsign: {flightData.aircraft.callsign}</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.card}>
                <Text style={styles.label}>Altitude</Text>
                <Text style={styles.value}>{Math.round(flightData.position.altitude)} ft</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>IAS</Text>
                <Text style={styles.value}>{Math.round(flightData.airdata.indicatedAirspeed)} kt</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Heading</Text>
                <Text style={styles.value}>{Math.round(flightData.position.heading)}°</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Fuel</Text>
                <Text style={styles.value}>{Math.round(flightData.engine.fuelRemaining)} gal</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.pending}>Connecting to the telemetry bridge...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08111d',
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#12263c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  label: {
    color: '#9bb7d1',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  value: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  pending: {
    color: '#dfeafc',
    fontSize: 16,
    marginTop: 16,
  },
});
