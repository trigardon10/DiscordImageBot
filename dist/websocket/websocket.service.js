"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketService = void 0;
const common_1 = require("@nestjs/common");
const websocket_1 = require("websocket");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let WebsocketService = (() => {
    let WebsocketService = class WebsocketService {
        constructor() {
            this.events = new rxjs_1.Subject();
        }
        connect() {
            let resolve;
            this.connected = new Promise(r => resolve = r);
            this.connected.then(_ => {
                this.connection.on('message', mes => this.handleMessage(mes));
                this.connection.on('close', (code, desc) => console.log(desc));
                this.connection.on('error', _ => console.log('WS error'));
                this.connection.on('frame', _ => console.log('WS frame'));
                this.connection.on('resume', () => console.log('WS resume'));
            });
            this.ws = new websocket_1.client();
            this.ws.on('connect', connection => {
                this.connection = connection;
                resolve();
            });
            this.ws.on('connectFailed', () => console.log('WS connect failed'));
            this.ws.on('httpResponse', () => console.log('WS http Response'));
            this.ws.connect('wss://gateway.discord.gg/?v=6&encoding=json');
        }
        handleMessage(message) {
            const data = JSON.parse(message.utf8Data);
            const con = this.connection;
            let seq = 0;
            if (data.op === 10) {
                rxjs_1.interval(data.d.heartbeat_interval).subscribe(_ => con.send(JSON.stringify({ op: 1, d: seq++ })));
                con.send(JSON.stringify({
                    op: 2,
                    d: {
                        token: "NzExMTIxNDY2OTgwMzAyOTE5.Xr-aGg.WMAGBVIP_7zW8kne6fXGVqYpeys",
                        properties: {
                            $os: "windows",
                            $browser: "my_library",
                            $device: "my_library"
                        }
                    }
                }));
            }
            if (data.op === 0) {
                this.events.next(data);
            }
        }
        on(event) {
            return this.events.pipe(operators_1.filter(ev => ev.t === event), operators_1.map(ev => ev.d));
        }
    };
    WebsocketService = __decorate([
        common_1.Injectable()
    ], WebsocketService);
    return WebsocketService;
})();
exports.WebsocketService = WebsocketService;
//# sourceMappingURL=websocket.service.js.map