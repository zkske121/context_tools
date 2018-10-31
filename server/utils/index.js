const fs = require('fs');

/**
 * 解析字符串类型的object数据
 * @param {入参为字符串} string 
 */
function parseJson(string) {
    let ret;

    try {
        ret = JSON.parse(string);
    } catch (e) {
        ret = {};
        console.log('parseJson error', e);
    }

    return ret;
}

function getJsonByPath(filePath) {
    let ret = {};
    
    try {
        ret = fs.readFileSync(filePath, { encoding: 'utf-8' });
    } catch (error) {
        console.log('getJsonByPath error', error);
    }

    // 文件读取后需要去除转译字符,并检查类型
    if (typeof ret === 'string') {
        ret = parseJson(ret);
    }

    return ret;
}

function writeFileByPath(filePath, value) {
    const ret = { status: 1, message: '写入文件成功！'};

    try {
        fs.writeFileSync(filePath, JSON.stringify(value), { encoding: 'utf8' });
        return ret;
    } catch (error) {
        console.log('writeFileByPath', error);
        return {
            status: -1,
            message: '写入文件失败！'
        }
    }
}

function setListValueByPath(filePath, data) {
    const ret = getJsonByPath(filePath);
    const { version, list } = data;

    if (ret.version !== version) {
        return {
            status: -1,
            message: '不是最新版本号，请刷新后再试！'
        };
    }

    if (!Array.isArray(list)) {
        return {
            status: -1,
            message: '参数必须为数组类型错误！'
        };
    }

    list.forEach(v => {
        const {key, value} = v;

        if (
            value !== undefined
            && value !== ''
            && value !== null
        ) {
            ret[key] = value;
        }
    });

    // 设置版本号
    ret.version = new Date().getTime();

    return writeFileByPath(filePath, ret);
}

module.exports = {
    parseJson,
    getJsonByPath,
    writeFileByPath,
    setListValueByPath
}