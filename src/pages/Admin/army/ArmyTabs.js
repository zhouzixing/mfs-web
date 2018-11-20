
import React from 'react';
import { Tabs } from 'antd';
import TabBaseData from './TabBaseData';
import TabMenber from './TabMenber';

const TabPane = Tabs.TabPane;

class ArmyTabs extends React.PureComponent {
    constructor(props) {
      super(props);
      this.newTabIndex = 0;
      const panes = [
        { title: '基础数据', content: <TabBaseData></TabBaseData>, key: '1', closable: false},
        { title: '人员信息', content: <TabMenber></TabMenber>, key: '2', closable: false},
        { title: '图片信息', content: 'Content of Tab 3', key: '3', closable: false },
      ];
      this.state = {
        activeKey: panes[0].key,
        panes,
      };
    }
  
    onChange = (activeKey) => {
      this.setState({ activeKey });
    }
  
    render() {
      return (
        <Tabs
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="card"
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
        </Tabs>
      );
    }
  }
  
export default ArmyTabs;