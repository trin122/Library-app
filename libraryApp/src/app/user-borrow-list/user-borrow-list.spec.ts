import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBorrowList } from './user-borrow-list';

describe('UserBorrowList', () => {
  let component: UserBorrowList;
  let fixture: ComponentFixture<UserBorrowList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBorrowList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBorrowList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
