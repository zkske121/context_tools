const express = require('express')
const fs = require('fs')
const app = express()
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream')
const logDirectory = path.join(__dirname, 'log')
const pagesDirectory = path.join(__dirname, '../config/pages')
const utils = require('./utils/index');
const bodyParser = require('body-parser');
const constant = require('./constant/index');

// 页面列表
const pageList = fs.readdirSync(pagesDirectory);

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})

app.use(morgan('dev', { stream: accessLogStream }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));

// 首页入口
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 获取配置信息
app.get('/get/:fileName', (req, res) => {
    const { fileName } = req.params;
    let fileFullName;
    let filePath;
    let ret = {};

    switch(fileName) {
        // 获取配置文件
        case constant.KEYS:
            filePath = path.join(__dirname, `../config/keys/index.json`);
            ret = utils.getJsonByPath(filePath);
            break;
        // 获取页面列表数据
        case constant.PAGES:
            ret = { pages: pageList.map(v => v.replace('.json', '')) };
            break;
        // 获取各页面的配置数据
        default:
            fileFullName = `${fileName}.json`;
            filePath = path.join(__dirname, `../config/pages/${fileFullName}`);

            // 检查是否存在页面配置数据
            if (pageList.indexOf(fileFullName) > -1) {
                ret = utils.getJsonByPath(filePath);
            }
    }

    res.json(ret);
});

// 设置配置信息
app.post('/set/:fileName', (req, res) => {
    const { fileName } = req.params;
    let filePath;

    switch (fileName) {
        // 获取配置文件
        case constant.KEYS:
            filePath = path.join(__dirname, `../config/keys/index.json`);
            ret = fs.readFileSync(filePath, { encoding: 'utf-8' });
            break;
        // 获取页面列表数据
        case constant.PAGES:
            break;
        default:
            fileFullName = `${fileName}.json`;
            filePath = path.join(__dirname, `../config/pages/${fileFullName}`);
    }

    const ret = utils.setListValueByPath(filePath, req.body);

    res.json(ret);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))