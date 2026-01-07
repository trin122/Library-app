import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddBook } from './add-book';

describe('AddBook', () => {
  let component: AddBook;
  let fixture: ComponentFixture<AddBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBook, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
