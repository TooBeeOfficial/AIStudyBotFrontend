import { Component, inject, OnInit } from '@angular/core';
import { AIModel } from '../../models/aiModel';
import { AIBotService } from '../../shared/services/aibot';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.html',
    styleUrl: './chatbot.css',
})
export class Chatbot implements OnInit {
    constructor(private cdr:ChangeDetectorRef) {
    }
    aiservice = inject(AIBotService);
    models!: AIModel[];
    ngOnInit(){
        this.aiservice.getAIModels().subscribe({
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
