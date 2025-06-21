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
