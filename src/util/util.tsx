/**
 * 计算低价、成本、报价
 * 
 * @param area 面积
 * @param year 年限
 * @param sales 月销售额
 * @param typeC 品类系数
 * @param cityC 城市系数
 */
export function calcPrice(area: number, year: number, sales: number, typeC: number, cityC: number) {
    let basePrice = 0 // 标准报价
    let floorPrice = 0 // 成交底价==成交底价（标准报价）*品类系数*城市系数
    let costPrice = 0 // 成交价=成交底价*成交价系数
    let offerPrice = 0 // 报价=成交价*报价系数
    let costC = 1 // 成交价系数
    let offerC = 1 // 报价系数
    if (area < 50) {
        return false
    }
    if (area < 100) {
        basePrice = (area / 50 * 200 + 100) * (year / 3 * 0.15 + 0.85) * (sales / area / 1500 * 0.1 + 0.9)
        costC = 1.18
        offerC = 1.25
    }
    if (area < 200) {
        basePrice = (area / 150 * 300 + 270) * (year / 3 * 0.15 + 0.85) * (sales / area / 1300 * 0.15 + 0.85)
        costC = 1.15
        offerC = 1.2
    }
    if (area < 400) {
        basePrice = (area / 300 * 530 + 280) * (year / 3 * 0.15 + 0.85) * (sales / area / 1200 * 0.15 + 0.85)
        costC = 1.15
        offerC = 1.2
    }
    if (area < 800) {
        basePrice = (area / 600 * 900 + 350) * (year / 3 * 0.15 + 0.85) * (sales / area / 1000 * 0.05 + 0.95)
        costC = 1.15
        offerC = 1.2
    }
    if (area < 1400) {
        basePrice = (area / 1100 * 1400 + 500) * (year / 3 * 0.15 + 0.85) * (sales / area / 900 * 0.15 + 0.85)
        costC = 1.12
        offerC = 1.2
    }
    if (area < 2300) {
        basePrice = (area / 1900 * 2200 + 600) * (year / 3 * 0.15 + 0.85) * (sales / area / 700 * 0.15 + 0.85)
        costC = 1.12
        offerC = 1.2
    }
    if (area <= 3500) {
        basePrice = (area / 2800 * 3000 + 800) * (year / 4 * 0.15 + 0.85) * (sales / area / 700 * 0.15 + 0.85)
        costC = 1.12
        offerC = 1.2
    }
    floorPrice = basePrice * typeC * cityC
    costPrice = floorPrice * costC
    offerPrice = costPrice * offerC
    // console.log('calc result: ', basePrice, floorPrice, costPrice, offerPrice)
    return {
        floor: floorPrice.toFixed(0),
        cost: costPrice.toFixed(0),
        offer: offerPrice.toFixed(0)
    }
}

/** 
 * param 将要转为URL参数字符串的对象 
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */
export function urlEncode(param: any, encode = true) {
    if (param == null) return '';
    const paramAry = [];
    for (const i in param) {
        paramAry.push(i + '=' + (encode ? encodeURIComponent(param[i]) : param[i]))
    }
    return paramAry.join('&');
}

export function isNumber(obj: any) {
    return typeof obj === 'number' && !isNaN(obj)
}
