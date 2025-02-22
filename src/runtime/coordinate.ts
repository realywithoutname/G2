import { Coordinate } from '@antv/coord';
import { G2View, G2CoordinateOptions, G2Library } from './types/options';
import { CoordinateComponent, CoordinateTransform } from './types/component';
import { useLibrary } from './library';
import { Layout } from './types/common';

export function createCoordinate(
  layout: Layout,
  partialOptions: G2View,
  library: G2Library,
): Coordinate {
  const [useCoordinate] = useLibrary<
    G2CoordinateOptions,
    CoordinateComponent,
    CoordinateTransform
  >('coordinate', library);
  const {
    innerHeight,
    innerWidth,
    insetLeft,
    insetTop,
    insetRight,
    insetBottom,
    marginLeft,
    marginTop,
  } = layout;
  const { coordinates: partialTransform = [] } = partialOptions;
  const transform = inferCoordinate(partialTransform);
  const coordinate = new Coordinate({
    // @todo Find a better solution.
    // Store more layout information for component.
    ...layout,
    x: insetLeft + marginLeft,
    y: insetTop + marginTop,
    width: innerWidth - insetLeft - insetRight,
    height: innerHeight - insetBottom - insetTop,
    transformations: transform.map(useCoordinate).flat(),
  });
  return coordinate;
}

export function coordOf(
  coordinates: G2CoordinateOptions[],
  type: string,
): G2CoordinateOptions[] {
  return coordinates.filter((d) => d.type === type);
}

/**
 * todo Duplication is not considered
 */

export function isPolar(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'polar').length > 0;
}

export function isHelix(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'helix').length > 0;
}

/**
 * todo The number of transposes matters
 */
export function isTranspose(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'transpose').length % 2 === 1;
}

export function isParallel(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'parallel').length > 0;
}

export function isTheta(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'theta').length > 0;
}

export function isReflect(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'reflect').length > 0;
}

export function isRadial(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'radial').length > 0;
}

export function isRadar(coordinates: G2CoordinateOptions[]) {
  return isParallel(coordinates) && isPolar(coordinates);
}

/**
 * todo The axis corresponding to the Y reversal is not reversed
 */
export function isReflectY(coordinates: G2CoordinateOptions[]) {
  return coordOf(coordinates, 'reflectY').length > 0;
}

function inferCoordinate(
  coordinates: G2CoordinateOptions[],
): G2CoordinateOptions[] {
  if (coordinates.find((d) => d.type === 'cartesian')) return coordinates;
  return [...coordinates, { type: 'cartesian' }];
}
