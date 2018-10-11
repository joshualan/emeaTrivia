import { FormsModule, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { environment as env } from '@env/environment';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import { progress } from "@progress/jsdo-core";
import { DataSource } from "@progress/jsdo-angular";

import { QuizDialogComponent } from "../quiz-dialog/quiz-dialog.component";

import {
  trigger,
  style,
  transition,
  animate,
  state
} from '@angular/animations';

import { interval, timer } from 'rxjs';

// State of card moving animations
type cState = 'show' | 'hide' | 'reset';

// State of where the user is at  
type qState = 'init' | 'quiz' | 'submit';

// Make the timer bigger
// Make the animation for next question go way faster

interface Question {
  question: string;
  answer: string;
  choices: string[];
}

const serviceURI = 'https://oemobiledemo.progress.com/OEMobileDemoServices/';
const catalogURI = 'https://oemobiledemo.progress.com/OEMobileDemoServices/static/SportsService.json';

@Component({
  selector: 'anms-quiz',
  animations: [
    trigger('questionAnimation', [
      state(
        'show',
        style({
          transform: 'translateX(0)',
          opacity: 1
        })
      ),
      state(
        'hide',
        style({
          transform: 'translateX(-100%)',
          opacity: 0
        })
      ),
      state(
        'reset',
        style({
          transform: 'translateX(100%)',
          opacity: 0
        })
      ),
      transition('show => hide', animate('100ms ease-out')),
      transition('reset => show', animate('100ms ease-in'))
    ])
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  versions = env.versions;

  submitForm: FormGroup;

  public cState: cState;
  public qState: qState;

  private questions: Question[] = [];
  public selectedQuestion: Question;

  // Variables containing values and attrs of choices
  public choices: string[];
  public choiceColors: string[];
  public answered: boolean;
  public score: number;

  // Variable containing progress bar info
  public timeLeft = 20;
  private timer;
  private subscription;

  private hasScores = false;

  // Variables for submission stuff #yolo
  public submitText: string = "Submit";
  public tempQuestions;

  // debug var
  public foo: string;

  ngOnInit() {
    // Create the proper forms I guess
    this.submitForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.timer = interval(1000);

    this.tempQuestions = [
      {
        question: 'Where was Progress founded?',
        answer: 'Billerica, MA',
        choices_1: 'Norcross, GA',
        choices_2: 'Morrisville, NC',
        choices_3: 'Billerica, MA',
        choices_4: 'Nashua, NH'
      },
      {
        question: 'Who was Progress Software\'s first employee?',
        answer: 'Mary Szekely',
        choices_1: 'Thomas Waverly',
        choices_2: 'Gus Bjorklund',
        choices_3: 'Yogesh Gupya',
        choices_4: 'Mary Szekely'
      },
      {
        question: 'Who were the founders of Progress Software?',
        answer: 'Joe Alsop, Chip Zeiring, Clyde Kessel',
        choices_1: 'Joe Alsop, Chip Zeiring, Clyde Kessel',
        choices_2: 'Jon Zeiring, Chip Kessel, Clyde Alsop',
        choices_3: 'Joe Kessel, Chip Alsop, Clyde Zeiring',
        choices_4: 'Joe Zessel, Chip Lasop, Clyde Keiring'
      },
      {
        question: 'What was the original name of Progress Software?',
        answer: 'Data Language Corporation',
        choices_1: 'Progress Software',
        choices_2: 'Billerica Solutions',
        choices_3: 'Progressive Insurance',
        choices_4: 'Data Language Corporation'
      },
      {
        question: 'Who is the father of the OE Database?',
        answer: 'Gus Bjorklund',
        choices_1: 'Edsel Garcia',
        choices_2: 'Sean Pinney',
        choices_3: 'Gus Bjorklund',
        choices_4: 'John Ainsworth'
      },
      {
        question: 'What was the first Progress version that was commerically released?',
        answer: '2.0',
        choices_1: 'Alpha',
        choices_2: '1.3',
        choices_3: '4.20',
        choices_4: '2.0'
      },
      {
        question: 'What release included Storage Areas?',
        answer: 'Progress v9',
        choices_1: 'OpenEdge 10.0A',
        choices_2: 'Progress v2',
        choices_3: 'Progress v9',
        choices_4: 'To be released in OE 12.0'
      },
      {
        question: 'When did Progress IPO its stock?',
        answer: 'July 1991',
        choices_1: 'January 1988',
        choices_2: 'December 1994',
        choices_3: 'July 1991',
        choices_4: 'February'
      },
      {
        question: 'What release did Progress get renamed to OpenEdge?',
        answer: '10.0A',
        choices_1: '9',
        choices_2: '7',
        choices_3: '11.0',
        choices_4: '10.0A'
      },
      {
        question: 'What does ABL stand for?',
        answer: 'Advanced Business Language',
        choices_1: 'Advanced Business Language',
        choices_2: 'Actualized Billing Listage',
        choices_3: 'Ablative Based Layer',
        choices_4: 'Automated Blockdiagram Lookup'
      },
      {
        question: 'What year was Progress\' first commerical release?',
        answer: '1984',
        choices_1: '1976',
        choices_2: '1982',
        choices_3: '1984',
        choices_4: '2001'
      },
      {
        question: 'What language is the majority of ABL written in?',
        answer: 'C',
        choices_1: 'Fortran',
        choices_2: 'Pascal',
        choices_3: 'Java',
        choices_4: 'C'
      },
      {
        question: 'What was Progress Software\'s most recent acquisition?',
        answer: 'Kinvey',
        choices_1: 'Kinvey',
        choices_2: 'DataRPM',
        choices_3: 'Telerik',
        choices_4: 'Mindreef'
      },
      {
        question: 'Who is the current CEO of Progress Software',
        answer: 'Yogesh Gupta',
        choices_1: 'Jessica Wang',
        choices_2: 'Yogesh Gupta',
        choices_3: 'Cameron Wright',
        choices_4: 'Connor Silva'
      },
      {
        question: 'Where are the headquarters of Progress Software located?',
        answer: 'Bedford, MA',
        choices_1: 'Boston, MA',
        choices_2: 'Rotterdam, Netherlands',
        choices_3: 'Bedford, MA',
        choices_4: 'Manila, Philippines'
      }
    ];
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router) {

    let dataSource;

    this.cState = 'show';
    this.score = 0;

    // Create a session and grab the questions from the backend
    progress.data.getSession({
      serviceURI: serviceURI,
      catalogURI: catalogURI,
      authenticationModel: 'anonymous'
    }).then(() => {

      this.tempQuestions.forEach(element => {
        this.questions.push({
          question: element.question,
          answer: element.answer,
          choices: [element.choices_1, element.choices_2, element.choices_3, element.choices_4]
        });
      });

      this.hasScores = true;

      this.selectedQuestion = this.questions[
        Math.floor(Math.random() * this.questions.length)
      ];
      this.choices = this.selectedQuestion.choices.slice();
      this.choiceColors = ['', '', '', ''];

      this.qState = "init";
    });
  }

  toggle(event, buttonNumber) {
    if (!this.answered) {
      if (this.choices[buttonNumber] === this.selectedQuestion.answer) {
        this.choiceColors[buttonNumber] = 'accent';
        this.choices[buttonNumber] = '<i class="fas fa-check-circle"></i>';
        this.score++;
      } else {
        this.choiceColors[buttonNumber] = 'warn';
        this.choices[buttonNumber] = '<i class="fas fa-times-circle"></i>';
      }
      this.answered = true;
      setTimeout(() => {
        this.cState = 'hide';
      }, 500);
    }
  }

  pause() {
    this.stopCountdown();
    const dialogRef = this.dialog.open(QuizDialogComponent, {
      data: { "score": this.score }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("after closed!");
      if (this.timeLeft > 0) {
        this.timeLeft -= 1;
      }

      this.resumeCountdown();
    });
  }

  startQuiz() {
    this.qState = "quiz";
    this.restartTimer();
  }

  @ViewChild('name') nameField: ElementRef;
  submitScore() {
    let dataSource;

    if (this.submitForm.controls.name.valid) {
      this.submitText = "Submitting...";

      dataSource = new DataSource({
        jsdo: new progress.data.JSDO({ name: 'Warehouse' })
      });

      dataSource.read().toPromise().then(() => {

        let highest = 0;

        dataSource.getData().forEach(element => {
          if (highest < element.WarehouseNum) {
            highest = element.WarehouseNum;
          }
        });

        highest += 1;

        dataSource.create({
          WarehouseNum: highest,
          WarehouseName: this.submitForm.controls.name.value,
          Country: this.score + "",
          Address: "EMEA"
        });

        return dataSource.saveChanges().toPromise();
      }).then(() => {
        this.submitText = "Submitted!";
        // Navigate to High Scores after submitting
        this.router.navigate(["trivia/scores"]);
      }, (e) => {
        console.log(e);
        this.submitText = "Error!";
      });
    } else {
      this.nameField.nativeElement.focus();
    }
  }

  restartTimer() {
    this.timeLeft = 20;
    this.score = 0;
    this.submitText = "Submit";

    this.resumeCountdown();
  }

  resumeCountdown() {
    if (typeof this.subscription !== "undefined") {
      console.log("about to unsubscribe!");
      this.subscription.unsubscribe();
    }


    console.log("subscribing");
    this.subscription = this.timer.subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft -= 1;
      }

      if (this.timeLeft <= 0) {
        this.stopCountdown();
        this.qState = "submit";
      }
    });
  }

  stopCountdown() {
    this.subscription.unsubscribe();
  }

  // I cycle to the next friend in the collection.
  public showNextQuestion(): void {
    // Change the "state" for our animation trigger.
    this.cState = 'show';

    this.changeDetectorRef.detectChanges();

    // Find the currently selected index.
    var index = this.questions.indexOf(this.selectedQuestion);

    this.selectedQuestion = this.questions[index + 1]
      ? this.questions[index + 1]
      : this.questions[0];

    // Reset the state
    this.choiceColors = ['', '', '', ''];
    this.answered = false;
    this.choices = this.selectedQuestion.choices.slice();
  }

  public animationDone(event) {
    if (event.toState === 'hide') {
      this.resetQuestion();
    }
    if (event.toState === 'reset') {
      this.showNextQuestion();
    }
  }

  public resetQuestion() {
    this.cState = 'reset';
  }
}
