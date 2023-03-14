import { edgeHitReceived, EdgeHitReceived } from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const edgeHitReceivedEvent = edgeHitReceived.mock({
  uuid: '1',
  payload: {
    messages: [
      'hit received',
      '{ "event": {}, "xdm": { "eventType": "MetaConversion_PageView" } }'
    ]
  }
}) as EdgeHitReceived;

describe('First Mile Meta PageView Event Received', () => {
  it('should validate that a Meta PageView event has been received by Edge', () => {
    const result: ValidationPluginResult = plugin([edgeHitReceivedEvent]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });
});
