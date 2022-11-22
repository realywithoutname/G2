import { PaletteComponent } from '../runtime';
import { Category10Palette } from '../spec/palette';

export type NewCategoryOptions = Omit<Category10Palette, 'type'>;

/**
 * Classic palette of AntV for ordinal data with 10 colors.
 */
export const NewCategory: PaletteComponent<NewCategoryOptions> = () => {
  return [
    '#3683Ef',
    '#9C63E3',
    '#FD8D59',
    '#08C8DB',
    '#E259AE',
    '#F3BE55',
    '#00875B',
    '#6BAFDA',
    '#65799B',
    '#C4CD2A',
  ];
};

NewCategory.props = {};
