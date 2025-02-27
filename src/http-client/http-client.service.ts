import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class HttpClient {
    constructor(private httpService: HttpService) { };

    post(path: string, data: any): Observable<any> {
        return this.httpService.post(
            'https://discord.com/api/' + path, data,
            {
                headers: { Authorization: 'Bot NzExMTIxNDY2OTgwMzAyOTE5.Xr-aGg.WMAGBVIP_7zW8kne6fXGVqYpeys' }
            }
        ).pipe(map(res => res.data))
    }

    patch(path: string, data: any): Observable<any> {
        return this.httpService.patch(
            'https://discord.com/api/' + path, data,
            {
                headers: { Authorization: 'Bot NzExMTIxNDY2OTgwMzAyOTE5.Xr-aGg.WMAGBVIP_7zW8kne6fXGVqYpeys' }
            }
        ).pipe(map(res => res.data))
    }
}
