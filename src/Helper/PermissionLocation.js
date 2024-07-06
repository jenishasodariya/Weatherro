import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {useDispatch} from 'react-redux';
import {request_current_location} from '../Redux/Actions/publicDataActions';

const GetLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const permissionResponse = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (permissionResponse === 'granted') {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    }
  } else if (Platform.OS === 'ios') {
    const iosPermission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    const granted = await request(Platform.select({ios: iosPermission}));
    if (granted === RESULTS.GRANTED) {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      });
    }
  }
  return false;
};
export async function IsLocationEnabled() {
  const permissionStatus = false;
  if (Platform.OS === 'android') {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
  if (Platform.OS === 'ios') {
    const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return result === RESULTS.GRANTED;
  }
  return permissionStatus;
}
export default GetLocationPermission;

export const ASYNC_SEL_LANGUAGE = 'ASYNC_SEL_LANGUAGE';
