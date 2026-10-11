import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FlightState } from '../types';

type NavScreenProps = {
  flightData: FlightState | null;
};

export default function NavScreen({ flightData }: NavScreenProps) {
  if (!flightData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data yet</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Navigation</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Active waypoint</Text>
        <Text style={styles.value}>{flightData.nav.activeWaypoint}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Next waypoint</Text>
        <Text style={styles.value}>{flightData.nav.nextWaypoint}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.label}>Distance remaining</Text>
          <Text style={styles.value}>{flightData.nav.distanceRemaining.toFixed(1)} nm</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Bearing</Text>
          <Text style={styles.value}>{Math.round(flightData.nav.bearing)}°</Text>
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
