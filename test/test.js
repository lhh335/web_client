import 'babel-polyfill'
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import MsgEmitter from './emmiter';
import WebSocket from 'ws';

// import App from '../src/app/components/pages/administrator/Account/Page';

// function shallowRender(Component) {
//     const renderer = TestUtils.createRenderer();
//     renderer.render(<Component />);
//     return renderer.getRenderOutput();
// }

// describe('Shallow Rendering', function () {
//     it('App\'s title should be Todos', function () {
//         const app = TestUtils.renderIntoDocument(<App/>);
//         expect(1 + 1).to.equal(2);
//         // const app = shallowRender(App);
//         // // component's shallow rendering has props.children
//         // expect(app.props.children[0].type).to.equal('h1');
//         // expect(app.props.children[0].props.children).to.equal('Todos');
//     });
// });
// ("wss://ubuntu-release.curtasoft.org:7004/websocket");
var ws = new WebSocket("wss://ubuntu-release.curtasoft.org:7004/websocket")
describe('Message Test', function () {
    it('获取消息', function (done) {
        listen(function (addr, ws) {
            var cl = client(addr);
            cl.on('open', function () {
                var cb = (id = 0, message = null, args) => {
                    if (id !== QUERY_PLAYERS_S2C) {
                        return;
                    }
                    expect(message.code).to.equal(1);
                    done();
                }

                var obj = {
                    data_length: 0,
                    filters: {},
                    sort: { id: 1 }
                }

                MsgEmitter.emit(ws, 9901, obj, cb);
            });
        });

    });
})