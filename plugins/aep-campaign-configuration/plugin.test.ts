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
      'campaign.server': '123',
      'campaign.pkey': '123',
      'campaign.mcias': '123'
    }
  }
}) as Configuration;

const invalidConfiguration = configuration.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'campaign.server': '123',
      'campaign.pkey': ''
    }
  }
}) as Configuration;

describe('AEP Campaign Configuration', () => {
  it('should return success when campaign has been configured correctly', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfiguration,
      validConfiguration
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return invalid when campaign configuration is missing properties', () => {
    const result: ValidationPluginResult = plugin([invalidConfiguration]);

    expect(result).toMatchObject({
      events: ['2'],
      result: 'not matched'
    });
  });
});
