import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasPeriodosComponent } from './areas-periodos.component';

describe('AreasPeriodosComponent', () => {
  let component: AreasPeriodosComponent;
  let fixture: ComponentFixture<AreasPeriodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasPeriodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreasPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
