import API, { getArmyNames, getTableList } from '@/services/api';

export default {
  namespace: 'army',

  state: {
    nextList: {
    },
  },
  effects: {
    *getNextList({ payload, cb }, { call, put }) {
      const response = yield call(API.getNextArmyList, payload);
      cb && cb(response.data);
    }  
  },
  reducers: {
  },
};
