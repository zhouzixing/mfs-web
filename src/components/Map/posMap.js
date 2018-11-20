import React, { PureComponent } from 'react';
import {
  Modal,
  Input,
} from 'antd';
import { Map, Marker} from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation'
import config from './config';

const Search = Input.Search
const searchCls = {
  position: 'absolute',
  left: '10px',
  top: '15px'
}
class PosMap extends PureComponent{
  state = {
    visible: true,
    location: {longitude: 120.1797000000, latitude: 30.2071600000},
    clickable: true,
    draggable: true,
    address: ''
  };
  markEvents = {
    created: () => {
      const {address} = this.props;
      let _this = this;
      AMap.plugin('AMap.Geocoder',() => {
        _this.geocoder = new AMap.Geocoder();
        _this.handleSearch(address);
      })
    },
    dragend: e => this.getLocation(e)
  };
  // 拖动结束后获得的经纬度
  getLoaction(e) {
    const pos = e.lnglat;
    this.setState({
      location: {longitude: pos.lng, latitude: pos.lat}
    });
  }
  // 查询
  handleSearch(address) {
    const {preAddress} = this.props;
    this.setState({address});
    this.geocoder.getLocation(preAddress + address, (status, res) => {
      if (status === 'complete') {
        let pos = res.geocodes[0].location;
        this.setState({
          location: {
            latitude: pos.lat,
            longitude: pos.lng 
          }
        })
      }
    })
  }
  handleOK() {
    const {handleOK} = this.props;
    const {address, location} = this.state;
    handleOK(address, location);
  }
  render() {
    const {handleCancel, handleOK, modalVisible, address} = this.props;
    const {location, clickable, draggable} = this.state;
    return (
      <Modal
        destroyOnClose
        title="位置校准"
        visible={modalVisible}
        onOk={() => this.handleOK()}
        onCancel={handleCancel}
        width="800px"
      >
        <div style={{width:"100%",height:"400px"}}>
          <Map amapkey={config.amapkey} version={config.version} event={this.mapEvents} zoom={15} center={this.state.location}>
            <Marker
              events={this.markEvents}
              location={location} 
              clickable={clickable}
              draggable={draggable}
            />
            <div style={searchCls}>
              <Search
                style={{width: 280}}
                onSearch={value => this.handleSearch(value)}
                enterButton
                defaultValue={address}
              />
            </div>
          </Map>
        </div>
      </Modal>
    )
  }
}

export default PosMap;
