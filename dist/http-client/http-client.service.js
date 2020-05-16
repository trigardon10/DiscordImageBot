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
exports.HttpClient = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let HttpClient = (() => {
    let HttpClient = class HttpClient {
        constructor(httpService) {
            this.httpService = httpService;
        }
        ;
        post(path, data) {
            return this.httpService.post('https://discord.com/api/' + path, data, {
                headers: { Authorization: 'Bot NzExMTIxNDY2OTgwMzAyOTE5.Xr-aGg.WMAGBVIP_7zW8kne6fXGVqYpeys' }
            }).pipe(operators_1.map(res => res.data));
        }
        patch(path, data) {
            return this.httpService.patch('https://discord.com/api/' + path, data, {
                headers: { Authorization: 'Bot NzExMTIxNDY2OTgwMzAyOTE5.Xr-aGg.WMAGBVIP_7zW8kne6fXGVqYpeys' }
            }).pipe(operators_1.map(res => res.data));
        }
    };
    HttpClient = __decorate([
        common_1.Injectable(),
        __metadata("design:paramtypes", [common_1.HttpService])
    ], HttpClient);
    return HttpClient;
})();
exports.HttpClient = HttpClient;
//# sourceMappingURL=http-client.service.js.map