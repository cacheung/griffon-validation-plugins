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
      'target.clientCode': '123',
      'target.environmentId': ['123']
    }
  }
}) as Configuration;

const invalidConfiguration = configuration.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'target.clientCode': '',
      'target.environmentId': ''
    }
  }
}) as Configuration;

const invalidConfigurationMissingEventData = configuration.mock({
  uuid: '3',
  payload: {
    ACPExtensionEventData: {}
  }
}) as Configuration;

describe('AEP Target Configuration', () => {
  it('should return success when target has been configured correctly', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfiguration,
      invalidConfigurationMissingEventData,
      validConfiguration
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return invalid when target configuration is missing properties', () => {
    const result: ValidationPluginResult = plugin([invalidConfiguration]);

    expect(result).toMatchObject({
      events: ['2'],
      result: 'not matched'
    });
  });

  it('should return invalid when target configuration is missing event data', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfigurationMissingEventData
    ]);

    expect(result).toMatchObject({
      events: ['3'],
      result: 'not matched'
    });
  });
});
