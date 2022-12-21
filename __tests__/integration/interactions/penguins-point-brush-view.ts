import { csv } from 'd3-fetch';
import { autoType } from 'd3-dsv';
import { G2Spec } from '../../../src';

export async function penguinsPointBrushView(): Promise<G2Spec> {
  const position = [
    'culmen_length_mm',
    'culmen_depth_mm',
    'flipper_length_mm',
    'body_mass_g',
  ];
  const data = await csv('data/penguins.csv', autoType);
  return {
    type: 'spaceFlex',
    width: 800,
    height: 400,
    children: [
      {
        type: 'point',
        class: 'point',
        data,
        encode: {
          color: 'species',
          x: 'culmen_length_mm',
          y: 'culmen_depth_mm',
          key: (d) => position.map((key) => d[key]).join('-'),
        },
        style: {
          shape: 'point',
          fillOpacity: 0.7,
          transform: 'scale(1, 1)',
          transformOrigin: 'center center',
        },
        legend: false,
        scale: { x: { nice: true }, y: { nice: true } },
        axis: {
          x: { tickCount: 5 },
          y: { tickCount: 5 },
        },
        interactions: [
          {
            type: 'brushHighlight',
            class: 'point',
            unhighlightedFill: 'black',
            unhighlightedFillOpacity: 1,
            unhighlightedTransform: 'scale(0.5, 0.5)',
          },
        ],
      },
      {
        type: 'point',
        class: 'point',
        data,
        encode: {
          color: 'species',
          x: 'flipper_length_mm',
          y: 'body_mass_g',
          key: (d) => position.map((key) => d[key]).join('-'),
        },
        style: {
          shape: 'point',
          fillOpacity: 0.7,
          transform: 'scale(1, 1)',
          transformOrigin: 'center center',
        },
        legend: false,
        scale: { x: { nice: true }, y: { nice: true } },
        axis: {
          x: { tickCount: 5 },
          y: { tickCount: 5 },
        },
      },
    ],
  };
}
