import { WebsocketService } from './websocket/websocket.service';
import { Observable } from 'rxjs';
import { HttpClient } from './http-client/http-client.service';
export declare class AppService {
    private wsService;
    private httpClient;
    constructor(wsService: WebsocketService, httpClient: HttpClient);
    guilds: {
        [id: number]: any;
    };
    filteredMessages: Observable<any>;
    private init;
    private setGuildListener;
    private setMessagesFilter;
    private setNameChangeCommand;
    private sendMessage;
    private changeName;
}
