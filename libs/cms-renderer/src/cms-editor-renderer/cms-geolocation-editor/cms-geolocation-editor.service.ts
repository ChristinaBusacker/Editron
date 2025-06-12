import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NominatimSearchResult } from '@shared/declarations/interfaces/nominatim/nominatim-search-results.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CmsGeolocationEditorService {
  lastSearch: Observable<NominatimSearchResult[]> = of([]);
  constructor(private http: HttpClient) {}

  searchAddress(query: string) {
    if (typeof query === 'string') {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
      this.lastSearch = this.http.get<NominatimSearchResult[]>(url);
      return this.lastSearch;
    } else {
      return this.lastSearch;
    }
  }

  reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url);
  }
}
