import { Band as BandScale } from '@antv/scale';
import { BandScale as BandScaleSpec } from '../spec';
import { ScaleComponent as SC } from '../runtime';
import { isTheta } from '../runtime/coordinate';

function inferDomainC(values: Primitive[]) {
  return Array.from(new Set(values.flatMap((d) => d)));
}

function inferPadding(name: string, coordinate: G2CoordinateOptions[]): number {
  // The scale for enterDelay and enterDuration should has zero padding by default.
  // Because there is no need to add extra delay for the start and the end.
  if (name === 'enterDelay' || name === 'enterDuration') return 0;
  return isTheta(coordinate) ? 0 : 0.1;
}

function inferOptionsC(
  name: string,
  coordinate: G2CoordinateOptions[],
  options: G2ScaleOptions,
): G2ScaleOptions {
  if (
    options.padding !== undefined ||
    options.paddingInner !== undefined ||
    options.paddingOuter !== undefined
  ) {
    return options;
  }
  const padding = inferPadding(name, coordinate);
  const { paddingInner = padding, paddingOuter = padding } = options;
  return {
    ...options,
    paddingInner,
    paddingOuter,
    padding,
    unknown: NaN,
  };
}

export type BandOptions = Omit<BandScaleSpec, 'type'>;

export const Band: SC<BandOptions> = (options) => {
  const { library, rangeMin = 0, rangeMax = 1, ...rest } = options;
  return (name, values, coordinate, theme) => {
    return {
      constructor: BandScale,
      domain: inferDomainC(values),
      range: [rangeMin, rangeMax],
      ...inferOptionsC(name, coordinate, rest),
    };
  };
};

Band.props = {};
