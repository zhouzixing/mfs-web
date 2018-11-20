import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  InputNumber,
  DatePicker,
  Modal,
  Badge,
  Divider,
  AutoComplete
} from 'antd';
const FormItem = Form.Item;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Army.less';
import StandardTable from '@/components/StandardTable';
import ArmyCascader from '@/components/Cascader/armyCascader';

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  }; 
  return (
    <Modal
      destroyOnClose
      title="新建"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ priArmy, user, loading }) => ({
  priArmy,
  user,
  loading: loading.models.priArmy,
}))
@Form.create()
class ArmyManage extends PureComponent {
  state = {
    modalVisible: false,
    stepFormValues: {},
  };
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      render: (val, row, index) =>{
        return index + 1; 
      }
    },
    {
      title: '队伍名称',
      align: 'center',
      dataIndex: 'armyName',
    },
    {
      title: '辖区支队',
      align: 'center',
      dataIndex: 'detachmentName',
      render: (val) =>{
        return val || '/'; 
      }
    },
    {
      title: '辖区大队',
      align: 'center',
      dataIndex: 'groupName',
      render: (val) =>{
        return val || '/'; 
      }
    },
    {
      title: '添加日期',
      align: 'center',
      dataIndex: 'createTime',
      render: val => {
        return <span>{moment(val).format('YYYY-MM-DD')}</span>
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, row) => (
        <Fragment>
          <a onClick={() => {this.openOperate('look', row.armyCode)}}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => {this.openOperate('edit', row.armyCode)}}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
      ),
    },
  ];
  openOperate(type, armyCode) {
    if (type === 'edit') {
      router.push(`/admin/army-manage/edit-army/${armyCode}`)
    }
    if (type === 'look') {
      router.push(`/admin/army-manage/look-army/${armyCode}`)
    }
    this.props.dispatch({
      type: 'priArmy/changeOperate',
      payload: type
    })
  }
  handleSearch = e => {
    e && e.preventDefault();
    const { dispatch, form, user } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      let params = {};
      if (fieldsValue.armyCodes) {
        params['detachmentCode'] = fieldsValue.armyCodes[0];
        params['groupCode'] = fieldsValue.armyCodes[1];
      }
      params.armyName = fieldsValue.armyName;
      dispatch({
        type: 'priArmy/getArmyInfoList',
        payload: {...params, 'provincialteamCode': user.currentUser.unitCode},
      });
    });
  };
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    document.getElementsByClassName('ant-cascader-picker-clear')[0].click();
    this.handleSearch();
  };
  selectArmyName = value => {
    console.log('selectArmyName', value);
  };
  renderForm() {
    const {
      form: { getFieldDecorator },
      priArmy: { selectArmyNames },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} className={styles.marginBottom} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="队伍名称">
              {getFieldDecorator('armyName')(<Input placeholder="请输入队伍名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="辖区队伍">
              {getFieldDecorator('armyCodes')(
                <ArmyCascader
                    placeholder="请选择辖区队伍"
                    changeOnSelect />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };
  
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      }
    });
    message.success('添加成功');
    this.handleModalVisible();
  };
  render() {
    const {
      priArmy: { selectArmyNames, amryInfoList },
      loading,
    } = this.props;
    const {modalVisible} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.addArmy
    };
    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => {router.push('/admin/army-manage/add-army')}}>
                新建
              </Button>
            </div>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
            <StandardTable
              rowKey="armyCode"
              loading={loading} 
              data={amryInfoList}
              columns={this.columns}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ArmyManage;
