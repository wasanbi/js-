/*
* 此脚本只能学习使用,请勿商用!!
* */
const $zeng = init();
const $ = new Env('工厂');
//接口地址
const JD_API_HOST = 'https://m.jingxi.com';
const cookie = $.getdata('pt_key=AAJfS2IrADDjZDIK1gWxx7Jn8-cxwpFfk6rksOOYrN5nGkOE7VHopOXlLgGXQh4aL1VG_xen7Dw');
let shareCodes = [];
let factoryId, productionId, userTaskStatusList, dailyTask = [], produceTask = [],shareCode;
const commonsHeaders = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-cn',
    'charset':'utf-8',
    'Connection': 'keep-alive',
    'Cookie':cookie,
    'Host': 'm.jingxi.com',
    'Referer': 'https://st.jingxi.com/pingou/dream_factory/index.html?pps=floor.FO4O405%3AFO8O97OA4O156B3OA3O1%3AFOFODO93O9FOBO33007A03DO2B5CO50B70333ADBF4A88AF84&ptag=138631.26.54',
    'User-Agent': 'jdpingou;iPhone;3.10.2;13.5;b09f15f85cd36b58124b55cd7d8c27fdfeb4dac0;network/4g;model/iPhone12,1;appBuild/100288;ADID/A3610825-1CC8-4E56-917E-9EC2A4E30D64;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/32;pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'


}
step();

async function step() {
    const startTime = Date.now();

    await userInfo();
    await sleep(3)
    await collectElect();
    await sleep(2);
    // await taskList();
    await investElect();
    const end = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n完成京喜工厂脚本耗时:  ${end} 秒\n`);
}
//收取电力
function collectElect() {
    return new Promise(resolve => {
        try {
            const startTime = Date.now();
            /*const collecturl =JD_API_HOST + '/dreamfactory/generator/QueryCurrentElectricityQuantity?zone=dream_factory&factoryid=1099520766251&_time='+startTime+'&_=1598426384324&sceneval=2&g_login_type=1&callback=jsonpCBKB&g_ty=ls'*/
            let collecturl = JD_API_HOST +  '/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&apptoken=&pgtimestamp=&phoneID=&factoryid='+factoryId+'&doubleflag=0&timeStamp=undefined&_time='+startTime+'&_=1598427576416&sceneval=2&g_login_type=1&callback=jsonpCBKJJJJ&g_ty=ls';
            let opt = {
                url:collecturl,
                headers:commonsHeaders
            };
            $.get(opt,(err,res,data)=>{
                // console.log(data);
                eval(data)
                function jsonpCBKJJJJ(electData){
                    let elect  = electData.data;
                    // console.log(electData.data);
                    if (elect.status == 1){
                        console.log("收取电量:",electData.data.CollectElectricity);
                        $zeng.notify('收取电量:', " ", electData.data.CollectElectricity);
                    }

                }
                resolve()
            })
        }catch (e) {

        }
    })
}
//投入电力
function investElect() {
    return new Promise(resolve => {
        const startTime = Date.now();
        const investurl = JD_API_HOST +  '/dreamfactory/userinfo/InvestElectric?zone=dream_factory&productionId='+productionId+'8&_time='+startTime+'&_=1598412303678&sceneval=2&g_login_type=1&callback=CBKAA&g_ty=ls';
        let opt = {
            url:investurl,
            headers:commonsHeaders
        };
        $.get(opt,(err,res,data)=>{
            // console.log(data);
            eval(data)
            function CBKAA(investData){
                let invest = investData;
                // console.log(investData);
                if (invest.ret === 0) {
                    console.log(`投入${invest.investElectric}`)
                }else{
                    console.log(invest.msg);
                }
            }
            resolve()
        })
    })
}
//初始化任务
function taskList() {
    return new Promise(resolve => {
        const startTime = Date.now();
        const taskUrl = JD_API_HOST + '/newtasksys/newtasksys_front/GetUserTaskStatusList?source=dreamfactory&bizCode=dream_factory&_time='+startTime+'&_=1598429100785&sceneval=2&g_login_type=1&callback=CBKGGGG&g_ty=ls';
        let opt = {
            url:taskUrl,
            headers:commonsHeaders
        };
        $.get(opt,(err,res,data)=>{
            // console.log(data);
            eval(data)
            function CBKGGGG(taskData){
                userTaskStatusList = taskData.data.userTaskStatusList
                console.log(taskData.data.userTaskStatusList);
            }
            resolve()
        })
    })
}
//用户信息
function userInfo() {
    return new Promise(resolve => {
        const startTime = Date.now();
        const infourl = JD_API_HOST +  '/dreamfactory/userinfo/GetUserInfo?zone=dream_factory&pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=&_time='+startTime+'&_=1598412303678&sceneval=2&g_login_type=1&callback=jsonpCBKAA&g_ty=ls'
        let opt = {
            url:infourl,
            headers:commonsHeaders
        };
        $.get(opt,(err,res,data)=>{
            // console.log(data);
            eval(data)
            function jsonpCBKAA(infoData){
                // console.log(infoData.data);
                factoryId = infoData.data.factoryList[0].factoryId;
                productionId = infoData.data.productionList[0].productionId;
                shareCode = infoData.data.user.encryptPin;
                console.log("京喜账号:",infoData.data.factoryList[0].name);
                console.log('当前总电量',infoData.data.user.electric);
                console.log('当前商品所需总电量',infoData.data.productionList[0].needElectric);
                console.log('已投入电量',infoData.data.productionList[0].investedElectric);
                console.log('助力码',shareCode);
                // console.log('factoryId',factoryId);
                // console.log('productionId',productionId);
                $zeng.notify('当前总电量', " ", infoData.data.user.electric);
            }
            resolve()
        })
    })
}
//等待一下
function sleep(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    })
}
//初始化函数
function init() {
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title + subtitle + message)
        if (isJSBox) $push.schedule({title: title, body: subtitle ? subtitle + "\n" + message : message})
    }
    return {notify}
}
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
