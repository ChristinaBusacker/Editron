import { ColumnLayout, StyleProperties } from './styling.declaration';

export interface ComponentInstance {
  id: string;
  type: ComponentType;
  settings: Record<string, any>;
  value: any;
  localizable?: boolean;
}

export interface Column {
  style: StyleProperties;
  components: ComponentInstance[];
  id: string;
}

export interface Row {
  style: StyleProperties;
  columns: Column[];
  layout: ColumnLayout;
  id: string;
}

export interface Section {
  style: StyleProperties;
  rows: Row[];
  id: string;
}

export interface HomepageContent {
  sections: Section[];
}

export type ComponentType =
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'form'
  | 'carousel'
  | 'galery'
  | 'map';
