/*
 东呈会app签到
 积分可兑换话费、签到14天换爱奇艺会员月卡、实物等，详见任务兑换页面，小毛，看不上的就算了
 ----------------------------------
 Author：不吃咖喱鸡           
 Last Update Date：2022.03.13   
 ----------------------------------
 目前只有每日签到，一天一次，自己定时
 没有设置重写，只测试了青龙，理论上V2P也能用
 app签到页面，先领取任务，抓包cookie，没有测试关键参数，所以将cookie全部填入变量变量dchCookie，多账号用@隔开，例子：export dchCookie='xxxxxxxxxxxxxx'
*/

const jsname = '东呈会'
const $ = Env(jsname)
const notifyFlag = 1; //0为关闭通知，1为打开通知,默认为1
const notify = $.isNode() ? require('./sendNotify') : '';
let notifyStr = ''
let httpResult = ''
let userCookie = ($.isNode() ? process.env.dchCookie : $.getdata('dchCookie')) || '';
let userCookieArr = []

!(async () => {
    if (typeof $request !== "undefined") {
        $.msg(jsname + ': 没有设置重写，请看脚本注释')
    }
    else {
        if (!(await checkEnv())) {
            return
        }
        await Userinfo()
        await showmsg()
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

//notify
async function showmsg() {
    notifyBody = jsname + "运行通知\n" + notifyStr
    if (notifyFlag != 1) {
        console.log(notifyBody);
    }
    if (notifyFlag == 1) {
        $.msg(notifyBody);
        if ($.isNode()) { await notify.sendNotify($.name, notifyBody); }
    }
}

//check env
async function checkEnv() {
    if (userCookie) {
        if (userCookie.indexOf('@') > -1) {
            let userCookies = userCookie.split('@')
            for (let i = 0; i < userCookies.length; i++) {
                userCookieArr.push(userCookies[i])
            }
        } else {
            userCookieArr.push(userCookie)
        }
    } else {
        console.log('未找到userCookie')
        return false
    }
    if (userCookieArr.length == 0) {
        console.log('未找到有效的userCookie')
        return false
    }
    console.log(`\n共找到${userCookieArr.length}个用户\n`)
    return true
}

//useinfo
async function Userinfo() {
    for (userIdx = 0; userIdx < userCookieArr.length; userIdx++) {
        notifyStr += `\n===用户【${userIdx + 1}】 签到信息===\n`
        await docheckin()
    }
}

//checkin
async function docheckin() {
    let tmpCk = userCookieArr[userIdx]
    let urlObject = populateGetUrl(tmpCk)
    await httpGet(urlObject)
    let result = httpResult;
    if (!result) return
    notifyStr += `状态：: ${result.message}\n`
}

//geturl
function populateGetUrl(tmpCk) {
    let urlObject = {
        url: 'https://campaignapi.dossen.com/selling/checkin/do?blackbox=tdfpeyJ2IjoiY3YrdG1ieFhIRm8vR0RPQVJldkk0aHZiV0VsQ1cwY1pFRi9MTWtPT0x1WEdVUnZ4bm41alpvS0l5SDJQR04rZCIsIm9zIjozLCJlIjozLCJkIjoie1wicGFydG5lclwiOlwiZG9zc2VuXCIsXCJhcHBfbmFtZVwiOlwiZG9zc2VuX2g1XCIsXCJ0b2tlbl9pZFwiOlwiZG9zc2VuLTE2NDA3OTU0NDgyNzQtY2ViZDAyY2Q2MmQ2ODhcIixcImlcIjpcIkt3djVtL1NUNmVHb3NBcWlGcWdheFF3aHZMRG5wMEtDT0ZCSFRrVEpocVJtRktURUJoWkQ2d25pYkZ1Wm1VUmhUb2JsU1pGc1ZJTkxGT0hYT0xqcTdLOGtHS0VRNTVvWjVXNng3d0dyTFJMTFBobldFMVJTLzJpeFQ0Tjh1ZzhzcDdFc1Y5NGQwaE9-dGNXVFNEL2NEWUlwRjFrZENCcHk0YjJRM2dGWFhZRXI2b3FUNElnTURRZnRTR0M0eDhNUmtxbzJzOVVDNnlkWDltdVdLZkJrbFhySWN6SXUyRlpFeVJBaGRqOG85TmpybFVDREVNaG9VcmIvR1dXYVdzcEJRTGF1QnRMQU9Pa2ltSXBrfng1VFBkdkVQa1B3WnlMWE11VXJHU1JzVEpRNUNDRndXMU1aWjYwZ21wZTQvdkpMbU1FYXYyRFhLNGhnMGlZTU9iWjlQYXVucHdKdHVkUTByTmwvMkozTWRnRkwxRVpERkJiazZKaVlKNm5-TVdTajhiNXRnQW5DVEVIMmdFQm5RQzdmOVJmeDlTRGRmRWwvb1VScHE1aW82VFJ5VG5GSjdCYWJrVGtSSFIyRWRzVXljY3FqR2Y3bUtaM3Q0UVJ0SEtTMUcyRS9VVG5DbTc3U3BZaFNVUGdKRzdyME5PVGVFV1FGdkhndGlkdDlNbllXT1VQOUkyQWRIc2U9XCIsXCJqXCI6XCJ-c3h1REExemR6RFBFL2ptQ35pWFc5TmtsOWV5Q0hxMzI0SUNFM2d2NzEwejV0UDJFMjhkbkV4bmdwZk9jYzRDT3I4Nzc4d0xxa1dtVWQ5bTlHNDNHbXZ2NXZEREt5ZmMyU1JWUUVDc3dXb3dNbENDZmVMfnBGVGViYm1UaXR6Yng3MGk3alM0SUNJY2dacnpaa1dteGpEOGxqNERCSnBGdXRST1FNVHBtOEZXZUxVflJ5OVF0enRxQkZ5Z1RhNm02U0prU0Fac2pMZXkwYjhNblNiVTBEMFl1d3lCWDNvUkhscHcyUWxwb0pINVhUN2hjd0pVSUdNeEJQR09nNjlObW10Ym1MTkZpa3hXaENlfkxtbllRMmtMOGlYNE0zL1BKdDM5dHFKMEJqYk1zNXN4d1FCSnNzaUNwVDFKenNWU0FrYVNuc3lyNmFzRExrVHg4UGtML1VFYWFDdmZIVkw2azQ5MnF0dHZHVXFaN2NSL015Uzg2Z3l1V3pOWmk3NlNGcVRaTzZsZzdnfk5oRkl2TVFHYWtkVkNMaEtXd0I3fkNtYX5FU29OVE1xZTk4b1lqZlh5WDM5UU1UTWVNaFVVLzRZQ3dqZDV-ZklCZ0lTL35rSklEakRTUy9udDlNcmwyeTZGYmJBZkYzQzVOSmN0by92T1l-NnRmZUFkZ3FEY3hNdDFab0kvYUxFRXV6Y0h5R3AvM243WGZ0QS9aeUtodVQ4YjM3NUd4cDRqeGpnfmNDcmJ1TENheElkZUdNb2FtanpjR1ZrYmlxYmRKM2hPRVZoY2k4azIzRjE3ZWVaNFljd1pGWmR3NkRHPVwiLFwia1wiOlwiamNjUVlEWVN4NzB2UX44NjlSdWVoYkFzSjBEUUd6VTExNU1HbDRCbUlvR1N2UDExZUhtTEdaN0NEMElSZW5wYmZFQzgzTW9zS21RZFdhbTEvT3BIdFZWaVJxRG9nSW83WFlkdHp5WEtIMTAzbjVYOFNLT2FJVkJ-S0JxMHFJQkdJYzhJdDFJSklFcFBJMDg5TnRHdkY0RldGU3RmVFFwdXZPbFFyTEg2RmtLcHJnWn54MmVJeEpSYW11R0RGSXRERUZOZWlEaFpmUTF2ZERNOXRSYWFDcmdHVGZ6anpRaWtOcmRrY2F5VWswZT1cIixcImxcIjpcIkZZbEV5Uk9pZjd5aDJJMGpRS2MvWXZ4L1FkQU5sd0JZM1dWOXhVUnRYfkdCOHNYb0c3dFZKNzJhSXE0d2wvM2FJQjUwdU9ZSzhJUTlYU2ZjT3JFbn5yYUtBR0owcExyWWxqT056T2loTjBIN0NaVEFvSkF1VDRlajZxY3FUUWlrcnZLVW1PVElOSWk9XCIsXCJvXCI6XCIwVUFwblhRZUg1NmFRVFY2cXA1bTA3Mm1HYkZzUEcwS2NZZVpadmF3SjRLUGJnby9PYUd0L1UxTjNoVG5wVUFxUWJXc0IxMU1QdHJwQUF4djR6QUZaWmw2VFRId09NRWFmR3VOSkl2NEI2QX5CZkY0THFTYUNNRTg4MGM3LzV4d2JYZDJYZmRuRENYeTgwN0ZraWtUczBiR2M2dExJRjJYQ0JUMkxGWFU2anJOMVBHZ25oZkVuVWNYWXRVaEc2NE9RVTdLRS84MlBXUVBwaVdzV0RSNzhQNUdyOHV4TFYxNVVPQWFpNFk4djlxTjVWeXBwNm1tNloySVpMWmE0fkdtbFcweVZ1MUZiTUFRTmtHMTd4eGliTzNDc1I0SFJLRmVXZXdmY1VhYW5uSDdCUk9-b2ptemNjTTlZbDNVTE50cmJqL0V4OFZoNXVIa1NQalJjenB3WW40QXFaQ2ZJWWhCVFZ4bndYRFgzVjlKczlGTFdteUM0L3lJUjB5cGR5dzhkZC9VWHlYWmx3flVOZUc4TTVvUVV6UXZobmM5bzJBNVwiLFwiZlwiOlwibVhhbXNlfmozeS90anB4Szk2eEx4Rz09XCIsXCJlXCI6XCJSN2FITG55Y0pYRFVYQVZXNU1nNHFOY0hXcEFRZk5DM08vejJzOWRvUnNLNEdsSHF0NVVIRkU3Sms0RlV3cm0rM1ZtWEZ4MTJ3RFNMSWhFdy9Ydmp1bVdCM0JsOVJpRkQ1Q1p2ejJvM25PZz1cIixcInZcIjpcImN2K3RtYnhYSEZvL0dET0FSZXZJNGh2YldFbENXMGNaRUYvTE1rT09MdVhHVVJ2eG5uNWpab0tJeUgyUEdOK2RcIixcImlkZlwiOlwiMTY0MDc5NTQ0OTE0MC0xNzA1MjY5NTE0OFwiLFwid1wiOlwiNmt6aUtLVTVWUHZ4WXBvUzUwT1cvWmh-Q1FodUk0ejlOUk03NGh0ZmFUQnpCa2NHTThZb0Rlemhjd3d2WWJiM0NQNk5RUXV0ZFpDaWswL35XWTUvYTFrMU9wRS96bXROXCIsXCJjdFwiOlwiZXJyVjNVZ2g5VTg9XCJ9In0&title=%E4%BB%BB%E5%8A%A1%E4%B8%AD%E5%BF%83&distinctId=17e0707a529319-0ac912bc4cc22f-4e3b781d-304500-17e0707a52a83f&referrer=https:%2F%2Fsso.dossen.com%2F&isLogin=true',
        headers: {
            'Origin': `https://campaign.dossen.com`,
            'Cookie': tmpCk,
            'Connection': `keep-alive`,
            'Content-Type': `application/json;charset=utf-8`,
            'Accept': `application/json, text/plain, */*`,
            'Host': `campaignapi.dossen.com`,
            'User-Agent': `dossen(iOS/4.7.20)Mozilla/5.0 (iPhone; CPU iPhone OS 15.3 like Mac OS X) AppleWebKit/605.1.15`,
            'Referer': `https://campaign.dossen.com/taskcenter/taskIndex?utm_soruce=APP&utm_medium=hyly&utm_campaign=qd&utm_content=&utm_term=%3Freferrer%3D&referrerTitle=%E4%BC%9A%E5%91%98%E7%A4%BC%E9%81%87&isLogin=1&distinctId=e0204727-0dde-4459-a941-b9d24f786178`,
            'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
            'Accept-Encoding': `gzip, deflate, br`
        }
    }
    return urlObject;
}

//http requrest
async function httpGet(urlObject) {
    httpResult = null
    return new Promise((resolve) => {
        $.get(urlObject, async (err, resp, data) => {
            try {
                httpResult = JSON.parse(data);
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//function env
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
