import {
  convertToPath,
  DisplayObject,
  IAnimation as GAnimation,
  Path,
} from '@antv/g';
import { AnimationComponent as AC } from '../runtime';
import { Animation } from './types';
import { attributeKeys, attributeOf, effectTiming } from './utils';

export type MorphingOptions = Animation & { split: 'pack' | SplitFunction };

type BBox = [number, number, number, number];

type SplitFunction = (shape: DisplayObject, count: number) => string[];

function localBBoxOf(shape: DisplayObject): BBox {
  const { min, max } = shape.getLocalBounds();
  const [x0, y0] = min;
  const [x1, y1] = max;
  const height = y1 - y0;
  const width = x1 - x0;
  return [x0, y0, width, height];
}

function d(bbox: BBox): string {
  const [x, y, width, height] = bbox;
  return `
    M ${x} ${y}
    L ${x + width} ${y}
    L ${x + width} ${y + height}
    L ${x} ${y + height}
    Z
  `;
}

function pack(shape: DisplayObject, count: number): string[] {
  const [x0, y0, width, height] = localBBoxOf(shape);
  const aspect = height / width;
  const col = Math.ceil(Math.sqrt(count / aspect));
  const row = Math.ceil(count / col);
  const B = [];
  const h = height / row;
  let j = 0;
  let n = count;
  while (n > 0) {
    const c = Math.min(n, col);
    const w = width / c;
    for (let i = 0; i < c; i++) {
      const x = x0 + i * w;
      const y = y0 + j * h;
      B.push(d([x, y, w, h]));
    }
    n -= c;
    j += 1;
  }
  return B;
}

function normalizeSplit(
  split: MorphingOptions['split'] = 'pack',
): SplitFunction {
  if (typeof split == 'function') return split;
  return pack;
}

/**
 * Translate and scale.
 */
function shapeToShape(
  from: DisplayObject,
  to: DisplayObject,
  timeEffect: Record<string, any>,
): GAnimation {
  const [x0, y0, w0, h0] = localBBoxOf(from);

  // Replace first to get right bbox after mounting.
  replaceChild(to, from);

  // Apply translate and scale transform.
  const [x1, y1, w1, h1] = localBBoxOf(to);
  const dx = x0 - x1;
  const dy = y0 - y1;
  const sx = w0 / w1;
  const sy = h0 / h1;
  const keyframes = [
    {
      transform: `translate(${dx}, ${dy}) scale(${sx}, ${sy})`,
      ...attributeOf(from, attributeKeys),
    },
    {
      transform: `translate(0, 0) scale(1, 1)`,
      ...attributeOf(to, attributeKeys),
    },
  ];
  const animation = to.animate(keyframes, timeEffect);
  return animation;
}

/**
 * Replace object and copy className and __data__
 */
function replaceChild(newChild: DisplayObject, oldChild: DisplayObject) {
  newChild['__data__'] = oldChild['__data__'];
  newChild.className = oldChild.className;
  oldChild.parentNode.replaceChild(newChild, oldChild);
}

/**
 * Replace element with a path shape.
 */
function maybePath(node: DisplayObject, d: string): DisplayObject {
  const { nodeName } = node;
  if (nodeName === 'path') return node;
  const path = new Path({
    style: {
      ...attributeOf(node, attributeKeys),
      d,
    },
  });
  replaceChild(path, node);
  return path;
}

function oneToOne(
  shape: DisplayObject,
  from: DisplayObject,
  to: DisplayObject,
  timeEffect: Record<string, any>,
) {
  // If the nodeTypes of from and to are equal,
  // or non of them can convert to path,
  // the apply shape to shape animation.
  const { nodeName: fromName } = from;
  const { nodeName: toName } = to;
  const fromPath = convertToPath(from);
  const toPath = convertToPath(to);
  const isSameNodes = fromName === toName && fromName !== 'path';
  const hasNonPathNode = fromPath === undefined || toPath === undefined;
  if (isSameNodes || hasNonPathNode) return shapeToShape(from, to, timeEffect);

  const pathShape = maybePath(shape, fromPath);
  // Convert Path will take transform, anchor, etc into account,
  // so there is no need to specify these attributes in keyframes.
  const keyframes = [
    {
      path: fromPath,
      ...attributeOf(from, attributeKeys),
    },
    {
      path: toPath,
      ...attributeOf(to, attributeKeys),
    },
  ];
  const animation = pathShape.animate(keyframes, timeEffect);

  // Remove transform because it already applied in path
  // converted by convertToPath.
  // @todo Remove this scale(1, 1)
  pathShape.style.transform = 'scale(1, 1)';
  pathShape.style.transform = 'none';
  return animation;
}

function oneToMultiple(
  from: DisplayObject,
  to: DisplayObject[],
  timeEffect: Record<string, any>,
  split: SplitFunction,
) {
  // Hide the shape to be split before being removing.
  from.style.visibility = 'hidden';
  const D = split(from, to.length);
  return to.map((shape, i) => {
    const path = new Path({
      style: {
        path: D[i],
        ...attributeOf(from, attributeKeys),
      },
    });
    return oneToOne(shape, path, shape, timeEffect);
  });
}

function multipleToOne(
  from: DisplayObject[],
  to: DisplayObject,
  timeEffect: Record<string, any>,
  split: SplitFunction,
) {
  const D = split(to, from.length);
  const { fillOpacity, strokeOpacity, opacity } = to.style;
  const keyframes = [
    { fillOpacity: 0, strokeOpacity: 0, opacity: 0 },
    { fillOpacity: 0, strokeOpacity: 0, opacity: 0, offset: 0.99 },
    {
      fillOpacity,
      strokeOpacity,
      opacity,
    },
  ];
  const animation = to.animate(keyframes, timeEffect);
  const animations = from.map((shape, i) => {
    const path = new Path({
      style: {
        path: D[i],
        fill: to.style.fill,
      },
    });
    return oneToOne(shape, shape, path, timeEffect);
  });
  return [...animations, animation];
}

/**
 * Morphing animations.
 * @todo Support more split function.
 */
export const Morphing: AC<MorphingOptions> = (options) => {
  return (from, to, value, coordinate, defaults) => {
    const split = normalizeSplit(options.split);
    const timeEffect = effectTiming(defaults, value, options);
    const { length: fl } = from;
    const { length: tl } = to;
    if ((fl === 1 && tl === 1) || (fl > 1 && tl > 1)) {
      const [f] = from;
      const [t] = to;
      return oneToOne(f, f, t, timeEffect);
    }
    if (fl === 1 && tl > 1) {
      const [f] = from;
      return oneToMultiple(f, to, timeEffect, split);
    }
    if (fl > 1 && tl === 1) {
      const [t] = to;
      return multipleToOne(from, t, timeEffect, split);
    }
    return null;
  };
};

Morphing.props = {};
