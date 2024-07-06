import {all} from 'redux-saga/effects';
import {
  watch_current_location_request,
  watch_public_data_request,
} from './publicDataSaga';

function* rootSaga() {
  [yield all([watch_public_data_request(), watch_current_location_request()])];
}
export default rootSaga;
