import React,  {Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import App from './containers/App'
// import configureStore from './store/configureStore'
// import { setStore } from './route'

const DomRoot = document.getElementById('root');

const HOST = 'http://127.0.0.1:3000/';

class APP extends Component {
    constructor(props) {
        super(props);

        this.state = {
            version: null,
            pages: []
        }

        this._getPages = this._getPages.bind(this);
        this._post = this._post.bind(this);
        this._getInfoByPage = this._getInfoByPage(this);
    }

    componentWillMount() {
        this._getPages();
    }

    render() {
        const {pages} = this.state;

        if (Array.isArray(pages)) {
            return (
                <div>
                    {this.state.pages.map(v => {
                        return <span>{v}</span>
                    })}
                    <button onClick={this._post}>修改文件</button>
                </div>
            );
        }

        return null;
    }

    _getPages() {
        fetch(`${HOST}get/pages`).then(res => {
            return res.json();
        }).then(res => {
            this.setState({ pages: res.pages });
        });
    }

    _getInfoByPage() {

    }

    _post() {
        const { version } = this.state;
        const opts = {
            method: "POST",   //请求方法
            body: JSON.stringify({
                "version": 1540992763626,
                "list": [
                    {
                        "key": "select_btn",
                        "value": "加入行程"
                    }
                ]
            }),   //请求体
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

        }

        fetch(`${HOST}set/additional`, opts)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(e => console.log(e));
    }
}

// const store = configureStore(initState);

// setStore(store);

render(<APP />, DomRoot);

// render(
//     <Provider store={store}>
//         <App />
//     </Provider>,
//     document.getElementById('root')
// )