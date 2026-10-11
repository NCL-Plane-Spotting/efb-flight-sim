import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FlightState } from '../types';

type DashboardScreenProps = {
  flightData: FlightState | null;
};

export default function DashboardScreen({ flightData }: DashboardScreenProps) {
  if (!flightData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Connecting to telemetry bridge...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Flight Dashboard</Text>

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
          <Text style={styles.label}>GS</Text>
          <Text style={styles.value}>{Math.round(flightData.airdata.groundSpeed)} kt</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Heading</Text>
          <Text style={styles.value}>{Math.round(flightData.position.heading)}°</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Vertical Speed</Text>
          <Text style={styles.value}>{Math.round(flightData.airdata.verticalSpeed)} fpm</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Fuel</Text>
          <Text style={styles.value}>{Math.round(flightData.engine.fuelRemaining)} gal</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09131d' },
  content: { padding: 18 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#12263c', borderRadius: 12, padding: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  label: { color: '#9bb7d1', fontSize: 12, marginBottom: 6, textTransform: 'uppercase' },
  value: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  emptyContainer: { flex: 1, backgroundColor: '#09131d', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#ffffff', fontSize: 18 },
});
