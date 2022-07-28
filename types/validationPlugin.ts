import { Event } from '@adobe/griffon-toolkit-common';

export type ValidationFunction = (events: Event[]) => ValidationPluginResult;

export interface ValidationPluginResultLink {
  type: 'doc' | 'product' | 'plugin';
  url: string;
}

export interface ValidationPluginResult {
  events?: string[];
  links?: ValidationPluginResultLink[];
  message: string;
  result?: 'matched' | 'not matched' | 'unknown';
  /** @deprecated Currently legacy supported, please use events instead */
  errors?: string[];
  status?: 'loading' | 'invalid auth' | 'prerequisite missing';
}
