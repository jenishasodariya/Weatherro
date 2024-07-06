import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLORS} from '../Assets/theme/COLOR';
import {cities, states} from '../Assets/theme/appDataConfig';
import CTextInput from '../Common/CTextInput';
import {useDispatch} from 'react-redux';
import {
  request_weather_data,
  store_state,
} from '../Redux/Actions/publicDataActions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CitySelectorModal = ({visible, onClose}) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Surat');

  const dispatch = useDispatch();

  // Get the state from the store
  useEffect(() => {
    dispatch(request_weather_data(selectedCity));
  }, [selectedCity]);

  // Combine the states and cities data
  const newData = useMemo(() => {
    return states.map(state => {
      return {
        ...state,
        cities: cities.filter(city => city.stateId === state.id),
      };
    });
  }, [states, cities]);

  // Filter the states and cities data
  const handleStateSearch = useMemo(() => {
    const filterState = newData.filter(state =>
      state.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (filterState.length === 0) {
      const filterCity = newData.map(state => {
        return {
          ...state,
          cities: state.cities.filter(city =>
            city.name.toLowerCase().includes(search.toLowerCase()),
          ),
        };
      });
      return filterCity.filter(state => state.cities.length > 0);
    }
    return search ? filterState : newData;
  }, [search]);

  const renderStates = ({item}) => (
    <View>
      <Text style={styles.stateName}>{item.name}</Text>
      <View style={styles.cityInfoContent}>
        <FlatList
          data={item?.cities}
          renderItem={renderCities}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  const renderCities = ({item}) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelectedCity(item?.name);
          dispatch(store_state(item));
          onClose();
          setSearch('');
        }}>
        <Text style={styles.cityName}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.regionInfoContent}>
          <Text style={styles.modalHeaderText}>Select Your State</Text>
          <CTextInput
            placeholder="Search State"
            value={search}
            onChangeText={text => {
              setSearch(text);
            }}
          />
          <FlatList
            data={handleStateSearch}
            renderItem={renderStates}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CitySelectorModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  regionInfoContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: windowWidth * 0.9,
    height: windowHeight * 0.8,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  stateName: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: COLORS.dark_shade,
  },
  cityName: {
    fontSize: 14,
    marginBottom: 10,
    color: COLORS.windSpeedText,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.temp,
    marginTop: 10,
  },
  cityInfoContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 9,
  },
});
