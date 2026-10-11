import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import NavScreen from './screens/NavScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import type { FlightState } from './types';

const MOBILE_WS_URL = 'ws://192.168.1.20:4001';

export default function App() {
  const [flightData, setFlightData] = useState<FlightState | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nav' | 'checklist'>('dashboard');

  useEffect(() => {
    const ws = new WebSocket(MOBILE_WS_URL);

    ws.onopen = () => {
      console.log('Connected to WiFi bridge');
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as FlightState;
        setFlightData(payload);
      } catch (error) {
        console.warn('Invalid telemetry payload', error);
      }
    };

    ws.onerror = (error) => {
      console.warn('WebSocket error', error);
    };

    ws.onclose = () => {
      console.log('Closed connection to bridge');
    };

    return () => ws.close();
  }, []);

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'nav', label: 'Nav' },
    { key: 'checklist', label: 'Checklist' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'dashboard' && <DashboardScreen flightData={flightData} />}
      {activeTab === 'nav' && <NavScreen flightData={flightData} />}
      {activeTab === 'checklist' && <ChecklistScreen flightData={flightData} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09131d',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f1d2a',
    borderBottomWidth: 1,
    borderBottomColor: '#234b69',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#12263c',
    borderBottomWidth: 2,
    borderBottomColor: '#61dafb',
  },
  tabText: {
    color: '#9bb7d1',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
});
