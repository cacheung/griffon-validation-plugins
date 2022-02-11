import {
  analyticsHit,
  AnalyticsHit,
  analyticsMapping,
  AnalyticsMapping,
  edgeHitReceived,
  EdgeHitReceived
} from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const analyticsHitEvent = analyticsHit.mock({
  uuid: '1',
  payload: {
    attributes: {
      hitId: '1'
    },
    requestId: '1'
  }
}) as AnalyticsHit;

const analyticsMappingEvent = analyticsMapping.mock({
  uuid: '2',
  payload: {
    attributes: {
      primaryHitId: '1'
    }
  }
}) as AnalyticsMapping;

const edgeHitReceivedEvent = edgeHitReceived.mock({
  uuid: '3'
}) as EdgeHitReceived;

describe('AEP Edge Analytics Mapping', () => {
  it('should validate that each analytics hit event has a matching analytics mapping event', () => {
    const result: ValidationPluginResult = plugin([
      analyticsHitEvent,
      analyticsMappingEvent,
      edgeHitReceivedEvent
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });
});
