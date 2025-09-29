import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataReports } from './data-reports';

describe('DataReports', () => {
  let component: DataReports;
  let fixture: ComponentFixture<DataReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
