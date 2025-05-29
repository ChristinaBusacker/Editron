import { StyleProperties } from './styling.declaration';

export interface ComponentInstance {
  type: string;
  settings: Record<string, any>;
}

export interface Column {
  width: number;
  style?: StyleProperties;
  components: ComponentInstance[];
}

export interface Row {
  style?: StyleProperties;
  columns: Column[];
}

export interface Section {
  style?: StyleProperties;
  rows: Row[];
}

export interface HomepageContent {
  sections: Section[];
}
