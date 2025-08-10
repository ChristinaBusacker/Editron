import { ColumnLayout } from './styling.declaration';

export const COLUMN_LAYOUTS: Array<ColumnLayout> = [
  {
    label: '1/1',
    cssGrid: '1fr',
    columns: 1,
  },
  {
    label: '1/2 1/2',
    cssGrid: '1fr 1fr',
    columns: 2,
  },
  {
    label: '1/3 2/3',
    cssGrid: '1fr 2fr',
    columns: 2,
  },
  {
    label: '2/3 1/3',
    cssGrid: '2fr 1fr',
    columns: 2,
  },
  {
    label: '1/4 3/4',
    cssGrid: '1fr 3fr',
    columns: 2,
  },
  {
    label: '3/4 1/4',
    cssGrid: '3fr 1fr',
    columns: 2,
  },
  {
    label: '1/4 1/2 1/4',
    cssGrid: '1fr 2fr 1fr',
    columns: 3,
  },
  {
    label: '1/3 1/3 1/3',
    cssGrid: '1fr 1fr 1fr',
    columns: 3,
  },
  {
    label: '1/2 1/4 1/4',
    cssGrid: '2fr 1fr 1fr',
    columns: 3,
  },
  {
    label: '1/4 1/4 1/2',
    cssGrid: '1fr 1fr 2fr',
    columns: 3,
  },
  {
    label: '1/4 1/4 1/4 1/4',
    cssGrid: '1fr 1fr 1fr 1fr',
    columns: 4,
  },
  {
    label: '2/4 1/4 1/4 1/4',
    cssGrid: '2fr 1fr 1fr 1fr',
    columns: 4,
  },
  {
    label: '1/4 1/2 1/4',
    cssGrid: '1fr 2fr 1fr',
    columns: 3,
  },
];
