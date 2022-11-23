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
      'analytics.rsids': '123',
      'analytics.server': '123'
    }
  }
}) as Configuration;

const alsoValidConfiguration = configuration.mock({
  uuid: '4',
  payload: {
    metadata: {
      'state.data': {
        'analytics.rsids': 'rsids',
        'global.privacy': 'optedin',
        'analytics.launchHitDelay': 0,
        'analytics.server': 'analytics.server'
      }
    }
  }
}) as Configuration;

const invalidConfiguration = configuration.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'analytics.rsids': '',
      'analytics.server': ''
    }
  }
});

const invalidConfigurationMissingEventData = configuration.mock({
  uuid: '3',
  payload: {
    ACPExtensionEventData: {}
  }
}) as Configuration;

describe('Adobe Analytics Configuration', () => {
  it('should return success when target has been configured correctly in at least one event', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfiguration,
      invalidConfigurationMissingEventData,
      validConfiguration
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });

    const result2: ValidationPluginResult = plugin([
      invalidConfiguration,
      invalidConfigurationMissingEventData,
      alsoValidConfiguration
    ]);

    expect(result2).toMatchObject({
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
