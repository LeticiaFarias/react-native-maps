import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from 'expo-location';
import MapView from 'react-native-maps';
import { styles } from './styles';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  async function requesteLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    try {
      if (granted) {
        const currentLocation = await getCurrentPositionAsync({
          accuracy: 6,
          distanceInterval: 10,
          mayShowUserSettingsDialog: true,
          timeInterval: 5000,
        });
        setLocation(currentLocation);
      } else {
        alert('Permission to access location was denied');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    requesteLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />
      )}
    </View>
  );
}
