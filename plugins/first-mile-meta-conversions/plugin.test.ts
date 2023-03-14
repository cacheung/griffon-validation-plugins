import { edgeEvent, EdgeEvent } from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const ssfRuleEvents = edgeEvent.mock({
  uuid: '1',
  payload: {
    messages: [
      'graph.facebook.com',
      'Response Status',
      '200',
      'Response Body',
      'good'
    ],
    name: 'evaluatingRule'
  },
  vendor: 'com.adobe.launch.ssf'
}) as EdgeEvent;

describe('First Mile Meta Conversions API Received Event', () => {
  it('should validate that Meta Conversions API received an event', () => {
    const result: ValidationPluginResult = plugin([ssfRuleEvents]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });
});
