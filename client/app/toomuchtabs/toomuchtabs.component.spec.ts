import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToomuchtabsComponent } from './toomuchtabs.component';

describe('ToomuchtabsComponent', () => {
  let component: ToomuchtabsComponent;
  let fixture: ComponentFixture<ToomuchtabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToomuchtabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToomuchtabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
