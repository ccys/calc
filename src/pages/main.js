import React from 'react'
import './main.less'
import { List, InputItem, Picker, Button, WingBlank, WhiteSpace, Toast, Modal, ActivityIndicator } from 'antd-mobile';
import { createForm } from 'rc-form';
import { httpPost } from '../util/http';
import { calcPrice, isNumber } from '../util/util';
import Result from './result';
import User from '../util/user';

const CodeInterval = 10;
const datas = require('../assets/datas.json')

class Main extends React.Component {
    state = {
        loading: true,
        codeDisabled: false,
        codeBtnText: '获取验证码',
        hasSendMsg: false,
        priecs: {},
        showResult: false,
        isSaler: false, // 是否是营销人员
        validPhone: false // 是否验证手机号
    }
    componentDidMount() {
        User.login().then(async res => {
            this.setState({
                loading: false,
                validPhone: res.type === 0,
                isSaler: res.type === 1
            })
        })
    }
    typeData = datas.type.map(each => { return { label: each.label, value: each } })
    cityData = datas.city.map(each => { return { label: each.label, value: each } })
    submit() {
        this.props.form.validateFields().then(values => {
            // console.log('form valid success', JSON.stringify(values))
            const priecs = calcPrice(values.area, values.year, values.sales, values.shopType[0].value, values.city[0].value)
            this.setState({ priecs })
            httpPost('/api/submit', priecs).then(res => {
                this.showResult()
            }, err => {
                console.log(err)
            })
        }, ({ errors }) => {
            // console.log('errs', errors)
            for (let field in errors) {
                Toast.fail(this.props.form.getFieldError(field)[0], 1, null, false)
                break
            }
        })
    }
    getCode() {
        if (this.state.codeDisabled) {
            return false;
        }

        const phone = this.props.form.getFieldValue('phone')
        if (!phone) {
            Toast.fail('请输入手机号', 2, null, false)
            return
        }

        this.setState({
            codeDisabled: true
        })

        httpPost('/api/getCode', { mobile: this.state.phone }).then(() => {
            this.setState({
                hasSendMsg: true,
            })

            let restTime = CodeInterval

            let codeSendInterval = setInterval(() => {
                if (restTime === 0) {
                    this.setState({
                        codeBtnText: '重发验证',
                        codeDisabled: false
                    })
                    clearInterval(codeSendInterval);
                    return;
                }
                this.setState({
                    codeBtnText: `${restTime}秒后重新获取`,
                })
                restTime--;
            }, 1000);
            Toast.success('验证码已发送', 1)
        }, error => {
            console.log(error)
            Modal.alert('', error.error)
            this.setState({
                codeDisabled: false
            })
        });
    }
    showResult() {
        this.setState({ showResult: true })
    }
    closeResult() {
        this.setState({ showResult: false })
    }
    // 字符串转合法数字
    numberNormalize(val) {
        const num = Number(val)
        if (val === '' || !isNumber(num)) {
            return val
        }
        return num
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { showResult, priecs, isSaler, validPhone, loading } = this.state
        return (
            <form className='mainPage'>
                <List renderHeader={() => '店铺信息'}>
                    <InputItem
                        type='number'
                        editable={true}
                        placeholder="请输入面积"
                        {...getFieldProps('area', {
                            validateTrigger: 'onBlur',
                            normalize: e => this.numberNormalize(e),
                            rules: [{
                                required: true,
                                type: 'number',
                                min: 50,
                                max: 3500,
                                message: '面积为50到3500之间的整数'
                            }],
                        })}
                        extra='平方米'
                    >面积</InputItem>
                    <InputItem
                        type='number'
                        editable={true}
                        placeholder="请输入年限"
                        {...getFieldProps('year', {
                            normalize: e => this.numberNormalize(e),
                            rules: [{
                                required: true,
                                message: '请填写年限'
                            }],
                        })}
                        extra='年'
                    >年限</InputItem>
                    <InputItem
                        type='number'
                        editable={true}
                        placeholder="请输入月销售额"
                        {...getFieldProps('sales', {
                            normalize: e => this.numberNormalize(e),
                            rules: [{
                                required: true,
                                message: '请填写月销售额'
                            }],
                        })}
                        extra='万'
                    >月销售额</InputItem>
                    <Picker
                        {...getFieldProps('shopType', {
                            rules: [{
                                required: true,
                                message: '请选择品类'
                            }],
                        })}
                        data={this.typeData}
                        cols={1}
                        title="选择品类"
                        extra="请选择"
                    >
                        <List.Item arrow="horizontal">选择品类</List.Item>
                    </Picker>
                    <Picker
                        {...getFieldProps('city', {
                            rules: [{
                                required: true,
                                message: '请选择城市'
                            }],
                        })}
                        data={this.cityData}
                        cols={1}
                        title="选择城市"
                        extra="请选择"
                    >
                        <List.Item arrow="horizontal">所在城市</List.Item>
                    </Picker>
                </List>
                {validPhone &&
                    <List renderHeader={() => '用户信息'}>
                        <InputItem
                            maxLength={4}
                            editable={true}
                            placeholder="请输入联系人"
                            {...getFieldProps('name', {
                                rules: [{
                                    required: true,
                                    message: '请填写联系人'
                                }],
                            })}
                        >联系人</InputItem>
                        <InputItem
                            type='number'
                            maxLength={11}
                            editable={true}
                            placeholder="请输入手机号"
                            {...getFieldProps('phone', {
                                rules: [{
                                    required: true,
                                    message: '请填写手机号'
                                }],
                            })}
                        >手机号</InputItem>
                        <InputItem
                            type='number'
                            editable={true}
                            placeholder="请输入验证码"
                            {...getFieldProps('smsCode', {
                                rules: [{
                                    required: true,
                                    message: '请填写验证码'
                                }],
                            })}
                            extra={
                                <span className={`btn_code ${this.state.codeDisabled && 'disabled'}`} onClick={this.getCode.bind(this)}>{this.state.codeBtnText}</span>
                            }
                        >验证码</InputItem>
                    </List>
                }
                <WhiteSpace size='xl'></WhiteSpace>
                <WingBlank>
                    <Button type='primary' onClick={this.submit.bind(this)}>查询</Button>
                </WingBlank>
                {showResult && <Result {...priecs} isSaler={isSaler} onClose={this.closeResult.bind(this)}></Result>}
                <ActivityIndicator
                    toast
                    text="正在加载..."
                    animating={loading}
                />
            </form>
        )
    }
}
export default createForm()(Main)