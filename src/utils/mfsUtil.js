import {message} from 'antd';

export default {
  handleModalVisible(flag) {
    this.setState({
      modalVisible: !!flag,
    });
  },
  *submitForm({ payload }, { call }, api, cb) {
    const response = yield call(api, payload);
    if (response.status != 100) {
      message.error(response.error);
    } else {
      message.success('提交成功');
      cb && cb();
    }
  }
}