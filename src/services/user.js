import request from '@/utils/request';
import config from './config';
const baseUrl = config.SERVER_HOST;
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
