import {View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import WeatherForecast from './components/WeatherForecast';
import {Provider} from 'react-redux';
import configureStore from './Redux/store';
import GetLocationPermission from './Helper/PermissionLocation';

const App = () => {
  return (
    <View style={styles.homeContainer}>
      <Provider store={configureStore().store}>
        <WeatherForecast />
      </Provider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  homeContainer: {
    padding: 8,
    paddingTop: 22,
    backgroundColor: '#fff',
    flex: 1,
  },
});
