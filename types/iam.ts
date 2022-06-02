import { PersonalizationEdgeResponse } from '@adobe/griffon-toolkit-aep-mobile';

export interface DecodedScope {
  'xdm:name': string;
}

export interface IAMPersonalizationItem {
  id: string;
  data: {
    id: string;
    content: string;
  };
}

export type IAMPersonalizationResponse = PersonalizationEdgeResponse & {
  payload: {
    id: string;
    scope: string;
    activity: {
      id: string;
    };
    placement: {
      id: string;
    };
    items: IAMPersonalizationItem[];
    ACPExtensionEventData: {
      payload: Array<{
        activity: {
          etag: string;
          id: string;
        };
        id: string;
        placement: {
          etag: string;
          id: string;
        };
        scope: string;
      }>;
    };
  };
};
