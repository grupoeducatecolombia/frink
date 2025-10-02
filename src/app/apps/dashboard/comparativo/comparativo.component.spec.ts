import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoComponent } from './comparativo.component';

describe('ComparativoComponent', () => {
  let component: ComparativoComponent;
  let fixture: ComponentFixture<ComparativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
