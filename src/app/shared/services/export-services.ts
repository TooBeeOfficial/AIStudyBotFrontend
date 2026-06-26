import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { QuestionModel } from '../../models/questionModel';
import jsPDF from 'jspdf';
import { AnswerModel } from '../../models/answerModel';
import { QuizModel } from '../../models/quizModel';

@Injectable({
  providedIn: 'root',
})
export class ExportServices {
  async exportQuestionDoc(question: QuestionModel) {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'Question',
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph(question.question),

            new Paragraph(''),

            ...question.answers.map(
              (answer, index) =>
                new Paragraph(`${String.fromCharCode(65 + index)}. ${answer.answer}`),
            ),

            new Paragraph(''),
          ],
        },
      ],
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${question.question}.docx`);
  }

  exportQuestionPdf(question: QuestionModel) {
    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(18);
    pdf.text('Question', 20, y);
    y += 12;
    pdf.setFontSize(12);

    pdf.text(question.question, 20, y, {
      maxWidth: 170,
    });
    y += 20;

    question.answers.forEach((answer, index) => {
      pdf.text(`${String.fromCharCode(65 + index)}. ${answer.answer}`, 25, y);
      y += 10;
    });
    y += 10;

    `${question.question}.pdf`;
  }

  async exportQuizDoc(quiz: QuizModel) {
    const children: Paragraph[] = [];

    children.push(
      new Paragraph({
        text: 'Quiz',
        heading: HeadingLevel.HEADING_1,
      }),
    );

    quiz.questions.forEach((question: QuestionModel, index: number) => {
      children.push(
        new Paragraph({
          text: `Question ${index + 1}`,
          heading: HeadingLevel.HEADING_2,
        }),
      );

      children.push(new Paragraph(question.question));
      children.push(new Paragraph(''));

      question.answers.forEach((answer: AnswerModel, i: number) => {
        children.push(new Paragraph(`${String.fromCharCode(65 + i)}. ${answer.answer}`));
      });

      children.push(new Paragraph(''));
    });

    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, `${quiz.questions[0].question}.docx`);
  }

  exportQuizPdf(quiz: QuizModel) {
    const pdf = new jsPDF();

    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;

    let y = margin;

    pdf.setFontSize(20);
    pdf.text('Quiz', margin, y);

    y += 15;

    quiz.questions.forEach((question, index) => {
      // New page if needed
      if (y > pageHeight - 60) {
        pdf.addPage();
        y = margin;
      }

      pdf.setFontSize(15);
      pdf.text(`Question ${index + 1}`, margin, y);

      y += 8;

      pdf.setFontSize(12);

      const wrappedQuestion = pdf.splitTextToSize(question.question, 170);

      pdf.text(wrappedQuestion, margin, y);

      y += wrappedQuestion.length * 7 + 4;

      question.answers.forEach((answer: AnswerModel, i: number) => {
        pdf.text(`${String.fromCharCode(65 + i)}. ${answer.answer}`, margin + 5, y);

        y += 7;
      });

      y += 15;
    });

    pdf.save(`${quiz.questions[0].question}.pdf`);
  }
}
