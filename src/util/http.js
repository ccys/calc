import { urlEncode } from "./util"

const BASE_URL = 'https://www.fastmock.site/mock/0834d4826d5be6de92173193ca42e1b9'

export function httpGet(url, params) {
    return fetch(BASE_URL + url + '?' + urlEncode(params)).then(res => res.json())
}
export function httpPost(url, params) {
    return fetch(BASE_URL + url, {
        method: 'POST',
        body: JSON.stringify(params)
    }).then(res => res.json())
}