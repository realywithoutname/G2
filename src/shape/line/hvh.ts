import { curveStep } from 'd3-shape';
import { ShapeComponent as SC } from '../../runtime';
import { Curve } from './curve';

export type HVHOptions = Record<string, any>;

export const HVH: SC<HVHOptions> = (options) => {
  return Curve({ curve: curveStep, ...options });
};

HVH.props = {
  ...Curve.props,
};
