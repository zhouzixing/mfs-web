
import React from 'react';
import {centerFormLayout} from '@/utils/utils';
import style from './Army.less';
import DynamicAdd from '@/components/Form/DynamicAdd';
import DetailAddress from '@/components/Form/DetailAddress';
import router from 'umi/router';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import API from '@/services/api';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
} from 'antd';
const FormItem = Form.Item;
const areaText = ['provinceCode', 'cityCode', 'townCode', 'streetCode'];

@connect(({loading, priArmy}) => ({
  priArmy,
  submitting: loading.effects['priArmy/editArmyForm'],
}))
@withRouter
@Form.create()
class TabBaseData extends React.PureComponent {
  state = {
    dutyPhoneList: [],
    army: {},
    areaData: {},
  }
  componentWillMount() {
    this.getArmyInfo();
  }
  getArmyInfo() {
    API.getArmyInfo({armyCode: this.props.match.params.armyCode}).then(res => {
      let army = res.data;
      let dutypones = army.dutyPhones? army.dutyPhones.split(',') : [];
      let areaPhones = army.areaPhones? army.areaPhones.split(',') : [];

      army.armyNames = this.getArmyNames(army);
      army.areaNames = this.getAreaNames(army);
      army.dutyPhoneList = [];
      for (let i = 0; i < dutypones.length; i++) {
        army.dutyPhoneList.push({dutyPhone: dutypones[i], areaPhone: areaPhones[i]});
      }
      this.getAreaData(army);
      this.setState({
        army
      });
    })
  }
  getAreaData(army) {
    let areaCodes = [army.provinceCode, army.cityCode, army.townCode, army.streetCode];
    let address = army.detailAddress;
    let location = {
      longitude: army.longitude,
      latitude: army.latitude
    };

    this.setState({
      areaData: {
        areaCodes,
        address,
        location
      }
    })
  }
  // 获取辖区队伍名字 如: 浙江总队/杭州支队/萧山大队
  getArmyNames(army) {
    const armyText = ['provincialteamName','detachmentName', 'groupName'];
    let armyNames = army[armyText[0]];
    for (let i = 1; i < army.armyType - 1; i++) {
      armyNames += '/' + army[armyText[i]];
    }
    return armyNames;
  }
  getAreaNames(army) {
    const areaText = ['provinceName','cityName', 'townName', 'streetName'];
    let areaNames = '';
    areaText.forEach(item => {
      areaNames += army[item] + '/';
    })
    return areaNames;
  }
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {dutyPhoneList, army} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      let params = {};
      // 值班电话和区号
      dutyPhoneList.forEach((item, i) => {
        if (i > 0) {
          params[`dutyPhoneList[${i}].areaPhone`] = item.areaPhone;
          params[`dutyPhoneList[${i}].dutyPhone`] = item.dutyPhone;
        }
      });
      // 地区code转换
      values.areaCodes.forEach((item, index) => {
        params[areaText[index]] = item;
      });

      params.longitude = values.location.longitude;
      params.latitude = values.location.latitude;
      params.armyCode = army.armyCode;
      params.detailAddress = values.detailAddress;
      dispatch({
        type: 'priArmy/editArmyForm',
        payload: params,
      });
    })
  };
  cbPhoneList(dutyPhoneList) {
    this.setState({
      dutyPhoneList
    });
  };
  render() {
    const {form, submitting, priArmy: {operate}} = this.props;
    const {army, areaData} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <div className={style.centerForm} >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label='队伍名称'>
            <label>{army.armyName}</label>
          </FormItem>
          <DynamicAdd visible={operate === 'edit'} onChange={(res) => this.cbPhoneList(res)} form={form} defaultValue={army.dutyPhoneList}/>
          <DetailAddress visible={operate === 'edit'} form={form} 
            areaCodes={areaData.areaCodes} 
            address={areaData.address}
            location={areaData.location}
          />
          <FormItem {...formItemLayout} label='值班电话' style={{display: operate === 'look' ? 'block': 'none'}} >
            <label>{army.totalPhones || ''}</label>
          </FormItem>
          <FormItem {...formItemLayout} label='详细地址' style={{display: operate === 'look' ? 'block': 'none'}} >
            <label>{army.areaNames}</label>
            <FormItem {...formItemLayout} style={{marginBottom: 0}}>
              <label>{army.detailAddress}</label>
            </FormItem>
          </FormItem>
          <FormItem {...formItemLayout} label='辖区队伍'>
            <label>{army.armyNames}</label>
          </FormItem>
          <FormItem {...formItemLayout} label='联系人'>
            <label>{army.adminName}</label>
          </FormItem>
          <FormItem {...formItemLayout} label='联系电话'>
            <label>{army.adminPhone}</label>
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}  style={{display: operate === 'edit' ? 'block': 'none'}} >
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => {router.push('/admin/army-manage')}}>
                取消
              </Button>
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}  style={{display: operate === 'look' ? 'block': 'none'}} >
              <Button type="primary" style={{ marginLeft: 8 }} onClick={() => {router.push('/admin/army-manage')}}>
                关闭
              </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default TabBaseData;
