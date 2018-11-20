const user = {
    "status": 100,                    //状态码     100-成功 0-失败
    "unixTime": 1502344537630,            //时间戳
    "error": null,                //错误信息
    "data": {
        userInfo: {
            "id": 101,                    //id
            "userCode": "hangz_xszd",            //用户编码
            "phone": "13666666666",            //手机号
            "password": "123456",                //密码
            "userName": "赤子",                //用户名
            "userType": 1,                    //用户类型 1-消防队伍（现役） 2-专职队 3-微型站 4-联动单位
            "headUrl": null,       
        },
        armyInfo: {
            "armyType": 4,            //队伍类型 1-省队 2-支队 3-大队 4-中队
            "unitCode": "", // 单位号码 队伍就显示队伍code 微站显示微站code 运营人员为0
            "provinceCode": "330000000000",            //省份编码
            "provinceName": "浙江省"                //省份名称
        }
    }
  }