// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/army/amryNames':[
      {
        key: '0',
        value: '杭州支队',
      },
      {
        key: '1',
        value: '上城大队',
      },
      {
        key: '2',
        value: '萧山大队',
      },
      {
        key: '3',
        value: '湖州支队',
      },
      {
        key: '4',
        value: '金华大队',
      },
      {
        key: '5',
        value: '复兴中队',
      },
      {
        key: '6',
        value: '浙江总队',
      },
    ],
  'GET /api/army/armyList': {
      data: {
        list: [{
          armyName: '杭州支队',
          armyCode: '1',
          group: '/',
          detachement: '/',
          addDate: '2018-6-7'
        }, {
          armyName: '上城大队',
          armyCode: '2',
          group: '/',
          detachement: '杭州支队',
          addDate: '2018-6-30'
        }, {
          armyName: '复兴中队',
          armyCode: '3',
          group: '上城大队',
          detachement: '杭州支队',
          addDate: '2018-6-10'
        }, {
          armyName: '吴兴中队',
          armyCode: '4',
          group: '西湖大队',
          detachement: '杭州支队',
          addDate: '2018-5-7'
        }, {
          armyName: '解放大队',
          armyCode: '5',
          group: '/',
          detachement: '湖中支队',
          addDate: '2018-6-17'
        }],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 5
        }
      }
    }
};
