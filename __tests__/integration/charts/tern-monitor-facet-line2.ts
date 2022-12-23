import { G2Spec } from '../../../src';
import { DATA, ternMonitorFacetLine } from './tern-monitor-facet-line';

export function ternMonitorFacetLine2(): G2Spec {
  return ternMonitorFacetLine(DATA.slice(DATA.length / 2 + 10));
}

ternMonitorFacetLine2.only = true;
