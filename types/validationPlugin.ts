import { Event } from '@adobe/griffon-toolkit-common';

export type ValidationFunction = (events: Event[]) => ValidationPluginResult;

export interface ValidationPluginResult {
  events?: string[];
  message: string;
  result?: 'matched' | 'not matched';
  errors?: string[];
  status?: 'loading' | 'invalid auth' | 'prerequisite missing';
}
