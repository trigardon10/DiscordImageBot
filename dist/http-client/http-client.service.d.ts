import { HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class HttpClient {
    private httpService;
    constructor(httpService: HttpService);
    post(path: string, data: any): Observable<any>;
    patch(path: string, data: any): Observable<any>;
}
