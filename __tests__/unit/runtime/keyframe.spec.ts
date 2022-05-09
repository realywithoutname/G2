import { G2Spec, render } from '../../../src';
import { createDiv, mount } from '../../utils/dom';

describe('render', () => {
  it.only('', () => {
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ];
    const chart = render<G2Spec>({
      type: 'keyframe',
      // iterationCount: 'infinite',
      // direction: 'alternate',
      duration: 6000,
      children: [
        // {
        //   type: 'point',
        //   data,
        //   scale: {
        //     x: { guide: null },
        //     y: { guide: null },
        //   },
        //   encode: {
        //     key: 'genre',
        //     size: 50,
        //   },
        // },
        // {
        //   type: 'point',
        //   data,
        //   scale: {
        //     x: { guide: null, padding: 0.5 },
        //     y: { guide: null },
        //   },
        //   encode: {
        //     x: 'genre',
        //     key: 'genre',
        //     size: 50,
        //   },
        // },
        {
          type: 'interval',
          data,
          encode: {
            x: 'genre',
            y: 'sold',
            key: 'genre',
          },
        },
        {
          type: 'interval',
          data,
          coordinate: [{ type: 'transpose' }],
          encode: {
            y: 'sold',
            key: 'genre',
            color: 'genre',
          },
        },
        {
          type: 'interval',
          data,
          coordinate: [{ type: 'transpose' }, { type: 'polar' }],
          encode: {
            y: 'sold',
            key: 'genre',
            color: 'genre',
          },
        },
        {
          type: 'interval',
          data,
          coordinate: [{ type: 'polar' }],
          encode: {
            x: 'genre',
            y: 'sold',
            color: 'genre',
            key: 'genre',
          },
          style: {
            radius: 10,
          },
        },
        {
          type: 'interval',
          data,
          coordinate: [{ type: 'transpose' }],
          encode: {
            x: 'genre',
            y: 'sold',
            key: 'genre',
          },
        },
        {
          type: 'interval',
          data,
          transform: [
            {
              type: 'sortBy',
              fields: ['sold'],
              order: 'DESC',
            },
          ],
          coordinate: [{ type: 'transpose' }],
          encode: {
            x: 'genre',
            y: 'sold',
            key: 'genre',
            color: 'orange',
          },
        },
      ],
    });
    mount(createDiv(), chart);
  });

  // it('', () => {

  // })

  it.skip('render({}) returns a canvas wrapped in HTMLElement with default size', async () => {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/6b4aa721-b039-49b9-99d8-540b3f87d339.json',
    );
    const raw = await response.json();

    const data = Array.from<string>(new Set(raw.map(JSON.stringify))).map((d) =>
      JSON.parse(d),
    );
    const chart = render<G2Spec>({
      type: 'keyframe',
      // iterationCount: 'infinite',
      direction: 'alternate',
      duration: 4000,
      children: [
        {
          type: 'interval',
          data: [
            { gender: 'female', average: 164.8 },
            { gender: 'male', average: 177.7 },
          ],
          encode: {
            x: 'gender',
            y: 'average',
            color: 'gender',
          },
        },
        {
          type: 'point',
          data,
          encode: {
            x: 'height',
            y: 'weight',
            color: 'gender',
          },
        },
      ],
    });

    mount(createDiv(), chart);
  });
});
