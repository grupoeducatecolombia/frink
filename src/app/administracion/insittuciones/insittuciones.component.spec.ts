import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsittucionesComponent } from './insittuciones.component';

describe('InsittucionesComponent', () => {
  let component: InsittucionesComponent;
  let fixture: ComponentFixture<InsittucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsittucionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsittucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
