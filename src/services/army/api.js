import request from '@/utils/request';

export async function getArmyNames(params) {
  let armyNames = await request('/api/army/amryNames')
  return armyNames.filter(item => {
    return item.value.indexOf(params) != -1;
  });;
}

export async function getTableList() {
  return request('/api/army/armyList');
}