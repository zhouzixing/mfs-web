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
import ArmyCascader from '@/components/Cascader/armyCascader';

import DynamicAdd from '@/components/Form/DynamicAdd';
import DetailAddress from '@/components/Form/DetailAddress';
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
    dutyPhoneList: [],
    requestList: []
  };
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const {dutyPhoneList} = this.state;
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
        params.longitude = values.location.longitude;
        params.latitude = values.location.latitude;
        
        dispatch({
          type: 'priArmy/submitArmyForm',
          payload: params,
        });
      }
    });
  };
  cbPhoneList(dutyPhoneList) {
    this.setState({
      dutyPhoneList
    });
  };
  render() {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
      form
    } = this.props;
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
            <DynamicAdd onChange={(res) => this.cbPhoneList(res)} form={form}/>
            <DetailAddress form={form} />
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
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => {router.push('/admin/army-manage')}}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddArmy;
