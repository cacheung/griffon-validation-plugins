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
  },
  annotations: [
    {
      uuid: '1',
      type: 'dev',
      payload: {
        platformProfile: '123'
      }
    }
  ]
}) as SetPushIdentifier;

const setPushIdentifierEventTimeout = setPushIdentifier.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      pushidentifier: '123'
    }
  },
  annotations: [
    {
      uuid: '1',
      type: 'dev'
    }
  ]
}) as SetPushIdentifier;

const setPushIdentifierEventNoTimeout = setPushIdentifier.mock({
  timestamp: 10000000000000000,
  payload: {
    ACPExtensionEventData: {
      pushidentifier: '123'
    }
  },
  annotations: [
    {
      uuid: '1',
      type: 'dev'
    }
  ]
}) as SetPushIdentifier;

describe('AEP Messaging Push on Platform', () => {
  it('should validate when a push identifier event is passed and a profile annotation exists', () => {
    const result: ValidationPluginResult = plugin([setPushIdentifierEvent]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should not match when no valid push identifier event is passed and operation times out', () => {
    const result: ValidationPluginResult = plugin([
      setPushIdentifierEventTimeout
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });

  it('should return loading when no annotation but still in timeout window', () => {
    const result: ValidationPluginResult = plugin([
      setPushIdentifierEventNoTimeout
    ]);

    expect(result).toMatchObject({
      events: [],
      status: 'loading'
    });
  });
});
