import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  CreateUserInvitePayload,
  User,
  UserInvite,
  UserListItem,
} from '@frontend/shared/services/api/models/user.model';
import { UserApiService } from '@frontend/shared/services/api/user-api.service';
import { MatSelectModule } from '@angular/material/select';
import {
  USER_PERMISSIONS,
  USER_PERMISSIONS_TAGS,
} from '@shared/constants/user-permission.constant';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { combineLatest, combineLatestAll, map } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserManagementState } from '@frontend/core/store/user-management/user-management.state';
import { CreateInvitation } from '@frontend/core/store/user-management/user-management.actions';
import { CopyToClipboardDirective } from '@frontend/core/directives/copy-to-clipboard.directive';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-user-management',
  imports: [
    MatExpansionModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    CopyToClipboardDirective,
    MatIconModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  users = this.store.select(UserManagementState.users);
  invites = this.store.select(UserManagementState.invitations);

  userDisplayedColumns: string[] = ['id', 'name', 'email', 'provider'];
  userDataSource: MatTableDataSource<UserListItem>;

  inviteDisplayedColumns: string[] = [
    'id',
    'name',
    'email',
    'permissions',
    'inviteCode',
    'controls',
  ];
  inviteDataSource: MatTableDataSource<UserInvite>;

  @ViewChild('userPaginator') userPaginator: MatPaginator;
  @ViewChild('invitePaginator') invitePaginator: MatPaginator;

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  permissionsGroup: FormGroup;
  permissionTags = USER_PERMISSIONS_TAGS;

  languageFormControl = new FormControl('en', [Validators.required]);

  initDone = false;
  inviteFormValid = false;

  constructor(
    private userService: UserApiService,
    private formBuilder: FormBuilder,
    private store: Store,
  ) {}

  readonly panelOpenState = signal(false);

  getControl(name: string) {
    return this.permissionsGroup.get(name);
  }

  getPermissionDescription(tag: string) {
    return USER_PERMISSIONS.find(p => p.name === tag).description;
  }

  inviteUser() {
    if (this.inviteFormValid) {
      const permissions = this.permissionsGroup.value;
      const permissionPayload = Object.keys(permissions).filter(
        key => permissions[key],
      );

      const payload: CreateUserInvitePayload = {
        email: this.emailFormControl.value,
        name: this.nameFormControl.value,
        permissions: permissionPayload,
      };

      this.store.dispatch(new CreateInvitation(payload));

      this.permissionsGroup.reset();
      this.emailFormControl.reset();
      this.nameFormControl.reset();
    }
  }

  ngOnInit(): void {
    const permissions: any = {};
    USER_PERMISSIONS_TAGS.forEach(p => (permissions[p] = false));
    this.permissionsGroup = this.formBuilder.group(permissions);
  }

  ngAfterViewInit() {
    this.users.subscribe(users => {
      this.userDataSource = new MatTableDataSource<UserListItem>(users);
      this.userDataSource.paginator = this.userPaginator;
    });

    this.invites.subscribe(invites => {
      this.inviteDataSource = new MatTableDataSource(invites);
      this.inviteDataSource.paginator = this.invitePaginator;
      this.initDone = true;
    });

    combineLatest([
      this.emailFormControl.valueChanges,
      this.nameFormControl.valueChanges,
    ]).subscribe(() => {
      this.inviteFormValid =
        this.emailFormControl.valid && this.nameFormControl.valid;
    });
  }
}
