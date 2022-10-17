import {
  Linear as ScaleLinear,
  Sequential as ScaleSequential,
} from '@antv/scale';
import { defined } from '../utils/helper';
import { ScaleComponent as SC } from '../runtime';
import { ScaleLinear as LinearScaleSpec } from '../spec';
import { useLibrary } from '../runtime/library';

function inferDomainQ(values: Primitive[], options: G2ScaleOptions) {
  const { zero = false, domain } = options;
  if (domain) return domain;
  if (values.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    for (const d of value) {
      if (defined(d)) {
        min = Math.min(min, +d);
        max = Math.max(max, +d);
      }
    }
  }
  return zero ? [Math.min(0, min), max] : [min, max];
}

function interpolatedColors(
  palette: string,
  domain: Primitive[],
  offset = (d) => d,
): string[] {
  if (!palette) return null;
  const fullName = upperFirst(palette);

  // If scheme have enough colors, then return pre-defined colors.
  const scheme = d3ScaleChromatic[`scheme${fullName}`];
  if (!scheme) return null;
  // If is a one dimension array, return it.
  if (!scheme.some(Array.isArray)) return scheme;
  const schemeColors = scheme[domain.length];
  if (schemeColors) return schemeColors;

  // Otherwise interpolate to get full colors.
  const interpolator = d3ScaleChromatic[`interpolate${fullName}`];
  return domain.map((_, i) => interpolator(offset(i / domain.length)));
}

// function categoricalColors(
//   channel: Channel,
//   options: G2ScaleOptions,
//   domain: Primitive[],
//   theme: G2Theme,
//   library: G2Library,
// ) {
//   const [usePalette] = useLibrary<G2PaletteOptions, PaletteComponent, Palette>(
//     'palette',
//     library,
//   );
//   const { value } = channel;
//   const { defaultCategory10: c10, defaultCategory20: c20 } = theme;
//   const defaultPalette = unique(value).length <= c10.length ? c10 : c20;
//   const { palette, offset } = options;
//   const colors =
//     interpolatedColors(palette, domain, offset) ||
//     usePalette({ type: palette || defaultPalette });
//   return colors;
// }

function categoricalColors(
  channel: Channel,
  options: G2ScaleOptions,
  domain: Primitive[],
  theme: G2Theme,
  library: G2Library,
) {
  const [usePalette] = useLibrary<G2PaletteOptions, PaletteComponent, Palette>(
    'palette',
    library,
  );
  const { value } = channel;
  const { defaultCategory10: c10, defaultCategory20: c20 } = theme;
  const defaultPalette = unique(value).length <= c10.length ? c10 : c20;
  const { palette, offset } = options;
  const colors =
    interpolatedColors(palette, domain, offset) ||
    usePalette({ type: palette || defaultPalette });
  return colors;
}

function gradientColors(range: string): string[] {
  return range.split('-');
}

function inferRangeN(name) {
  if (name === 'enterDelay') return [0, 1000];
  if (name == 'enterDuration') return [300, 1000];
  if (name.startsWith('y') || name.startsWith('position')) return [1, 0];
  if (name === 'size') return [1, 10];
  return [0, 1];
}

function inferRangeQ(name, options) {
  const { range } = options;
  if (typeof range === 'string') return gradientColors(range);
  if (range !== undefined) return range;
  if (name === 'color') return inferRangeColor();
  return inferRangeN(name);
}

function scaleSequential() {
  return {
    constructor: ScaleSequential,
    domain: inferDomainQ(values, rest),
  };
}

function scaleLinear({
  domain,
  range,
  domainMin = domain[0],
  domainMax = domain[1],
  rangeMin = range[0],
  rangeMax = range[1],
  ...rest
}) {
  return {
    constructor: ScaleLinear,
    ...rest,
    domain: [domainMin, domainMax],
    range: [rangeMin, rangeMax],
  };
}

function maybeInterpolatePalette(name, values, options, theme, library) {
  const [usePalette] = useLibrary<G2PaletteOptions, PaletteComponent, Palette>(
    'palette',
    library,
  );
  if (name !== 'color') return null;
  const { palette, domain, offset } = options;
  const colors = interpolatedColors(palette, domain, offset);
  if (colors) return colors;
  // const { defaultCategory10: c10, defaultCategory20: c20 } = theme;
  // const defaultPalette = unique(value).length <= c10.length ? c10 : c20;
  // const { palette, offset } = options;
  // const colors =
  //   interpolatedColors(palette, domain, offset) ||
  //   usePalette({ type: palette || defaultPalette });
}

export type LinearOptions = Omit<LinearScaleSpec, 'type'>;

export const Linear: SC<LinearOptions> = (options) => {
  const { library, ...rest } = options;
  return (name, values, coordinate, theme) => {
    const domain = inferDomainQ(values, rest);
    if (name !== 'color') {
      const range = inferRangeN(name);
      return scaleLinear({ ...rest, domain, range });
    }
    const palette = maybeInterpolatePalette(
      name,
      values,
      { ...options, ...domain },
      theme,
      library,
    );
    return typeof palette === 'function'
      ? scaleSequential()
      : scaleLinear({ ...options, domain, range: palette });
  };
};

Linear.props = {};
