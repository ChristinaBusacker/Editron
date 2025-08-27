import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '@frontend/shared/services/api/user-api.service';
import { catchError, of, pipe } from 'rxjs';

@Component({
  selector: 'app-invitation',
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
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss',
})
export class InvitationComponent implements OnInit {
  hasCode = false;
  isCodeValid = false;
  isCodeExpired = false;

  constructor(
    private route: ActivatedRoute,
    private userApi: UserApiService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        console.log('Code gefunden:', code);
        this.hasCode = true;
        this.userApi
          .getInvite(code)
          .pipe(
            catchError((error, caught) => {
              this.isCodeValid = error.status === 404;
              this.isCodeExpired = error.status === 400;
              return of(null);
            }),
          )
          .subscribe(data => {
            if (data) {
            }
          });
      } else {
        console.log('Kein Code-Parameter vorhanden');
      }
    });
  }
}
