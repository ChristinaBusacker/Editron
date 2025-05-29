export interface StyleProperties {
  layout?: LayoutStyle;
  background?: BackgroundStyle;
  border?: BorderStyle;
  misc?: MiscStyle;
}

export interface LayoutStyle {
  padding?: string;
  margin?: string;
  display?: 'block' | 'flex' | 'grid';
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
}

export interface BackgroundStyle {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
}

export interface BorderStyle {
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
}

export interface MiscStyle {
  customClass?: string;
  boxShadow?: string;
  zIndex?: number;
  opacity?: number;
}

export type StylePropertiesKeys = keyof StyleProperties;
export type BackgroundStyleKeys = keyof BackgroundStyle;
export type BorderStyleKeys = keyof BorderStyle;
export type MiscStyleKeys = keyof MiscStyle;
