import React, { PureComponent } from 'react';
import { connect } from 'dva';
import API from '@/services/api';
import {
  Cascader
} from 'antd';

@connect(({ user }) => ({
  user,
}))
class ArmyCascader extends PureComponent {
  state = {
    options: [],
    level: 3
  };
  componentDidMount() {
    this.getDetachmentList();
  }
  getDetachmentList() {
    const {user, level} = this.props;
    if (level) {
      this.setState({
        level
      });
    }
    API.getNextArmyList({
      armyCode: user.currentUser.unitCode,
      armyType: user.currentUser.armyType + 1
    }).then(res => {
      if (!res || !res.data) {
        return;
      }
      let tempList = res.data.map(item => {
        return {
          label: item.armyName,
          value: item.armyCode,
          armyType: item.armyType,
          isLeaf: false
        }
      })
      this.setState({
        options: tempList
      });
    });
  };
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const {level} = this.state;
    if (targetOption.armyType >= level) {
      return;
    }
    targetOption.loading = true;
    API.getNextArmyList({
      armyCode: targetOption.value,
      armyType: targetOption.armyType + 1
    }).then(res => {
      let tempList = res.data.map(item => {
        return {
          label: item.armyName,
          value: item.armyCode,
          armyType: item.armyType,
          isLeaf: (targetOption.armyType + 1 >= level) 
        }
      })
      targetOption.loading = false;
      targetOption.children = tempList;
      this.setState({
        options: [...this.state.options]
      });
    });
  };
  render() {
    const {
      changeOnSelect,
      onChange
    } = this.props;
    const {options} = this.state;
    return (
      <Cascader options={options}
          loadData={this.loadData}
          onChange={onChange}
          placeholder="请选择辖区队伍"
          changeOnSelect={changeOnSelect}/>
    );
  }
}

export default ArmyCascader;
