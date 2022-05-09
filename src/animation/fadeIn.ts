import { AnimationComponent as AC } from '../runtime';
import { Animation } from '../spec';
import { effectTiming } from './utils';

export type FadeInYOptions = Animation;

/**
 * Transform mark from transparent to solid.
 */
export const FadeIn: AC<FadeInYOptions> = (options) => {
  return (shape, style, coordinate, theme) => {
    const { opacity } = shape.style;
    const keyframes = [
      { opacity: 0 },
      { opacity: opacity === '' ? 1 : opacity },
    ];
    return shape.animate(keyframes, effectTiming(theme, style, options));
  };
};

FadeIn.props = {};
