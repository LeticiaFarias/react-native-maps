import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { styles } from './styles';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  
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
      console.log(`An error has occurred: ${error}`);
    }
  }

  useEffect(() => {
    requesteLocationPermission();
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        setLocation(location);
        mapRef.current?.animateCamera({
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
