import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { QuizComponent } from '@app/trivia/quiz/quiz.component';

import { FormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'anms-quiz-dialog',
  templateUrl: './quiz-dialog.component.html',
  styleUrls: ['./quiz-dialog.component.scss']
})
export class QuizDialogComponent implements OnInit {
  score: number;
  name = new FormControl('', [Validators.required]);

  facts = [
    "Fun Fact: Progress Software has at least eight employees!",
    "Fun Fact: If you lined up all of Progress Software employees, you would not be able to expense that.",
    "Fun Fact: Progress is different from Progressive Insurance!",
    "Fun Fact: If you call Yogesh's phone, he'd ask \"Who are you? How did you get my number?\"",
    "Fun Fact: The password to Progress's secret CVP is the guy on your left's social security number.",
    "Fun Fact: The guy who wrote this had too much free time. My name is Raghu."
  ];

  fact: string;

  constructor(
    private dialogRef: MatDialogRef<QuizComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.score = data.score;
    dialogRef.disableClose = true;
    this.fact = this.facts[Math.floor(Math.random() * Math.floor(this.facts.length))];
  }

  ngOnInit() { 
  }

  close() {
    this.dialogRef.close("restart");
  }

}
