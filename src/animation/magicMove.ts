import { AnimationComponent as AC } from '../runtime';
import { Animation } from '../spec';
import { effectTiming } from './utils';

export type MagicMoveOptions = Animation;

/**
 * Transform mark from transparent to solid.
 */
// @ts-ignore
export const MagicMove: AC<MagicMoveOptions> = (options) => {
  return (shape, style, coordinate, theme) => {
    const { to, ...rest } = style;
    const keyframes = [
      {
        path: shape.style.path,
        x: shape.style.x,
        y: shape.style.y,
        fill: shape.style.fill,
      },
      {
        path: to.style.path,
        transform: to.style.transform,
        x: to.style.x,
        y: to.style.y,
        fill: to.style.fill,
      },
    ];
    // console.log(keyframes)
    return shape.animate(keyframes, effectTiming(theme, rest, options));
  };
};

MagicMove.props = {};
