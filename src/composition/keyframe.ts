import { deepMix } from '@antv/util';
import { CompositionComponent as CC } from '../runtime';
import { KeyframeComposition } from '../spec';

export type KeyframeOptions = Omit<KeyframeComposition, 'type'>;

function range(
  direction: KeyframeComposition['direction'],
  iterationCount: number,
  keyframeCount: number,
) {
  const start = 0;
  const end = keyframeCount;
  const normal = [start, end];
  const reverse = [-end + 1, -start + 1];
  if (direction === 'normal') return normal;
  if (direction === 'reverse') return reverse;
  if (direction === 'alternate') {
    return iterationCount % 2 === 0 ? normal : reverse;
  }
  if (direction === 'reverse-alternate') {
    return iterationCount % 2 === 0 ? reverse : normal;
  }
}

/**
 * @todo Propagate more options to children.
 */
export const Keyframe: CC<KeyframeOptions> = () => {
  return (options) => {
    const {
      children = [],
      duration: totalDuration = 2000,
      iterationCount = 1,
      direction = 'normal',
    } = options;
    if (!Array.isArray(children) || children.length === 0) return [];
    const duration = totalDuration / children.length;
    const { key } = children[0];
    const newChildren = children.map((d) =>
      deepMix({}, d, {
        key,
        animate: {
          enter: { duration },
          update: { duration, type: 'magicMove', easing: 'ease-in-out-sine' },
          exit: { duration },
        },
      }),
    );
    return function* () {
      let count = 0;
      let prevIndex: number;
      while (iterationCount === 'infinite' || count < iterationCount) {
        const [start, end] = range(direction, count, children.length);
        for (let i = start; i < end; i += 1) {
          const node = newChildren[Math.abs(i)];
          if (Math.abs(i) !== Math.abs(prevIndex)) {
            yield (callback) => {
              callback(node);
              return new Promise<void>((resolve) =>
                setTimeout(resolve, duration),
              );
            };
          }
          prevIndex = i;
        }
        count++;
      }
    };
  };
};

Keyframe.props = {};
