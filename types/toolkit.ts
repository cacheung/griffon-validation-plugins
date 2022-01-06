import * as toolkit from '@adobe/griffon-toolkit';
import * as aepMobile from '@adobe/griffon-toolkit-aep-mobile';
import * as edge from '@adobe/griffon-toolkit-edge';

export type GriffonToolkit = typeof toolkit & {
  'aep-mobile': typeof aepMobile;
  edge: typeof edge;
};
