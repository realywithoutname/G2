import { min, max } from 'd3-array';
import { G2Spec } from '../../../src';
import { ternMonitor } from '../data/tern-monitor';
import { ternMonitorYesterday } from '../data/tern-monitor-yesterday';

export const DATA = ((compareData, currentData) => {
  const { cols, rows } = compareData;
  const [, ...metrics] = cols;
  const metricIds = ['cnt', 'uid_cnt', 'm1', 'm2', 'm3', 'm4', 'm5'];
  return rows.flatMap((row, rowIdx) =>
    metrics.flatMap((metric, idx) =>
      metricIds.includes(metric.id)
        ? [
            {
              date: row[0],
              type: 'yesterday',
              metricId: metric.id,
              value: row[idx + 1],
            },
            {
              date: row[0],
              type: 'today',
              metricId: metric.id,
              value: currentData.rows[rowIdx]?.[idx + 1],
            },
          ]
        : [],
    ),
  );
})(ternMonitorYesterday, ternMonitor);

export function ternMonitorFacetLine(data = DATA): G2Spec {
  const WIDTH = 960;
  const HEIGHT = 720;
  const PADDING_TOP = 40;
  const PADDING_Left = 100;
  const VIEW_HEIGHT = HEIGHT - PADDING_TOP;

  // @note: paddingRight of facetRect, remained for display yAxis.
  const INNER_PADDING_RIGHT = 20;

  // @ts-ignore
  const firstDate = min(data, (d) => d.date);
  // @ts-ignore
  const lastDate = max(data, (d) => d.date);

  const xScale: any = {
    type: 'time',
    mask: 'HH:mm',
    domain: [new Date(firstDate || ''), new Date(lastDate || '')],
    nice: true,
    tickCount: 24,
  };
  return {
    type: 'spaceLayer',
    width: WIDTH,
    height: HEIGHT,
    children: [
      {
        type: 'facetRect',
        paddingRight: INNER_PADDING_RIGHT,
        paddingTop: PADDING_TOP,
        paddingLeft: PADDING_Left,
        data: data,
        encode: {
          y: 'metricId',
        },
        legend: { color: false },
        axis: {
          y: false,
        },
        children: [
          {
            type: 'line',
            frame: false,
            encode: {
              x: (d) => new Date(d.date),
              y: 'value',
              color: 'metricId',
              series: 'type',
            },
            scale: {
              // @todo not mutable
              x: { ...xScale },
              y: { facet: false },
            },
            style: {
              strokeOpacity: (data) => {
                return data[0]?.type === 'yesterday' ? 0.25 : 1;
              },
            },
            axis: {
              x: ({ rowIndex }) => {
                return rowIndex === 0
                  ? {
                      labelAutoRotate: false,
                      line: true,
                      grid: false,
                      position: 'top',
                    }
                  : { line: false, grid: false, tick: false, label: false };
              },
              y: {
                labelAutoRotate: false,
                title: false,
                labelFormatter: '~s',
                tick: false,
                grid: false,
              },
            },
          },
        ],
      },
      {
        type: 'point',
        paddingRight: INNER_PADDING_RIGHT,
        paddingTop: PADDING_TOP,
        paddingLeft: PADDING_Left,
        data: [
          {
            date: 1669876200000,
            msg: 'msg1',
          },
          {
            date: 1669888800000,
            msg: 'msg2',
          },
        ],
        encode: {
          x: (d) => new Date(d.date),
          y: 0,
          shape: 'hyphen',
        },
        axis: false,
        scale: {
          x: xScale,
          y: { type: 'identity', independent: true },
        },
        style: {
          stroke: 'red',
          strokeOpacity: 0.45,
          lineWidth: 6,
          transform: 'translate(0, 3)',
        },
      },
      {
        type: 'range',
        paddingRight: INNER_PADDING_RIGHT,
        paddingTop: PADDING_TOP,
        paddingLeft: PADDING_Left,
        clip: true,
        data: [
          {
            x1: 1669867200000,
            x2: 1669878000000,
            msg: 'some hotfix msg.',
          },
        ],
        encode: {
          x: (d) => [new Date(d.x1), new Date(d.x2)],
          y: [0, 24 / VIEW_HEIGHT],
        },
        scale: {
          x: xScale,
          y: { type: 'identity', independent: true },
          shape: { type: 'identity' },
        },
        axis: false,
        labels: [
          {
            text: (d) => d.msg,
            fontSize: 10,
            fill: '#6236FF',
            fillOpacity: 1,
            position: 'left',
            dy: -44,
            dx: 4,
            textBaseline: 'middle',
            connector: true,
            connectorStroke: '#6236FF',
            connectorLineDash: [4, 2],
            background: true,
            backgroundPadding: [2, 4, 0],
            backgroundFill: '#6236FF',
            backgroundFillOpacity: 0.1,
            textOverflow: 'ellipsis',
            wordWrap: true,
            wordWrapWidth: 120,
            maxLines: 1,
          },
        ],
        style: {
          fill: '#653AFF',
          fillOpacity: 0.1,
        },
      },
      {
        type: 'lineX',
        paddingRight: INNER_PADDING_RIGHT,
        paddingTop: PADDING_TOP,
        paddingLeft: PADDING_Left,
        data: [1669867200000, 1669888200000],
        encode: {
          x: (d) => new Date(d),
        },
        scale: {
          x: xScale,
        },
        axis: false,
        style: {
          stroke: '#FA8C16',
          lineDash: [4, 4],
        },
      },
    ],
  };
}

ternMonitorFacetLine.only = true;
