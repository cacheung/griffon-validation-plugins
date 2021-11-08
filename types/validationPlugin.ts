import { Event } from '@adobe/griffon-toolkit-common';

export type ValidationFunction = (events: Event[]) => ValidationPluginResult;

export interface ValidationPluginResult {
  events?: string[];
  message: string;
  result?: string;
  errors?: string[];
  status?: string;
}
