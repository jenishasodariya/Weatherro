// Library Imports
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

// Local Imports
import {COLORS} from '../Assets/theme/COLOR';
import {getWeatherIcon} from '../utils';
import CityInfo from './CityInfo';
import CurrentWeather from './CurrentWeather';
import HourlyInfo from './HourlyInfo';
import CSafeAreaView from '../Common/CSafearewView';
import {
  request_current_location,
  toggle_temp,
} from '../Redux/Actions/publicDataActions';
import strings from '../i18n/strings';
import {changeAppLanguage, getAsyncStorageData} from '../Helper/helper';
import GetLocationPermission, {
  ASYNC_SEL_LANGUAGE,
} from '../Helper/PermissionLocation';
import {CLoader} from '../Common/CLoader';
const windowWidth = Dimensions.get('window').width;

// Convert Value to Fahrenheit
export const convertFarhenheit = temp => {
  return ((temp * 9) / 5 + 32).toFixed(1);
};

// Weather Forecast Component
const WeatherForecast = () => {
  const [selectedDayDate, setSelectedDayDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const [language, setLanguage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Get the state from the store
  const state = useSelector(state => state.params);
  const isFahrenheit = state.is_temp_c;
  const {weather_data, weather_loading, city_data} = useSelector(
    state => state.params,
  );

  const getSelectedDateHours =
    weather_data?.days?.filter(a => a.datetime == selectedDayDate)?.[0]
      ?.hours || [];
  const getSelectedDay =
    weather_data?.days?.filter(a => a.datetime == selectedDayDate)?.[0] || [];

  // Get the current location and language
  useEffect(() => {
    getLanguage();
    getPermission();
  }, []);

  // Get the current location
  const getPermission = async () => {
    const permission = await GetLocationPermission();
    dispatch(request_current_location(permission.coords));
  };

  // Get the language from the async storage
  const getLanguage = async () => {
    setIsLoading(true);
    const lan = await getAsyncStorageData(ASYNC_SEL_LANGUAGE);
    if (lan) {
      setLanguage(lan === 'hi');
      changeAppLanguage(lan);
    }
    setIsLoading(false);
  };

  // Toggle the temperature
  const handleFahrenheit = toggle => {
    dispatch(toggle_temp(toggle));
  };

  const renderCurrentWeatherCards = ({item}) => {
    const today = new Date();
    const cardDate = new Date(item?.datetime);

    let dateString = cardDate.toLocaleDateString();
    if (cardDate.getDate() === today.getDate()) {
      dateString = strings.today;
    } else if (cardDate.getDate() === today.getDate() + 1) {
      dateString = strings.tomorrow;
    }

    const weatherIcon = getWeatherIcon(item.conditions);

    return (
      <TouchableOpacity
        style={[
          styles.forecastCard,
          item.datetime === selectedDayDate
            ? {backgroundColor: COLORS.primary}
            : {},
        ]}
        onPress={() => {
          setSelectedDayDate(item.datetime);
        }}>
        <Text
          style={[
            styles.forecastDate,
            item.datetime === selectedDayDate
              ? {color: COLORS.light_shade}
              : {},
          ]}>
          {dateString}
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image source={weatherIcon} style={styles.forecastCondition} />
        </View>
        <Text
          style={[
            styles.forecastTempText,
            item.datetime === selectedDayDate
              ? {color: COLORS.light_shade}
              : {},
          ]}>
          {isFahrenheit
            ? `${convertFarhenheit(item.temp)}°F`
            : `${item.temp}°C`}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHourlyInfo = ({item, index}) => {
    return <HourlyInfo data={item} />;
  };

  // Select the language
  const selectLanguageFun = async () => {
    setLanguage(!language);
    changeAppLanguage(!language ? 'hi' : 'en');
  };

  return (
    <CSafeAreaView>
      <CityInfo />
      <Text style={[styles.forecastTitle, {alignSelf: 'flex-start'}]}>
        {strings.currentlocation} : {city_data?.address?.city}
      </Text>
      <View style={styles.labelview}>
        <Text style={styles.forecastTitle}>{strings.selectLanguage}</Text>
        <Text style={styles.forecastTitle}>{strings.convert}</Text>
      </View>
      <View style={styles.switchview}>
        <View style={styles.switclabel}>
          <Text style={styles.label}>En</Text>
          <Switch
            onValueChange={selectLanguageFun}
            value={language}
            trackColor={{false: COLORS.dark_shade, true: COLORS.primary}}
            thumbColor={COLORS.light_shade}
          />
          <Text style={styles.label}>Hi</Text>
        </View>
        <Switch
          trackColor={{false: COLORS.dark_shade, true: COLORS.primary}}
          thumbColor={COLORS.light_shade}
          value={isFahrenheit}
          onValueChange={handleFahrenheit}
        />
      </View>
      <ScrollView>
        {weather_loading ? (
          <ActivityIndicator size={'small'} color={COLORS.primary} />
        ) : (
          <>
            {weather_data && (
              <View style={styles.scrollFlat}>
                <FlatList
                  data={weather_data?.days}
                  renderItem={renderCurrentWeatherCards}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.datetime}
                  horizontal
                />
              </View>
            )}

            {getSelectedDay && (
              <CurrentWeather currentWeather={getSelectedDay} />
            )}

            <FlatList
              data={getSelectedDateHours}
              renderItem={renderHourlyInfo}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.datetime}
              style={styles.list}
              contentContainerStyle={{alignItems: 'center'}}
            />
          </>
        )}
      </ScrollView>
      {isLoading && <CLoader />}
    </CSafeAreaView>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    width: windowWidth * 0.9,
    alignSelf: 'center',
    marginTop: 12,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.dark_shade,
  },
  selectCity: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    width: windowWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  selectCityText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weatherCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 8,
  },
  forecastCard: {
    height: (windowWidth * 0.65) / 2,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 7,
    alignSelf: 'center',
  },
  forecastDate: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
  },
  forecastCondition: {width: 50, height: 60},

  forecastTempText: {
    color: COLORS.temp,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollFlat: {
    marginTop: 22,
    width: windowWidth,
    alignSelf: 'center',
    marginBottom: (windowWidth * 0.2) / 2,
    marginLeft: 14,
  },
  selectCityHeaderText: {color: COLORS.windSpeedText, fontStyle: 'italic'},
  list: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    marginBottom: 70,
  },
  switchview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  switclabel: {
    justifyContent: 'center',
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  label: {
    color: COLORS.dark_shade,
    fontSize: 16,
  },
  labelview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
  },
});

export default WeatherForecast;
