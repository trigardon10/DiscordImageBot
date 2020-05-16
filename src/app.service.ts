import { Injectable } from '@nestjs/common';
import { WebsocketService } from './websocket/websocket.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpClient } from './http-client/http-client.service';

@Injectable()
export class AppService {
  constructor(private wsService: WebsocketService, private httpClient: HttpClient) { this.init() }

  guilds: { [id: number]: any } = {};
  filteredMessages: Observable<any>;

  private init() {
    // Important Listeners
    this.setGuildListener();
    this.setMessagesFilter();

    // Command Listeners
    this.setNameChangeCommand();

    // connect
    this.wsService.connect();
  }

  // Listeners
  private setGuildListener() {
    this.wsService.on('GUILD_CREATE').subscribe(guild => this.guilds[guild.id] = guild)
  }

  private setMessagesFilter() {
    this.filteredMessages = this.wsService.on('MESSAGE_CREATE').pipe(filter(message => message.content.substring(0, 2) == 'd!'))
    this.filteredMessages.subscribe(message => console.log('Message: ' + message.content))
  }

  private setNameChangeCommand() {
    this.filteredMessages.pipe(filter(message => message.content.split(' ')[0] == 'd!name')).subscribe(message => {
      const newName: string = message.content.split(' ')[1];
      if (!newName || newName.trim() == '') {
        this.sendMessage('Zu dumm um einen Namen anzugeben?', message.channel_id)
      } else {
        this.changeName(newName.trim(), message.author.id, message.guild_id).subscribe(
          () => {
            this.sendMessage('<@!' + message.author.id + '> Dein Name wurde geändert zu ' + newName.trim() + ' (TODO)', message.channel_id)
          },
          err => this.sendMessage(err.response.data.message, message.channel_id)
        )
      }
    })
  }

  // Actions
  private sendMessage(content: string, channelId: number): void {
    this.httpClient.post('channels/' + channelId + '/messages', { content })
      .subscribe(res => console.log('http succ'), err => console.log(err))
  }

  private changeName(nick: string, userId: number, guildId: number): Observable<any> {
    return this.httpClient.patch('guilds/' + guildId + '/members/' + userId, { nick })
  }
}
