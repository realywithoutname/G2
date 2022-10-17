import { Band } from '@antv/scale';
import { group } from 'd3-array';
import { defined } from '../utils/helper';
import { MarkComponent as MC, Vector2 } from '../runtime';
import { IntervalGeometry } from '../spec';
import { useLibrary } from '../runtime/library';
import {
  baseGeometryChannels,
  basePostInference,
  basePreInference,
} from './utils';
import {
  applyDataTransform,
  flatEncode,
  inferChannelsType,
  extractColumns,
  maybeVisualChannel,
  maybeArrayField,
  addGuideToScale,
  applyDefaults,
} from './mark';

export type IntervalOptions = Omit<IntervalGeometry, 'type'>;

function bandWidth(scale: Band, x: any): number {
  return scale.getBandWidth(scale.invert(x));
}

function createChannel(
  descriptor: Channel,
  nameEncode: [string, ColumnValue],
): Channel {
  const { independent = false, name, scaleName, ...rest } = descriptor;
  const [encodeName, encode] = nameEncode;
  return {
    ...rest,
    ...encode,
    name: encodeName,
    scaleName: scaleName ?? (independent ? encodeName : name),
  };
}

function createMarkInitialize(options, props) {
  const { library, ...mark } = options;
  const [useTransform] = useLibrary('transform', library);
  return async () => {
    const { preInference = [], postInference = [] } = props;
    const { transform = [] } = mark;
    const transforms = [
      applyDefaults,
      applyDataTransform,
      flatEncode,
      inferChannelsType,
      maybeVisualChannel,
      extractColumns,
      maybeArrayField,
      addGuideToScale,
      ...preInference.map(useTransform),
      ...transform.map(useTransform),
      ...postInference.map(useTransform),
    ];
    let index = [];
    let transformedMark = mark;
    for (const t of transforms) {
      [index, transformedMark] = await t(index, transformedMark, { library });
    }
    const { encode, scale } = transformedMark;
    const { channels: channelDescriptors } = props;
    const nameEncodes = group(
      Object.entries(encode).filter(([, value]) => defined(value)),
      ([key]) => {
        const prefix = /([^\d]+)\d*$/.exec(key)?.[1];
        const descriptor = channelDescriptors.find((d) => d.name === prefix);
        if (descriptor?.independent) return key;
        return prefix;
      },
    );
    const channels = channelDescriptors
      .filter((descriptor) => {
        const { name, required } = descriptor;
        if (nameEncodes.has(name)) return true;
        if (required) throw new Error(`Missing encoding for channel: ${name}.`);
        return false;
      })
      .map((descriptor) => {
        const { name, scale: scaleType, scaleKey = name } = descriptor;
        const {
          independent = false,
          key = scaleKey,
          ...scaleOptions
        } = scale[name] || {};
        const encodes = nameEncodes.get(name);
        const values = encodes.map(([, d]) => d.value);
        return {
          name,
          values,
          scaleKey: independent ? Symbol('independent') : key,
          scale: {
            type: scaleType,
            ...scaleOptions,
          },
        };
      });
    return [transformedMark, { index, channels }];
  };
}

const props = {
  channels: [
    ...baseGeometryChannels(),
    { name: 'x', scale: 'band', required: true },
    { name: 'y', required: true },
    { name: 'series', scale: 'band' },
    { name: 'size' },
    { name: 'shapes', range: ['rect', 'hollow', 'funnel', 'pyramid'] },
    {},
  ],
  preInference: [
    ...basePreInference(),
    { type: 'maybeZeroY1' },
    { type: 'maybeZeroX' },
  ],
  postInference: [
    ...basePostInference(),
    { type: 'maybeTitleX' },
    { type: 'maybeTooltipY' },
  ],
};

/**
 * Convert value for each channel to rect shapes.
 * p0        p1
 *    ┌────┐
 *    │    │
 *    │    │
 * p3 └────┘ p2
 */
export const Interval: MC<IntervalOptions> = (options) => {
  return {
    initialize: createMarkInitialize(options, props),
    render(index, scale, value, coordinate, theme) {
      const { x: X, y: Y, y1: Y1, series: S, size: SZ } = value;

      // Calc width for each interval.
      // The scales for x and series channels must be band scale.
      const x = scale.x as Band;
      const series = scale.series as Band;
      const [width] = coordinate.getSize();
      const NSZ = SZ ? SZ.map((d) => +d / width) : null;
      const x1x2 = !SZ
        ? (x: number, w: number, i: number) => [x, x + w]
        : (x: number, w: number, i: number) => {
            const mx = x + w / 2;
            const s = NSZ[i];
            return [mx - s / 2, mx + s / 2];
          };

      // Calc the points of bounding box for the interval.
      // They are start from left-top corner in clock wise order.
      const P = Array.from(index, (i) => {
        const groupWidth = bandWidth(x, X[i]);
        const ratio = series ? bandWidth(series, S?.[i]) : 1;
        const width = groupWidth * ratio;
        const offset = (+S?.[i] || 0) * groupWidth;
        const x0 = +X[i] + offset;
        const [x1, x2] = x1x2(x0, width, i);
        const y1 = +Y[i];
        const y2 = +Y1[i];
        const p1 = [x1, y1];
        const p2 = [x2, y1];
        const p3 = [x2, y2];
        const p4 = [x1, y2];
        return [p1, p2, p3, p4].map((d) => coordinate.map(d)) as Vector2[];
      });
      return [index, P];
    },
  };
};

Interval.props = {
  defaultShape: 'rect',
  defaultLabelShape: 'label',
  channels: [
    ...baseGeometryChannels(),
    { name: 'x', scale: 'band', required: true },
    { name: 'y', required: true },
    { name: 'series', scale: 'band' },
    { name: 'size' },
  ],
  preInference: [
    ...basePreInference(),
    { type: 'maybeZeroY1' },
    { type: 'maybeZeroX' },
  ],
  postInference: [
    ...basePostInference(),
    { type: 'maybeTitleX' },
    { type: 'maybeTooltipY' },
  ],
  shapes: ['rect', 'hollow', 'funnel', 'pyramid'],
};
