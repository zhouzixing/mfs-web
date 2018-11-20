import React from 'react';
import {regexType} from '@/utils/utils';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message
} from 'antd';
const FormItem = Form.Item;

class DynamicAdd extends React.PureComponent {
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
            dutyPhoneList: [{
                areaPhone: '',
                dutyPhone: '',
            }]
        }
       
    };
    onLinkWay = (index, type) => {
        const { form, onChange } = this.props;
        const { dutyPhoneList } = this.state;
        if (type === 'add') {
            let areaPhone = form.getFieldValue('areaPhone');
            let dutyPhone = form.getFieldValue('dutyPhone');
            if (!regexType.areaCode.test(areaPhone)) {
                message.warn('区号格式有误');
                return;
            }
            if (!regexType.telphone.test(dutyPhone)) {
                message.warn('值班电话格式有误');
                return;
            }
            let dutyItem = {
                areaPhone,
                dutyPhone
            };
            form.setFieldsValue({ 'areaPhone': '' });
            form.setFieldsValue({ 'dutyPhone': '' });
            if (dutyPhoneList.length > 5) {
                message.warn('值班电话最多添加5个');
                return;
            }
            dutyPhoneList.push(dutyItem);
            this.setState({
                dutyPhoneList: [...this.state.dutyPhoneList]
            })
        } else {
            dutyPhoneList.splice(index, 1);
            this.setState({
                dutyPhoneList: [...this.state.dutyPhoneList]
            })
        }
        onChange(this.state.dutyPhoneList);
    };
    componentWillReceiveProps(nextProps) {
        if (this.props.defaultValue != nextProps.defaultValue) {
            this.setState({dutyPhoneList: [...this.state.dutyPhoneList, ...nextProps.defaultValue]})
        }
    }
    render() {
        const {
            list,
            visible,
            form: { getFieldDecorator } 
        } = this.props;
        const {dutyPhoneList} = this.state;
        return (
            <FormItem {...this.formItemLayout} label='值班电话' style={{display: visible ? 'block': 'none'}}>
                {dutyPhoneList && dutyPhoneList.map((element, index) => (
                    <Row gutter={{ sm: 8, md: 14 }} key={index}>
                        <Col span={5}>
                            <FormItem >
                                {getFieldDecorator(`areaPhone${index || ''}`, {
                                    initialValue: element['areaPhone'],
                                })(
                                    <Input placeholder="区号" disabled={index > 0} />,
                                )}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem>
                                {getFieldDecorator(`dutyPhone${index || ''}`, {
                                    initialValue: element['dutyPhone'],
                                })(
                                    <Input placeholder="值班电话" disabled={index > 0} />,
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {index === 0 && <Button shape="circle" size="small" icon="plus" type="primary" onClick={() => this.onLinkWay(index, 'add')} />}
                            {index > 0 && <Button shape="circle" size="small" icon="minus" type="default" onClick={() => this.onLinkWay(index, 'minus')} />}
                        </Col>
                    </Row>
                ))}
            </FormItem>
        );
    }
}

export default DynamicAdd;