import { Canvas } from '@antv/g';
import * as chartTests from './tooltips';
import { kebabCase } from './utils/kebabCase';
import { filterTests } from './utils/filterTests';
import { renderSpec } from './utils/renderSpec';
import { createDOMGCanvas } from './utils/createDOMGCanvas';
import { sleep } from './utils/sleep';
import './utils/useSnapshotMatchers';
import './utils/useCustomFetch';

describe('Tooltips', () => {
  const tests = filterTests(chartTests);
  for (const [name, generateOptions] of tests) {
    let gCanvas: Canvas;
    it(`[Tooltip]: ${name}`, async () => {
      try {
        // @ts-ignore
        const { steps: S } = generateOptions;
        if (!S) {
          throw new Error(`Missing steps for ${name}`);
        }

        // @ts-ignore
        const { className = 'tooltip' } = generateOptions;

        // Render chart.
        // @ts-ignore
        generateOptions.before?.();
        gCanvas = await renderSpec(
          generateOptions,
          undefined,
          createDOMGCanvas,
        );

        // Asset each state.
        const steps = S({ canvas: gCanvas });
        const dir = `${__dirname}/snapshots/tooltip-${kebabCase(name)}`;
        for (let i = 0; i < steps.length; i++) {
          const { changeState } = steps[i];
          await changeState();
          await sleep(100);
          await expect(gCanvas).toMatchDOMSnapshot(dir, `step${i}`, {
            selector: `.${className}`,
          });
        }
      } finally {
        gCanvas?.destroy();
        // @ts-ignore
        generateOptions.after?.();
      }
    });
  }
});
