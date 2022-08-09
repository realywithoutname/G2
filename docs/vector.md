# Vector

## Basic Vector

```js
data = genji.fetchJSON('https://gw.alipayobjects.com/os/antfincdn/F5VcgnqRku/wind.json')
```

```js | dom
G2.render({
  width: 800,
  height: 600,
  type: 'vector',
  data,
  encode: {
    x: 'longitude',
    y: 'latitude',
    rotate: ({ u, v }) => (Math.atan2(v, u) * 180) / Math.PI,
    size: ({ u, v }) => Math.hypot(v, u),
    color: ({ u, v }) => Math.hypot(v, u),
  },
  scale: {
    color: { guide: null },
    size: { range: [6, 20] },
  },
  style: {
    arrow: {
      // arrow size is 40% of the  vector length (encode by `size`)
      size: '40',
    },
  },
});
```
