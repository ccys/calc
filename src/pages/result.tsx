import React from 'react'
import './result.less'
import { Button, WingBlank, Modal, WhiteSpace } from 'antd-mobile'
type PageProps = {
    floor: number,
    cost: number,
    offer: number,
    onClose: Function,
    isSaler: Boolean
}
export default class Result extends React.Component<PageProps, {}> {
    state = {
        see: false
    }
    clickCounter = 0
    timer: any
    handleIconClick() {
        if (!this.props.isSaler) return

        this.clickCounter++
        if (this.clickCounter >= 3) {
            Modal.alert('成交底价', this.props.floor + '元/月')
            return
        }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer)
            this.clickCounter = 0
        }, 500)
    }
    handleSeeClick() {
        this.setState({ see: !this.state.see })
    }
    render() {
        const { cost, offer, onClose, isSaler } = this.props
        const { see } = this.state
        return (
            <div className='resultPage'>
                <div className='result iconfont icon-dui' onClick={this.handleIconClick.bind(this)}></div>
                <div className='item'>您好，根据您的经营情况，报价如下</div>
                {/* 报价 */}
                <div className='item'><PriceLabel price={offer} /></div>
                {isSaler &&
                    <>
                        <div className='item' onClick={this.handleSeeClick.bind(this)}>战略客户优惠价<i className={`see iconfont ${see ? 'icon-ziyuan' : 'icon-ziyuan1'}`}></i></div>
                        {/* 成交价 */}
                        <div className='item'>{see && <PriceLabel price={cost} />}</div>
                    </>
                }
                <WhiteSpace size='lg'></WhiteSpace>
                <WingBlank>
                    <Button type='primary' onClick={e => onClose(e)}>重新询价</Button>
                </WingBlank>
            </div>
        )
    }
}

function PriceLabel(props: any) {
    return (
        <span className='price-label'><span className='price'>{props.price}</span>元/月</span>
    )
}