import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedComponent } from './purchased.component';

describe('PurchasedComponent', () => {
  let component: PurchasedComponent;
  let fixture: ComponentFixture<PurchasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
