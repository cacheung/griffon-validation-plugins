import {
  setPushIdentifier,
  SetPushIdentifier
} from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const setPushIdentifierEvent = setPushIdentifier.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      pushidentifier: '123'
    }
  }
}) as SetPushIdentifier;

describe('AEP Messaging PushID', () => {
  it('should validate when a push identifier event is passed', () => {
    const result: ValidationPluginResult = plugin([setPushIdentifierEvent]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should not match when no push identifier event is passed', () => {
    const result: ValidationPluginResult = plugin([]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
