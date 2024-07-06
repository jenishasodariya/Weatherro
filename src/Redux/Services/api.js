import apisauce from 'apisauce';
import config from '../../config';

export const rootApi = apisauce.create({
  baseURL: config.API_URL,
});

const publicAPI = url => {
  return rootApi.get(url);
};

const publicPostAPI = (url, body, header) => {
  return rootApi.post(config.API_URL + '/' + url, body, {});
};

const publicAPILocation = url => {
  return rootApi.get(
    config.API_CURRENT_LOCATION + `lat=${url?.latitude}&lon=${url?.longitude}`,
  );
};

export const api = {
  publicAPI,
  publicPostAPI,
  publicAPILocation,
};

export default api;
