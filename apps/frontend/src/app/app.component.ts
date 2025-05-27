import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './core/store/auth/auth.state';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isAuthenticated: Observable<boolean> = inject(Store).select(
    AuthState.isAuthenticated,
  );

  //this.store.select(AuthState.isAuthenticated);

  constructor() {}
}
