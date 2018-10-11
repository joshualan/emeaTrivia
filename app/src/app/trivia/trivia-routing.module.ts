import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriviaComponent } from './trivia/trivia.component';
import { QuizComponent } from '@app/trivia/quiz/quiz.component';
import { ScoresComponent } from '@app/trivia/scores/scores.component';

const routes: Routes = [
  {
    path: '',
    component: TriviaComponent,
    children: [
      {
        path: '',
        redirectTo: 'quiz',
        pathMatch: 'full'
      },
      {
        path: 'quiz',
        component: QuizComponent,
        data: { title: 'Quiz' }
      },
      {
        path: 'scores',
        component: ScoresComponent,
        data: { title: 'High Scores' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TriviaRoutingModule {}
