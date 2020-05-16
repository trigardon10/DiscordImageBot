import { Injectable } from '@nestjs/common';
import { client, connection, IMessage } from 'websocket'
import { interval, Subject, Observable } from 'rxjs';
import { skip, filter, map } from 'rxjs/operators';

@Injectable()
export class WebsocketService {
    ws: client;
    connection: connection;
    connected: Promise<void>
    events = new Subject<{ t: string, d: any }>();

    connect() {
        let resolve: () => void;
        this.connected = new Promise(r => resolve = r)

        this.connected.then(_ => {
            this.connection.on('message', mes => this.handleMessage(mes));
            this.connection.on('close', (code, desc) => console.log(desc));
            this.connection.on('error', _ => console.log('WS error'));
            this.connection.on('frame', _ => console.log('WS frame'));
            this.connection.on('resume', () => console.log('WS resume'));
        })

        this.ws = new client();
        this.ws.on('connect', connection => {
            this.connection = connection;
            resolve()
        });
        this.ws.on('connectFailed', () => console.log('WS connect failed'));
        this.ws.on('httpResponse', () => console.log('WS http Response'));
        this.ws.connect('wss://gateway.discord.gg/?v=6&encoding=json');
    }

    private handleMessage(message: IMessage) {
        const data = JSON.parse(message.utf8Data)
        const con = this.connection;

        let seq = 0;

        if (data.op === 10) {
            interval(data.d.heartbeat_interval).subscribe(_ => con.send(JSON.stringify({ op: 1, d: seq++ })));
            con.send(JSON.stringify(
                {
                    op: 2,
                    d: {
                        token: "NzExMTIxNDY2OTgwMzAyOTE5.Xr-aGg.WMAGBVIP_7zW8kne6fXGVqYpeys",
                        properties: {
                            $os: "windows",
                            $browser: "my_library",
                            $device: "my_library"
                        }
                    }
                }
            ))
        }

        if (data.op === 0) {
            this.events.next(data);
        }
    }

    on(event: string): Observable<any> {
        return this.events.pipe(filter(ev => ev.t === event), map(ev => ev.d))
    }
}
