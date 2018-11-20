
import React from 'react';
import { Tabs } from 'antd';


class TabImage extends React.PureComponent {
  
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
  
export default TabImage;