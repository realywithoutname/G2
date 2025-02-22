import { Coordinate } from '@antv/coord';
import { G2Theme, GuideComponentComponent as GCC } from '../runtime';
import { angleOf } from '../utils/coordinate';
import { AxisOptions, LinearAxis } from './axis';

export type AxisRadarOptions = AxisOptions & {
  radar: {
    count: number;
    index: number;
  };
};

function inferTitleTransform(orientation: number) {
  const internalOrientation = orientation % (Math.PI * 2);

  if (internalOrientation === Math.PI / 2) {
    return { titleTransform: 'translate(0, 50%)' };
  }
  if (internalOrientation > -Math.PI / 2 && internalOrientation < Math.PI / 2) {
    return { titleTransform: 'translate(50%, 0)' };
  }
  if (
    internalOrientation > Math.PI / 2 &&
    internalOrientation < (Math.PI * 3) / 2
  ) {
    return { titleTransform: 'translate(-50%, 0)' };
  }
  return {};
}

function inferAxisStyle(
  options: AxisRadarOptions,
  theme: G2Theme,
  coordinate: Coordinate,
  value: Record<string, any>,
) {
  const { radar } = options;
  const {
    scales: [{ name }],
  } = value;
  const [startAngle, endAngle] = angleOf(coordinate);
  const { axisRadar: radarTheme = {} } = theme;

  return {
    ...radarTheme,
    showGrid: name === 'position',
    gridConnect: 'line',
    gridControlAngles: new Array(radar.count).fill(0).map((_, i) => {
      const angle = (endAngle - startAngle) / radar.count;
      // the zero angle of grid is 90 degree
      return startAngle + angle * i + 90;
    }),
  };
}

export const AxisRadar: GCC<AxisRadarOptions> = (options) => {
  const { important = {}, ...restOptions } = options;
  return (scales, value, coordinate, theme) => {
    return LinearAxis({
      ...restOptions,
      ...inferTitleTransform(options.orientation),
      important: {
        ...inferAxisStyle(options, theme, coordinate, value),
        ...important,
      },
    })(scales, value, coordinate, theme);
  };
};

AxisRadar.props = {
  ...LinearAxis.props,
  defaultPosition: 'center',
};
