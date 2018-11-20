
import React, {Fragment} from 'react';
import { 
  Tabs, 
  Divider, 
  Modal, 
  Form,
  Popconfirm,
  message,
  Button,
  Input
} from 'antd';
import withRouter from 'umi/withRouter';
import style from './Army.less';
import API from '@/services/api';
import StandardTable from '@/components/StandardTable';
import {regexType} from '@/utils/utils';
import MfsUtil from '@/utils/mfsUtil';
import { Util } from 'bizcharts';
import { connect } from 'dva';
const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, onCancel, onOk } = props;
  const getFieldDecorator = form.getFieldDecorator;
  function handleOk() {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onOk(values);
      }
    })
  }
  return (
    <Modal
      destroyOnClose
      title="新建"
      visible={modalVisible}
      onOk={() => {handleOk()}}
      onCancel={onCancel}
    >
      <Form style={{ marginTop: 8 }}>
        <FormItem style={{marginBottom: 0}}>
            {getFieldDecorator('id', {
            })(<Input type='hidden' />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('memberName', {
            rules: [{ required: true, message: '请输入姓名！'}],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="职称">
          {form.getFieldDecorator('professionalTitle')(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号码'}, {pattern: regexType.mobile, message: '手机号格式有误' }],
          })(<Input type="number" placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="虚拟短号">
          {form.getFieldDecorator('phoneCornet')(<Input type="number" placeholder="请输入" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@withRouter
@connect(({ priArmy }) => ({
  priArmy,
}))
class TabStaff extends React.PureComponent {
  state = {
    memberList: [],
    loading: true
  }
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (val, row, index) =>{
        return index + 1; 
      }
    },
    {
      title: '姓名',
      dataIndex: 'memberName',
    },
    {
      title: '职称',
      dataIndex: 'professionalTitle',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '虚拟短号',
      dataIndex: 'phoneCornet',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, row) => {
        let contacts = row.postCode != 1 ? (<Fragment>
          <Popconfirm title={'确定设置' + row.memberName + '为负责人'} onConfirm={() => {
            API.setToContact({id: row.id}).then(res => {
                message.success('设置成功');
              })
            }} >
            <a href="#">负</a>
          </Popconfirm><Divider type="vertical" /></Fragment>) : ' ';
        console.log(contacts);
        return (<Fragment>
          {contacts}
          <a onClick={() => {}}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>)
      },
    },
  ];
  async componentWillMount() {
    let armyCode = this.props.match.params.armyCode;
    const res = await API.getMemberList({armyCode});
    if (res && res.data.list.length > 0) {
      this.setState({
        loading: false,
        memberList: res.data,
      })
    }
  };
  *edit() {
    MfsUtil.handleModalVisible.call(this, true);
    let res = yield API.getMember();
    let member = res.data;
    
  }
  handleSubmit = (values) => {
    values.armyCode = this.props.match.params.armyCode;
    let _this = this;
    this.props.dispatch({
      type: 'priArmy/submitMenberForm',
      payload: values,
      api: API.addMember,
      cb: () => {
        MfsUtil.handleModalVisible.bind(_this);
      },
    });
  }
  handleCancel = ()=> {
    MfsUtil.handleModalVisible.call(this);
  }
  render() {
    const {memberList, loading, modalVisible, dispatch} = this.state;
    return (
      <div className={style.centerForm} >
          <div className={style.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => {MfsUtil.handleModalVisible.call(this, true)}}>
              新建
            </Button>
          </div>
          <CreateForm onOk={values => {this.handleSubmit(values)}} onCancel={() => {this.handleCancel()}} modalVisible={modalVisible} />
          <StandardTable
            rowKey="id"
            loading={loading} 
            data={memberList}
            columns={this.columns}
          />
      </div>
    );
  }
}
  
export default TabStaff;