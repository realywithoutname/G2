import { Canvas } from '@antv/g';
import { G2Context, G2Spec, render } from '../../../src';
import { createNodeGCanvas } from './createNodeGCanvas';
import { renderToMountedElement } from './renderToMountedElement';
import { sleep } from './sleep';

export async function renderSpec(
  generateOptions,
  context: G2Context = {},
  createGCanvas = createNodeGCanvas,
): Promise<Canvas> {
  const { width = 640, height = 480, ...raw }: G2Spec = await generateOptions();
  const gCanvas = createGCanvas(width, height);
  const { mounted, preprocess = (d) => d } = generateOptions;
  const renderFunction = mounted ? renderToMountedElement : render;
  const options = preprocess({ ...raw, width, height });
  context.canvas = gCanvas;
  await new Promise<Canvas>((resolve) =>
    // @ts-ignore
    renderFunction(options, context, resolve),
  );
  // Wait for the next tick.
  await sleep(20);
  return gCanvas;
}
