import { httpPost } from "./http"

const User = {
    login() { // 静默授权
        const code = this.getQueryVariable('code') // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
        const local = window.location.href
        if (code == null || code === '') {
            const appId = ''
            const redirect_uri = encodeURIComponent(local)
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=#wechat_redirect`
        } else {
            return this.getUserInfo(code) //把code传给后台获取用户信息
        }
    },
    async getUserInfo(code) { // 通过code获取 openId等用户信息
        try {
            const res = await httpPost('/api/login', { code: code })
            // todo 存储用户信息
            return res
        }
        catch (error) {
            console.log(error)
        }
    },
    // 获取当前url参数
    getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === variable) { return pair[1]; }
        }
        return (false);
    }
}
export default User