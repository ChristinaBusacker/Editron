import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthState } from '@frontend/core/store/auth/auth.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-admin-wrapper',
  imports: [CommonModule],
  templateUrl: './admin-wrapper.component.html',
  styleUrl: './admin-wrapper.component.scss',
})
export class AdminWrapperComponent {
  public isAdmin = this.store.select(AuthState.isAdmin);
  constructor(private store: Store) {}
}
