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
      'places.libraries': ['1', '2'],
      'places.endpoint': 'test.com'
    }
  }
}) as Configuration;

const invalidConfiguration = configuration.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'places.libraries': [],
      'places.endpoint': ''
    }
  }
}) as Configuration;

describe('AEP Places Configuration', () => {
  it('should return success when places has been configured correctly', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfiguration,
      validConfiguration
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return invalid when places configuration is missing properties', () => {
    const result: ValidationPluginResult = plugin([invalidConfiguration]);

    expect(result).toMatchObject({
      events: ['2'],
      result: 'not matched'
    });
  });
});
