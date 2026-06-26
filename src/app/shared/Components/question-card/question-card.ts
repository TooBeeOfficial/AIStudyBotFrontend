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
import { take } from 'rxjs';
import { QuestionsService } from '../../services/questions';
import { AnswerModel } from '../../../models/answerModel';
import { ExportServices } from '../../services/export-services';

@Component({
  selector: 'app-question-card',
  imports: [MatIcon, CommonModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.css',
})
export class QuestionCard {
  @Input() question?: QuestionModel;
  @Input() isForQuiz: boolean = false;
  showAnswer: boolean = true;
  openOptionsMenu: boolean = false;
  dialog = inject(MatDialog);
  chatOperationService: ChatOperationServices = inject(ChatOperationServices);
  questionService: QuestionsService = inject(QuestionsService);
  exportService: ExportServices = inject(ExportServices);

  toggleMenu() {
    this.openOptionsMenu = !this.openOptionsMenu;
  }

  exportQuestionAsPDF(event: MouseEvent) {
    if (this.question) this.exportService.exportQuestionPdf(this.question);
  }

  exportQuestionAsDOC(event: MouseEvent) {
    if (this.question) this.exportService.exportQuestionDoc(this.question);
  }

  showCorrectAnswer() {
    this.questionService.questionCorrect(this.question?.id!).subscribe({
      next: (ans) => {
        if (!ans) return;

        this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Correct Answer',
            message: AnswerModel.fromApi(ans).answer,
          },
        });
      },
    });
  }

  deleteQuestion() {
    this.chatOperationService.chatService.chat$.pipe(take(1)).subscribe({
      next: (currentChat) => {
        console.log('CURRENT CHHAT:', currentChat);
        if (!currentChat) return;
        console.log(this.question?.id!);
        this.chatOperationService.deleteExistingQuestion(this.question?.id!, currentChat.id);
      },
    });
  }

  clone<T>(value: QuestionModel): QuestionModel {
    return structuredClone(value);
  }
}
