export interface LocalizationPatchValue {
  key: string;
  de: string;
  en: string;
  fr: string;
}

export interface UserPatchValue {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface MigrationPatchValue {
  localizations?: LocalizationPatchValue[];
  users?: UserPatchValue[];
}

export interface MigrationPatch {
  name: string;
  values: MigrationPatchValue;
  forceUpgrade?: boolean;
}
