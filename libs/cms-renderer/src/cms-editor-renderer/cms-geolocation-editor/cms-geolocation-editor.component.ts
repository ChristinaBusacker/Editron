import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  signal,
  computed,
  inject,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import * as L from 'leaflet';
import { CmsGeolocationEditorService } from './cms-geolocation-editor.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
} from 'rxjs/operators';

import { Observable } from 'rxjs';
import { NgFor } from '@angular/common';
import { NominatimSearchResult } from '@shared/declarations/interfaces/nominatim/nominatim-search-results.interface';

@Component({
  selector: 'lib-cms-geolocation-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,

    NgFor,
  ],
  providers: [CmsGeolocationEditorService],
  templateUrl: './cms-geolocation-editor.component.html',
  styleUrl: './cms-geolocation-editor.component.scss',
})
export class CmsGeolocationEditorComponent implements AfterViewInit, OnInit {
  @Input() control: FormControl<{ lat: number; lon: number }>;
  @Output() locationChange = new EventEmitter<{ lat: number; lon: number }>();

  lat = 52.52;
  lon = 13.405;

  latSignal = signal(this.lat);
  lonSignal = signal(this.lon);
  address = signal('');

  addressControl = new FormControl();
  filteredSuggestions$: Observable<NominatimSearchResult[]>;

  map?: L.Map;
  marker?: L.Marker;

  constructor(private service: CmsGeolocationEditorService) {
    effect(() => {
      const lat = this.latSignal();
      const lon = this.lonSignal();
      this.updateMarker(lat, lon);
      this.locationChange.emit({ lat, lon });
      this.reverseGeocode(lat, lon);
      this.control.setValue({ lat, lon }, { emitEvent: true });
      console.log('effect');
    });

    this.filteredSuggestions$ = this.addressControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => this.service.searchAddress(query || '')),
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  initMap(): void {
    const lat = this.latSignal();
    const lon = this.lonSignal();
    this.map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([lat, lon], { draggable: true }).addTo(this.map);
    this.marker.on('dragend', () => {
      const pos = this.marker!.getLatLng();
      this.latSignal.set(pos.lat);
      this.lonSignal.set(pos.lng);
    });
  }

  updateMarker(lat: number, lon: number) {
    if (!this.map || !this.marker) return;
    const newPos = new L.LatLng(lat, lon);
    this.marker.setLatLng(newPos);
    this.map.setView(newPos, this.map.getZoom());
  }

  setLat(value: string) {
    this.latSignal.set(parseFloat(value));
  }

  setLon(value: string) {
    this.lonSignal.set(parseFloat(value));
  }

  reverseGeocode(lat: number, lon: number) {
    this.service.reverseGeocode(lat, lon).subscribe(result => {
      this.address.set(result?.display_name || '');
      this.addressControl.setValue(result?.display_name || '', {
        emitEvent: false,
      });
    });
  }

  selectAddress(result: NominatimSearchResult) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    this.latSignal.set(lat);
    this.lonSignal.set(lon);
    this.address.set(result.display_name);
    this.addressControl.setValue(result.display_name, { emitEvent: false });
  }

  ngOnInit(): void {
    const value = this.control.value;
    this.setLat(value.lat + '');
    this.setLon(value.lon + '');
  }
}
