import React, { PureComponent } from 'react';
import API from '@/services/api';
import {
  Cascader
} from 'antd';

class ArmyCascader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
    this.preTarget = '';
  }
  displayRender(label, option) {
    if ((!this.preTarget || label.join() != this.preTarget.join()) && label.length < 4) {
      this.loadData(option, {areaCode: '', areaType: 1});
      this.preTarget = label;
    }
    return label.join(' / ');
  }
  loadData(selectedOptions) {
    let targetOption = [];
    if (selectedOptions.length !== 0) {
      targetOption = selectedOptions[selectedOptions.length - 1];
    } else {
      targetOption.value = '';
      targetOption.areaType = 0;
    }
    targetOption.loading = true;
    API.getAreaList({
      areaCode: targetOption.value,
      areaType: targetOption.areaType + 1
    }).then(res => {
      let tempList = res.data.map(item => {
        return {
          label: item.areaName,
          value: item.areaCode,
          areaType: item.areaType,
          isLeaf: targetOption.areaType > 2
        }
      });
      targetOption.loading = false;
      if (targetOption.length === 0) {
        this.setState({options: [...tempList]});
      } else {
        targetOption.children = tempList;
        this.setState({options: [...this.state.options]});
      }
    });
  }
  handleChange(value, option) {
    const onChange = this.props.onChange;
    if (onChange) {
      let labels = '';
      option.forEach((item) => {
        labels += item.label;
      })
      onChange(value, labels);
    }
  };
  render() {
    const {
      value,
      changeOnSelect
    } = this.props;
    const {options} = this.state;
    return (
      <Cascader 
          options={options}
          value={value}
          placeholder="请选择"
          loadData={this.loadData.bind(this)}
          displayRender={this.displayRender.bind(this)}
          onChange={this.handleChange.bind(this)}
          changeOnSelect ={changeOnSelect}/>
    );
  }
}

export default ArmyCascader;
