import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDialogComponent } from './quiz-dialog.component';

describe('QuizDialogComponent', () => {
  let component: QuizDialogComponent;
  let fixture: ComponentFixture<QuizDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
