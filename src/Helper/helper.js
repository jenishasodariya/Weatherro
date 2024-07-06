import strings from '../i18n/strings';
import {ASYNC_SEL_LANGUAGE} from './PermissionLocation';
import EncryptedStorage from 'react-native-encrypted-storage';

const setAsyncStorageData = async (key, value) => {
  const stringData = JSON.stringify(value);
  await EncryptedStorage.setItem(key, stringData);
};

// Get Async Storage Data
const getAsyncStorageData = async key => {
  const data = await EncryptedStorage.getItem(key);
  return !!data ? JSON.parse(data) : data;
};

// Remove Async Storage Data
const removeAsyncStorageData = async key => {
  await EncryptedStorage.removeItem(key);
};

//Change App Language
const changeAppLanguage = async value => {
  strings.setLanguage(value);
  global.language = value;
  await setAsyncStorageData(ASYNC_SEL_LANGUAGE, value);
  return value;
};

export {
  setAsyncStorageData,
  getAsyncStorageData,
  removeAsyncStorageData,
  changeAppLanguage,
};
