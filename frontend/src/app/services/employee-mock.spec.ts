import { TestBed } from '@angular/core/testing';

import { EmployeeMock } from './employee-mock';

describe('EmployeeMock', () => {
  let service: EmployeeMock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
