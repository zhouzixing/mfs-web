import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Tooltip,
  Row,
  Col,
  message
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Army.less';
import ArmyCascader from '@/components/Cascader/armyCascader';
import AreaCascader from '@/components/Cascader/areaCascader';
import PosMap from '@/components/Map/posMap';
import API from '@/services/api';
import DynamicAdd from '@/components/Form/DynamicAdd';
const InputGroup = Input.Group;
const FormItem = Form.Item;
const { Option } = Select;
const armyText = ['detachmentCode', 'groupCode'];
const areaText = ['provinceCode', 'cityCode', 'townCode', 'streetCode'];

@connect(({loading }) => ({
  submitting: loading.effects['priArmy/submitArmyForm'],
}))
@Form.create()
class AddArmy extends PureComponent {
  state = {
    dutyPhoneList: [{
      areaPhone: '',
      dutyPhone: '',
    }],

    requestList: [],
    modalVisible: false,
    address: '',
    preAddress: '',
    position: {}
  };
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const {dutyPhoneList, position} = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {
          armyName: values.armyName,
          adminName: values.adminName,
          adminPhone: values.adminPhone,
          detailAddress: values.detailAddress
        };
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
        // 队伍code转换---此处先默认写死为浙江
        params['provincialteamCode'] = '330000000000T';
        values.armyCodes.forEach((item, index) => {
          params[armyText[index]] = item;
        });
        params.longitude = position.longitude;
        params.latitude = position.latitude;
        
        dispatch({
          type: 'priArmy/submitArmyForm',
          payload: params,
        });
      }
    });
  };
  onLinkWay = (index, type) => {
    const { form } = this.props;
    const {dutyPhoneList} = this.state;
    if (type === 'add') {
      let areaPhone = form.getFieldValue('areaPhone');
      let dutyPhone = form.getFieldValue('dutyPhone');
      if (!/^0[0-9]{2,3}$/.test(areaPhone)) {
        message.warn('区号格式有误');
        return;
      }
      if (!/^[2-9][0-9]{6,7}$/.test(dutyPhone)) {
        message.warn('值班电话格式有误');
        return;
      }
      let dutyItem = {
        areaPhone,
        dutyPhone
      };
      form.setFieldsValue({'areaPhone': ''});
      form.setFieldsValue({'dutyPhone': ''});
      if (dutyPhoneList.length > 5) {
        message.warn('值班电话最多添加5个');
        return;
      }
      dutyPhoneList.push(dutyItem);
      this.setState({
        dutyPhoneList: [...this.state.dutyPhoneList]
      })
    } else {
      dutyPhoneList.splice(index, 1);
      this.setState({
        dutyPhoneList: [...this.state.dutyPhoneList]
      })
    }
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  openMap() {
    const { form } = this.props;
    let detailAddress = form.getFieldValue('detailAddress');
    let preAddress = form.getFieldValue('detailAddress')
    if (!detailAddress) {
      return message.error('请先填写详细地址');
    }
    this.setState({
      address: detailAddress
    });
    this.handleModalVisible(true);
  };
  getAreas(areas) {
    this.setState({
      preAddress: areas
    })
  };
  addPosition(position) {
    this.setState({
      position
    });
    this.handleModalVisible();
  };
  addrChange(e) {
    const {preAddress} = this.state;
    let address = e.target.address;
    API.getLocation({
      address: preAddress + address,
    }).then(res => {
      if (res && res.status === '1') {
        if (res.count === '0') {
          message.error('未定位到地址位置');
        } else {
          let pos = res.geocodes[0].location.split(',');
          this.setState({
            position: {
              longitude: pos[0],
              latitude: pos[1]
            }
          })
        }
      } else {
        message.error('高德数据请求失败');
      }
    })
  };
  render() {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const {dutyPhoneList, modalVisible, address, preAddress} = this.state;
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
      <PageHeaderWrapper
        title='基础数据'
        content='队伍基本信息填报'
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label='队伍'>
              {getFieldDecorator('armyName', {
                rules: [
                  {
                    required: true,
                    message: '请输入队伍名称',
                  },
                ],
              })(<Input placeholder='如：杭州支队' />)}
            </FormItem>
            <FormItem {...formItemLayout} label='值班电话'>
              {dutyPhoneList && dutyPhoneList.map((element, index) => (
                <Row gutter={{sm: 8, md: 14}} key={index}>
                  <Col span={5}>
                    <FormItem >
                      {getFieldDecorator(`areaPhone${index || ''}`, {
                        initialValue: element['areaPhone'],
                      })(
                        <Input placeholder="区号" disabled={index > 0}/>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem>
                      {getFieldDecorator(`dutyPhone${index || ''}`, {
                        initialValue: element['dutyPhone'],
                      })(
                        <Input placeholder="值班电话" disabled={index > 0}/>,
                        )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                      {index === 0 && <Button shape="circle" size="small" icon="plus" type="primary" onClick={() => this.onLinkWay(index, 'add')} />}
                      {index > 0 && <Button shape="circle" size="small" icon="minus" type="default" onClick={() => this.onLinkWay(index, 'minus')} />}
                  </Col>
                </Row>
              ))}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('areaCodes', {
                rules: [
                  {
                    required: true,
                    message: '请选择省市及街道',
                  },
                ],
              })(
                <AreaCascader
                getLabel={this.getAreas.bind(this)}
                placeholder="请选择"
                changeOnSelect />
              )}
              <FormItem label=''>
                <Row gutter={{sm: 8, md: 14}}>
                  <Col span={15}>
                    {getFieldDecorator('detailAddress', {
                      rules: [
                        {
                          required: true,
                          message: '请输入详细地址',
                        },
                      ],
                    })(<Input placeholder='详细地址' onChange={value => this.addrChange(value)} />)}
                  </Col> 
                  <Col>
                    <Button type="primary"  onClick={() => this.openMap()}>位置校准</Button>
                  </Col>
                </Row>
              </FormItem>
            </FormItem>
            <FormItem {...formItemLayout} label="辖区队伍">
              {getFieldDecorator('armyCodes', {
                rules: [
                  {
                    required: true,
                    message: '请选择辖区队伍',
                  },
                ],
              })(
                <ArmyCascader
                placeholder="请选择"
                changeOnSelect />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='联系人'>
              {getFieldDecorator('adminName', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系人',
                  },
                ],
              })(<Input placeholder='如：张三' />)}
            </FormItem>
            <FormItem {...formItemLayout} label='联系电话'>
              {getFieldDecorator('adminPhone', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系电话',
                  }, {
                    pattern: /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/,
                    message: '手机号码格式错误！',
                  }
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
        <PosMap modalVisible={modalVisible} preAddress={preAddress} address={address} 
          handleCancel={() => this.handleModalVisible()} 
          handleOK={(pos) => this.addPosition(pos)}
        ></PosMap>
      </PageHeaderWrapper>
    );
  }
}

export default AddArmy;
