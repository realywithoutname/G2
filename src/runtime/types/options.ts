import EventEmitter from '@antv/event-emitter';
import type { DisplayObject } from '@antv/g';
import { Canvas, IAnimation as GAnimation } from '@antv/g';
import {
  G2Title,
  G2ViewDescriptor,
  GuideComponentPosition,
  Layout,
  Primitive,
} from './common';
import {
  AdjustComponent,
  AnimationComponent,
  CompositionComponent,
  CoordinateComponent,
  G2BaseComponent,
  G2ComponentNamespaces,
  GuideComponentComponent,
  InferComponent,
  InteractionComponent,
  LabelTransformComponent,
  PaletteComponent,
  Scale,
  ScaleComponent,
  ShapeComponent,
  StatisticComponent,
  ThemeComponent,
} from './component';

import { DataComponent } from './data';
import { EncodeComponent } from './encode';
import { MarkComponent } from './mark';
import { TransformComponent } from './transform';

export type G2ViewTree = {
  width?: number;
  height?: number;
} & Node;

export type Node = {
  type?: string | ((...args: any[]) => any);
  children?: Node[] | ((...args: any[]) => any);
  key?: string;
  [key: string]: any;
};

export type G2Library = Record<
  `${G2ComponentNamespaces}.${string}`,
  G2BaseComponent
>;

// @todo
export type G2Context = {
  library?: G2Library;
  canvas?: Canvas;
  emitter?: EventEmitter;
  group?: DisplayObject;
  animations?: GAnimation[];
  views?: G2ViewDescriptor[];
};

export type G2View = {
  key?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  inset?: number;
  insetLeft?: number;
  insetTop?: number;
  insetRight?: number;
  insetBottom?: number;
  margin?: number;
  marginLeft?: number;
  marginBottom?: number;
  marginTop?: number;
  marginRight?: number;
  theme?: G2ThemeOptions;
  title?: G2TitleOptions;
  coordinates?: G2CoordinateOptions[];
  component?: G2GuideComponentOptions[];
  interactions?: G2InteractionOptions[];
  marks?: G2Mark[];
  frame?: boolean;
  labelTransform?: G2LabelTransformOptions[];
  style?: Record<string, any>;
  tooltip?: boolean;
  clip?: boolean;
};

export type G2Mark = {
  key?: string;
  class?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  data?: any;
  transform?: G2TransformOptions[];
  scale?: Record<string, G2ScaleOptions>;
  encode?: Record<string, any | G2EncodeOptions>;
  type?: string | MarkComponent;
  animate?: Record<string, Primitive>;
  facet?: boolean;
  axis?: boolean | Record<string, any>;
  legend?: boolean | Record<string, any>;
  slider?: Record<string, any>;
  scrollbar?: Record<string, any>;
  filter?: (i: number) => boolean;
  children?: G2MarkChildrenCallback;
  dataDomain?: number;
  modifier?: any;
  frame?: boolean;
  style?: Record<string, Primitive>;
  labels?: Record<string, any>[];
};

export type G2MarkChildrenCallback = (
  visualData: Record<string, any>[],
  scale: Record<string, Scale>,
  layout: Layout,
) => Node[];

export type G2BaseComponentOptions<
  C = G2BaseComponent,
  O = { [key: string | symbol]: any },
> = {
  type?: string | C;
} & O;

export type G2ComponentOptions =
  | G2TransformOptions
  | G2StatisticOptions
  | G2EncodeOptions
  | G2ThemeOptions
  | G2MarkOptions
  | G2CoordinateOptions
  | G2ScaleOptions
  | G2InferOptions
  | G2ShapeOptions
  | G2PaletteOptions
  | G2GuideComponentOptions
  | G2AnimationOptions
  | G2InteractionOptions
  | G2CompositionOptions
  | G2AdjustOptions
  | G2LabelTransformOptions;

export type G2TransformOptions = G2BaseComponentOptions<TransformComponent>;
export type G2StatisticOptions = G2BaseComponentOptions<StatisticComponent>;
export type G2EncodeOptions = G2BaseComponentOptions<EncodeComponent>;
export type G2ThemeOptions = G2BaseComponentOptions<ThemeComponent>;
export type G2MarkOptions = G2BaseComponentOptions<MarkComponent>;
export type G2CoordinateOptions = G2BaseComponentOptions<CoordinateComponent>;
export type G2ScaleOptions = G2BaseComponentOptions<
  ScaleComponent,
  {
    name?: string;
    domain?: any[];
    range?: any[];
    guide?: G2GuideComponentOptions;
    field?: string | string[];
    zero?: boolean;
    [key: string | symbol]: any;
  }
>;
export type G2InferOptions = G2BaseComponentOptions<InferComponent>;
export type G2ShapeOptions = G2BaseComponentOptions<ShapeComponent>;
export type G2PaletteOptions = G2BaseComponentOptions<PaletteComponent>;
export type G2GuideComponentOptions = G2BaseComponentOptions<
  GuideComponentComponent,
  {
    scale?: G2ScaleOptions;
    position?: GuideComponentPosition;
    size?: number;
    order?: number;
    zIndex?: number;
    [key: string | symbol]: any;
  }
>;
export type G2AnimationOptions = G2BaseComponentOptions<AnimationComponent>;
export type G2InteractionOptions = G2BaseComponentOptions<InteractionComponent>;
export type G2CompositionOptions = G2BaseComponentOptions<CompositionComponent>;
export type G2AdjustOptions = G2BaseComponentOptions<AdjustComponent>;
export type G2LabelTransformOptions =
  G2BaseComponentOptions<LabelTransformComponent>;
export type G2TitleOptions = G2Title;
export type G2DataOptions = G2BaseComponent<DataComponent>;
