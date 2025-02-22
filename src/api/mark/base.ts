import { DisplayObject } from '@antv/g';
import { Node } from '../node';
import { G2MarkState, Scale } from '../../runtime';

export class MarkBase<
  Value extends Record<string, any> = Record<string, any>,
  ParentValue extends Record<string, any> = Record<string, any>,
  ChildValue extends Record<string, any> = Record<string, any>,
> extends Node<Value, ParentValue, ChildValue> {
  changeData(data: any) {
    const chart = this.root();
    if (!chart) return;
    this.attr('data', data);
    chart?.render();
  }

  /**
   * Get mark from chart views.
   */
  getMark(): G2MarkState {
    const chartView = this.root()?.getView();
    if (!chartView) return undefined;
    const { markState } = chartView;
    const markKey = Array.from(markState.keys()).find(
      (item) => item.key === this.attr('key'),
    );
    return markState.get(markKey);
  }

  /**
   * Get all scales instance.
   */
  getScale(): Record<string, Scale> {
    const chartView = this.root()?.getView();
    if (!chartView) return undefined;
    return chartView?.scale;
  }

  /**
   * Get the scale instance by channel.
   */
  getScaleByChannel(channel: string): Scale {
    const chartView = this.root()?.getView();
    if (!chartView) return undefined;
    return chartView?.scale?.[channel];
  }

  /**
   * Get canvas group.
   */
  getGroup(): DisplayObject {
    const key = this.attr('key');
    if (!key) return undefined;
    const chart = this.root();
    const chartGroup = chart.context().canvas.getRoot();
    return chartGroup.getElementById(key);
  }
}
