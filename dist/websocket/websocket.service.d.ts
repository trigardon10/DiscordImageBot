import { client, connection } from 'websocket';
import { Subject, Observable } from 'rxjs';
export declare class WebsocketService {
    ws: client;
    connection: connection;
    connected: Promise<void>;
    events: Subject<{
        t: string;
        d: any;
    }>;
    connect(): void;
    private handleMessage;
    on(event: string): Observable<any>;
}
