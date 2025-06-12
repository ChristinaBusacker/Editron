import { TestBed } from '@angular/core/testing';

import { CmsGeolocationEditorService } from './cms-geolocation-editor.service';

describe('CmsGeolocationEditorService', () => {
  let service: CmsGeolocationEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmsGeolocationEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
