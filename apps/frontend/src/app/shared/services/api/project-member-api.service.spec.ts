import { TestBed } from '@angular/core/testing';

import { ProjectMemberApiService } from './project-member-api.service';

describe('ProjectMemberApiService', () => {
  let service: ProjectMemberApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMemberApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
