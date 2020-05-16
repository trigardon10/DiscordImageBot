"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const websocket_service_1 = require("./websocket/websocket.service");
const operators_1 = require("rxjs/operators");
const http_client_service_1 = require("./http-client/http-client.service");
let AppService = (() => {
    let AppService = class AppService {
        constructor(wsService, httpClient) {
            this.wsService = wsService;
            this.httpClient = httpClient;
            this.guilds = {};
            this.init();
        }
        init() {
            this.setGuildListener();
            this.setMessagesFilter();
            this.setNameChangeCommand();
            this.wsService.connect();
        }
        setGuildListener() {
            this.wsService.on('GUILD_CREATE').subscribe(guild => this.guilds[guild.id] = guild);
        }
        setMessagesFilter() {
            this.filteredMessages = this.wsService.on('MESSAGE_CREATE').pipe(operators_1.filter(message => message.content.substring(0, 2) == 'd!'));
            this.filteredMessages.subscribe(message => console.log('Message: ' + message.content));
        }
        setNameChangeCommand() {
            this.filteredMessages.pipe(operators_1.filter(message => message.content.split(' ')[0] == 'd!name')).subscribe(message => {
                const newName = message.content.split(' ')[1];
                if (!newName || newName.trim() == '') {
                    this.sendMessage('Zu dumm um einen Namen anzugeben?', message.channel_id);
                }
                else {
                    this.changeName(newName.trim(), message.author.id, message.guild_id).subscribe(() => {
                        this.sendMessage('<@!' + message.author.id + '> Dein Name wurde geändert zu ' + newName.trim() + ' (TODO)', message.channel_id);
                    }, err => this.sendMessage(err.response.data.message, message.channel_id));
                }
            });
        }
        sendMessage(content, channelId) {
            this.httpClient.post('channels/' + channelId + '/messages', { content })
                .subscribe(res => console.log('http succ'), err => console.log(err));
        }
        changeName(nick, userId, guildId) {
            return this.httpClient.patch('guilds/' + guildId + '/members/' + userId, { nick });
        }
    };
    AppService = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [websocket_service_1.WebsocketService, http_client_service_1.HttpClient])
    ], AppService);
    return AppService;
})();
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map