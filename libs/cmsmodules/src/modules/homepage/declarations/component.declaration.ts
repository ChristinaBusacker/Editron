import { ColumnLayout, StyleProperties } from './styling.declaration';

export interface ComponentInstance {
  type: string;
  settings: Record<string, any>;
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
