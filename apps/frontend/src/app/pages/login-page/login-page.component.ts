import { Component, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '@frontend/shared/services/api/auth-api.service';
import { LoginPayload } from '@frontend/shared/services/api/models/auth.model';
import { Store } from '@ngxs/store';
import { Login } from '@frontend/core/store/auth/auth.actions';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private store: Store,
  ) {}

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const credentials: LoginPayload = this.form.getRawValue();

    this.store
      .dispatch(new Login(credentials.email, credentials.password))
      .subscribe(() => {
        this.isSubmitting.set(false);
        this.router.navigate(['/projects']);
      });
  }

  redirectToSSO(provider: 'google' | 'github' | 'microsoft'): void {
    window.location.href = this.auth.getSSORedirectUrl(provider);
  }
}
