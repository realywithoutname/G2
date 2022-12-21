import { G2Spec } from '../../../src';

export function penguinsPointBrushMatrix(): G2Spec {
  const position = [
    'culmen_length_mm',
    'culmen_depth_mm',
    // 'flipper_length_mm',
    // 'body_mass_g',
  ];
  return {
    type: 'repeatMatrix',
    width: position.length * 250,
    height: position.length * 250,
    paddingLeft: 60,
    paddingBottom: 60,
    data: {
      type: 'fetch',
      value: 'data/penguins.csv',
    },
    encode: {
      position,
    },
    children: [
      {
        type: 'point',
        class: 'point',
        encode: {
          color: 'species',
          key: (d) => position.map((key) => d[key]).join('-'),
        },
        style: {
          shape: 'point',
          fillOpacity: 0.7,
          transform: 'scale(1, 1)',
          transformOrigin: 'center center',
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
    ],
  };
}
