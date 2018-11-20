import { stringify } from 'qs';
import request, {fetch, outFetch} from '@/utils/request';
import config from './config';
import mapConfig from '@/components/Map/config';
const baseUrl = config.SERVER_HOST;
const POST = 'post';
const GET = 'get';

export default {
  async login(params) {
    return fetch(baseUrl + '/basic/login', params, POST);
  },
  async getArmyInfoList(params) {
    return fetch(baseUrl + '/army/list', params);
  },
  async getNextArmyList(params) {
    return fetch(baseUrl + '/common/armies/next', params);
  },
  async getAreaList(params) {
    return fetch(baseUrl + '/common/areas', params);
  },
  async getArmyInfo(params) {
    return fetch(baseUrl + '/army/info', params, GET);
  },
  async addArmy(params) {
    return fetch(baseUrl + '/army/save', params, POST);
  },
  async editArmy(params) {
    return fetch(baseUrl + '/army/edit', params, POST);
  },
  async getLocation(params) {
    const url = 'http://restapi.amap.com/v3/geocode/geo';
    params.key = mapConfig.amapkey;
    params.s = 'rsv3';
    let res = outFetch(url, params);
    return res;
  }, 
  async getMemberList(params) {
    return fetch(baseUrl + '/army/member/list', params, GET);
  },
  async setToContact(params) {
    return fetch(baseUrl + '/army/member/admin', params, GET);
  },
  async addMember(params) {
    return fetch(baseUrl + '/army/member/save', params, POST);
  },
  async editMember(params) {
    return fetch(baseUrl + '/army/member/edit', params, POST);
  },
  async getMember(params) {
    return fetch(baseUrl + '/army/member/info', params, POST);
  },
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
