// 账号信息
const accounts = [
    ["EDU", "https://wangzi.uk/auth/login", "wasanbii@163.com", "@323512#"],
    ["老板娘", "https://www.cordcloud.org/auth/login", "wasanbi2008@gmail.com", "@323512#"],    

]

const autoLogout = false // 自动登出

const unit = "GB" // 默认流量单位 B,KB,MB,GB,TB

var results = {
    data: [],
    unit: unit
}

async function launch() {
    for (var i in accounts) {
        let title = accounts[i][0]
        let url = accounts[i][1]
        let email = accounts[i][2]
        let password = accounts[i][3]
        if (autoLogout) {
            let logoutPath = url.indexOf("auth/login") != -1 ? "user/logout" : "user/logout.php"
            await $http.get(url.replace(/(auth|user)\/login(.php)*/g, "") + logoutPath)
            await login(url, email, password, title)
        } else {
            await checkin(url, email, password, title)
        }
    }
    $intents.finish(results);
}

launch()

async function checkin(url, email, password, title) {
    let checkinPath = url.indexOf("auth/login") != -1 ? "user/checkin" : "user/_checkin.php"
    let resp = await $http.post({
        url: url.replace(/(auth|user)\/login(.php)*/g, "") + checkinPath
    })
    if (resp.data.msg) {
        await dataResults(url, resp.data.msg, title)
    } else {
        await login(url, email, password, title)
    }
}

async function login(url, email, password, title) {
    let loginPath = url.indexOf("auth/login") != -1 ? "auth/login" : "user/_login.php"
    let resp = await $http.request({
        method: "POST",
        url: url.replace(/(auth|user)\/login(.php)*/g, "") + loginPath,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            "email": email,
            "passwd": password,
            "rumber-me": "week"
        }
    })
    if (resp.response.statusCode == 200) {
        if (resp.data.toString().match(/邮箱或者密码错误|Mail or password is incorrect/)) {
            $ui.toast(title + "邮箱或者密码错误")
        } else {
            await checkin(url, email, password, title)
        }
    } else {
        $ui.toast(title + "登录失败")
    }
}

async function dataResults(url, checkinMsg, title) {
    let userPath = url.indexOf("auth/login") != -1 ? "user" : "user/index.php"
    let resp = await $http.get(url.replace(/(auth|user)\/login(.php)*/g, "") + userPath)
    let data = resp.data

    if (data.match(/theme\/malio/)) {

        let flowInfo = data.match(/trafficDountChat\s*\(([^\)]+)/)
        if (flowInfo) {
            let flowData = flowInfo[1].match(/\d[^\']+/g)
            var usedData = flowData[0]
            var restData = flowData[2]
        }

    } else {

        var usedData = data.match(/(Used Transfer|>过去已用|>已用|\"已用)[^B]+/)
        if (usedData) {
            usedData = flowFormat(usedData[0])
        }

        var restData = data.match(/(Remaining Transfer|>剩余流量|>可用|\"剩余)[^B]+/)
        if (restData) {
            restData = flowFormat(restData[0])
        }

    }

    results.data.push({
        title: title,
        used: usedData ? convert(usedData) : 0,
        rest: restData ? convert(restData) : 0
    })


    if (url.match(/dlercloud/i)) {
        let date = new Date()
        let stat = await $http.post("https://dlercloud.com/user/get_traffic")
        stat = stat.data.traffic

        results.dlercloud = {}
        results.dlercloud.stat = {
            time: combine(stat.dayBegainTime).replace(/(\d\d)-(\d\d)/g, "$1/$2/" + date.getFullYear()),
            download: combine(stat.dailyTraffic_d),
            upload: combine(stat.dailyTraffic_u),
            title: title
        }
    }


    await $push.schedule({
        title: title,
        body: `${checkinMsg}
已用流量：${usedData}
剩余流量：${restData}`,
        mute: true //静音推送
    })
}

function flowFormat(data) {
    data = data.replace(/\d+(\.\d+)*%/, "")
    let flow = data.match(/\d+(\.\d+)*\w*/)
    return flow[0] + "B"
}


function convert(data) {
    var refer = {
        B: 1099511627776,
        KB: 1073741824,
        MB: 1048576,
        GB: 1024,
        TB: 1
    }

    var value = parseInt(data.replace(/[a-zA-Z]*B/, ""))
    var preUnit = refer[data.match(/[a-zA-Z]*B/)[0]]
    var defUnit = refer[unit]
    if (preUnit > defUnit) {
        return value / (preUnit / defUnit)
    } else {
        return value * (defUnit / preUnit)
    }
}

function combine(data) {
    var keys = Object.keys(data).reverse()
    var result = []
    for (var i in keys) {
        result.push(data[keys[i]])
    }
    return result.join("\n")
}