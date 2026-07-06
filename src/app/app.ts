import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user';
import { ChatService } from './shared/services/chat';
import { ChatModel } from './models/chatModel';
import { AIBotService } from './shared/services/aibot';
import { QuizService } from './shared/services/quiz';
import { ChatOperationServices } from './shared/chat-operation-services';
import { MessageModel } from './models/chatMessageModel';
import { take, tap } from 'rxjs';
import { AIModel } from './models/aiModel';
import { RouteServices } from './shared/route-services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
