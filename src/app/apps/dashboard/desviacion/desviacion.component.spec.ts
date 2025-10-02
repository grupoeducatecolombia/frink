import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesviacionComponent } from './desviacion.component';

describe('DesviacionComponent', () => {
  let component: DesviacionComponent;
  let fixture: ComponentFixture<DesviacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesviacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesviacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
