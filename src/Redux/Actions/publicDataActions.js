import {createAction} from 'redux-actions';
import * as types from './actionTypes';

export const request_weather_data = createAction(
  types.REQUEST_WEATHER_DATA,
  location => ({
    weather_loading: true,
    location,
  }),
);

export const success_weather_data = createAction(
  types.SUCCESS_WEATHER_DATA,
  data => ({
    weather_loading: false,
    weather_data: data,
  }),
);

export const failed_weather_data = createAction(
  types.FAILED_WEATHER_DATA,
  () => ({
    weather_loading: false,
    weather_data: {},
  }),
);

export const store_state = createAction(
  types.STORE_STATE,
  weather_data_state => ({
    weather_data_state,
  }),
);

export const toggle_temp = createAction(types.TOGGLE_TEMP, is_temp_c => ({
  is_temp_c,
}));

export const request_current_location = createAction(
  types.REQUEST_CURRENT_LOCATION,
  location => location,
);

export const current_city_data = createAction(
  types.CURRENT_CITY_DATA,
  city_data => ({city_data}),
);
