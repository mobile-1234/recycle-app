import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordSettings } from './password-settings';

describe('PasswordSettings', () => {
  let component: PasswordSettings;
  let fixture: ComponentFixture<PasswordSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

