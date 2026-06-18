import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { QuestionModel } from '../../../models/questionModel';
import { ChatOperationServices } from '../../chat-operation-services';
import { NgClass, CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../dialogs/success-dialog/success-dialog';

@Component({
  selector: 'app-question-card',
  imports: [MatIcon, CommonModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.css',
})
export class QuestionCard implements OnInit {
  @Input() question?: QuestionModel;
  @Input() isForQuiz: boolean = false;
  showAnswer: boolean = true;
  openOptionsMenu: boolean = false;
  dialog = inject(MatDialog);
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);

  @ViewChild('dropDownButton') dropDown!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = event.target as Node;

    const clickedInsideButton = this.dropDown.nativeElement.contains(clickedInside);

    if (!clickedInsideButton) {
      this.openOptionsMenu = false;
    }
  }

  ngOnInit(): void {}

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.openOptionsMenu = !this.openOptionsMenu;
  }

  showCorrectAnswer() {
    this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Correct Answer',
        message: this.question?.correctAnswer,
      },
    });
  }
}
