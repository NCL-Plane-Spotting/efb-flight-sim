import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FlightState } from '../types';

type ChecklistScreenProps = {
  flightData: FlightState | null;
};

const checklist = [
  'Preflight complete',
  'Fuel quantity checked',
  'Taxi checklist complete',
  'Takeoff briefing complete',
  'Approach checklist complete',
  'Landing checks complete',
  'Shutdown checks complete'
];

export default function ChecklistScreen({ flightData }: ChecklistScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Checklist</Text>

      <View style={styles.card}>
        <Text style={styles.status}>Aircraft status: {flightData ? 'Live' : 'Waiting for telemetry'}</Text>
      </View>

      {checklist.map((item, index) => (
        <View key={item} style={styles.row}>
          <Text style={styles.index}>{index + 1}.</Text>
          <Text style={styles.item}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09131d' },
  content: { padding: 18 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  card: { backgroundColor: '#12263c', borderRadius: 12, padding: 16, marginBottom: 18 },
  status: { color: '#ffffff', fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1e3d57' },
  index: { color: '#9bb7d1', fontSize: 18, width: 32 },
  item: { flex: 1, color: '#ffffff', fontSize: 17 },
});
