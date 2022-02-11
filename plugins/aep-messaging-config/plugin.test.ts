import {
  configuration,
  Configuration
} from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const validConfiguration = configuration.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'messaging.dccs': '123',
      'messaging.profileDataset': '123',
      'messaging.eventDataset': '123'
    }
  }
}) as Configuration;

const invalidConfiguration = configuration.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'messaging.dccs': '123',
      'messaging.profileDataset': ''
    }
  }
}) as Configuration;

describe('Adobe Messaging Config', () => {
  it('should return success when messaging has been configured correctly in at least one event', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfiguration,
      validConfiguration
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return invalid when messaging configuration is missing properties', () => {
    const result: ValidationPluginResult = plugin([invalidConfiguration]);

    expect(result).toMatchObject({
      events: ['2'],
      result: 'not matched'
    });
  });

  it('should return a message that no events were found when no configuration events are passed', () => {
    const result: ValidationPluginResult = plugin([]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
