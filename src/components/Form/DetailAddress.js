import React from 'react';
import { regexType } from '@/utils/utils';
import AreaCascader from '@/components/Cascader/areaCascader';
import API from '@/services/api';
import PosMap from '@/components/Map/posMap';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message
} from 'antd';
const FormItem = Form.Item;
class DetailAddress extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formItemLayout = {
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
        
        this.state = {
            modalVisible: false,
            address: '',
            preAddress: '',
            location: {},
            areaCodes: []
        };
    }
    addrChange(e) {
        const { preAddress } = this.state;
        let address = e.target.value;
        API.getLocation({
            address: (preAddress || '') + address,
        }).then(res => {
            if (res && res.status === '1') {
                if (res.count === '0') {
                    message.error('未定位到地址位置');
                } else {
                    let pos = res.geocodes[0].location.split(',');
                    this.setLocation({
                        longitude: pos[0],
                        latitude: pos[1]
                    });
                }
            } else {
                message.error('高德数据请求失败');
            }
        })
    };
    setLocation(location) {
        const {form} = this.props;
        form.setFieldsValue({ location });
        this.setState({
            location
        })
    }
    // 获取地区的文本地址， 在点击打开地图前已经获得
    getAreas(value, areas) {
        this.setState({
            preAddress: areas
        });
    };
    openMap() {
        const { form } = this.props;
        let detailAddress = form.getFieldValue('detailAddress');
        if (!detailAddress) {
            return message.error('请先填写详细地址');
        }
        this.setState({address: detailAddress});
        this.handleModalVisible(true);
    };
    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };
    cbLocation(address, location) {
        const { form } = this.props;
        form.setFieldsValue({'detailAddress': address});
        this.setLocation(location);
        this.handleModalVisible();
    };
    componentWillReceiveProps(nextProps) {
        const {areaCodes, address, form, location, preAddress} = nextProps;
        if (areaCodes != this.props.areaCodes) {
            this.setState({
                areaCodes,
                address,
                preAddress,
                location
            });
        }
    };
    render() {
        const {
            form: { getFieldDecorator },
            form
        } = this.props;
        const {modalVisible, preAddress, address, areaCodes, location, visible} = this.state;
        return (
            <FormItem {...this.formItemLayout} label="详细地址" style={{display: visible ? 'block': 'none'}}>
                {getFieldDecorator('areaCodes', {
                    rules: [
                        {
                            required: true,
                            message: '请选择省市及街道',
                        }],
                        initialValue: areaCodes
                })(
                    <AreaCascader
                        onChange={this.getAreas.bind(this)}
                        placeholder="请选择"
                        changeOnSelect={true}
                        form={form}
                    />
                )}
                <FormItem label='' style={{marginBottom: 0}}>
                    <Row gutter={{ sm: 8, md: 14 }}>
                        <Col span={15}>
                            {getFieldDecorator('detailAddress', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入详细地址',
                                    },
                                ],
                                initialValue: address
                            })(<Input placeholder='详细地址' onChange={value => this.addrChange(value)} />)}
                        </Col>
                        <Col>
                            <Button type="primary" onClick={() => this.openMap()}>位置校准</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem style={{marginBottom: 0}}>
                    {getFieldDecorator('location', {
                        initialValue: location
                    })(<Input type='hidden' />)}
                </FormItem>
                <PosMap modalVisible={modalVisible} preAddress={preAddress} address={address}
                    handleCancel={() => this.handleModalVisible()}
                    handleOK={(addr, laction) => this.cbLocation(addr, laction)}
                ></PosMap>
            </FormItem>
        );
    }
}

export default DetailAddress;
