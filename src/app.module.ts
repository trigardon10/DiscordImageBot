import { Module, HttpModule } from '@nestjs/common';
import { AppService } from './app.service';
import { WebsocketService } from './websocket/websocket.service';
import { HttpClient } from './http-client/http-client.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AppService, WebsocketService, HttpClient],
})
export class AppModule { }
