import API, { getArmyNames, getTableList } from '@/services/api';
import { message } from 'antd';
import router from 'umi/router';
import MfsUtil from '@/utils/mfsUtil';

export default {
  namespace: 'priArmy',

  state: {
    selectArmyNames: [],
    amryInfoList: {
      list: [],
      pagination: {},
    },
    army: {},
    editArmy: [],
    operate: 'look',
    member: {}
  },
  effects: {
    *getArmyInfo({ payload }, { call, put }) {
      const response = yield call(API.getArmyInfo, payload);
      yield put({
        type: 'saveArmy',
        payload: response.data,
      });
    },
    *getArmyInfoList({ payload }, { call, put }) {
      const response = yield call(API.getArmyInfoList, payload);
      yield put({
        type: 'saveArmyInfoList',
        payload: response.data,
      });
    },
    *submitArmyForm({ payload }, { call }) {
      const response = yield call(API.addArmy, payload);
      if (response.status != 100) {
        message.error(response.error);
      } else {
        message.success('提交成功');
        router.push('/admin/army-manage')
      }
    },
    *editArmyForm({ payload }, { call }) {
      const response = yield call(API.editArmy, payload);
      if (response.status != 100) {
        message.error(response.error);
      } else {
        message.success('提交成功');
        router.push('/admin/army-manage')
      }
    },
    *submitMenberForm({ payload, cb, api }, { call }) {
      yield MfsUtil.submitForm({ payload }, { call }, api, cb);
    },
    
  },
  reducers: {
    saveArmyName(state, action) {
      return {
        ...state,
        selectArmyNames: action.payload,
      }; 
    },
    saveArmyInfoList(state, {payload}) {
      return {
        ...state,
        amryInfoList: payload,
      };
    },
    saveArmy(state, {payload}) {
      return {
        ...state,
        army: payload,
      }
    },
    changeOperate(state, {payload}) {
      return {
        ...state,
        operate: payload
      }
    },
    saveMember() {
    }
  },
};
