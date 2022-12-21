import { CompositionComponent as CC } from '../runtime';
import { MarkComposition } from '../spec';

export type MarkOptions = Omit<MarkComposition, 'type'>;

// @todo Move this to runtime.
export const Mark: CC<MarkOptions> = () => {
  return (options) => {
    const {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      padding,
      inset,
      insetLeft,
      insetTop,
      insetRight,
      insetBottom,
      margin,
      marginLeft,
      marginBottom,
      marginTop,
      marginRight,
      data,
      coordinates,
      theme,
      components,
      interactions,
      x,
      y,
      key,
      frame,
      title,
      labelTransform,
      parentKey,
      clip,
      class: className,
      ...mark
    } = options;

    return [
      {
        type: 'standardView',
        class: className,
        x,
        y,
        key,
        width,
        height,
        padding,
        paddingLeft,
        paddingRight,
        paddingTop,
        inset,
        insetLeft,
        insetTop,
        insetRight,
        insetBottom,
        paddingBottom,
        theme,
        coordinates,
        components,
        interactions,
        frame,
        title,
        labelTransform,
        margin,
        marginLeft,
        marginBottom,
        marginTop,
        marginRight,
        parentKey,
        clip,
        marks: [{ ...mark, key: `${key}-0`, data }],
      },
    ];
  };
};

Mark.props = {};
