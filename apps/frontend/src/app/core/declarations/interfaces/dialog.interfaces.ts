import { FieldDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export interface DialogButton {
  label: string;
  color?: string;
  disabled?: boolean;
}

export interface DialogButtonOptions {
  confirm: DialogButton;
  decline?: DialogButton;
}

export interface DialogResponse<T> {
  action: 'confirm' | 'decline' | 'cancel';
  data: T;
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirm?: {
    label: string;
    color: string;
  };
}

export interface RelationPickerDialogData {
  field: FieldDefinition;
  currentValue?: any;
  projectId: string;
}
