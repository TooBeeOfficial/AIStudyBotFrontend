import { Component, OnInit } from '@angular/core';
import { AIModel } from '../../models/aiModel';
import { AIBot } from '../../services/aibot';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.html',
    styleUrl: './chatbot.scss',
})
export class Chatbot implements OnInit {
    constructor(private chatBotReq:AIBot, private cdr:ChangeDetectorRef) {
    }
    models!: AIModel[];
    ngOnInit(){
        this.chatBotReq.getAIModels().subscribe({
            next: (data) => {
                this.models = data.map(AIModel.fromApi);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}
