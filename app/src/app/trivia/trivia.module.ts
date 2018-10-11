import { NgModule } from '@angular/core';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { SharedModule } from '@app/shared';
import { environment } from '@env/environment';

import { TriviaRoutingModule } from './trivia-routing.module';
import { TriviaComponent } from './trivia/trivia.component';
import { QuizComponent } from "@app/trivia/quiz/quiz.component";
import { ScoresComponent } from '@app/trivia/scores/scores.component';

import { MatDialogModule } from "@angular/material";
import { QuizDialogComponent } from './quiz-dialog/quiz-dialog.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { MatProgressBarModule } from '@angular/material'

@NgModule({
  imports: [
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    SharedModule,
    TriviaRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  declarations: [
    TriviaComponent,
    QuizComponent,
    ScoresComponent,
    QuizDialogComponent
  ],
  providers: [],
  entryComponents: [QuizDialogComponent]
})
export class TriviaModule {
  constructor() {}
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}
