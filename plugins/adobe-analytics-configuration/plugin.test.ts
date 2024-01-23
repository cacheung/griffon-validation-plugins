import {
  SharedStateConfig,
  sharedStateConfig,
  SharedStateVersions,
  sharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const validConfiguration = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    "metadata": {
      "state.data": {
        "analytics.rsids": "123",
        "analytics.server": "123",
        'global.privacy': 'optedin'
      }
    },
  }
}) as SharedStateConfig;


const inValidConfigurationNoServer = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'analytics.rsids': '123'
    }
  }
}) as SharedStateConfig;

const inValidConfigurationNoRsid = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'analytics.server': '123'
    }
  }
}) as SharedStateConfig;

const invalidConfigurationEmpty = sharedStateConfig.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'analytics.rsids': '',
      'analytics.server': ''
    }
  }
}) as SharedStateConfig;

const invalidConfiguration = sharedStateConfig.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
    }
  }
}) as SharedStateConfig;

const analyticsVersionEvent = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.module.analytics': {
            version: '4.0.0'
          }
        },
        version: '4.0.0'
      }
    }
  }
}) as SharedStateVersions;


describe('Adobe Analytics Configuration', () => {
  it('should return success when analytics has been configured correctly in at least one event', () => {
    const result: ValidationPluginResult = plugin([
      invalidConfiguration,
      inValidConfigurationNoRsid,
      validConfiguration
    ]);

    expect(result).toMatchObject({
      events: [],
      message: 'Valid! Adobe Analytics Extension has been configured!',
      result: 'matched'
    });
  });

  it('should return pass when Analytics configuration is missing properties and no Analytics extension', () => {
    const result: ValidationPluginResult = plugin([inValidConfigurationNoServer]);

    expect(result).toMatchObject({
      events: [],
      message:'no Analytics extension is detected, nothing to validate.',
      result: 'matched'
    });
  });

  it('should return invalid when Analytics configuration is missing event data and Analytics extension exists', () => {
    const result: ValidationPluginResult = plugin([
       inValidConfigurationNoRsid,
       analyticsVersionEvent 
    ]);

    expect(result).toMatchObject({
      events: [],
      message: 'Missing required configuration for Adobe Analytics.',
      result: 'not matched'
    });
  });

  it('should return invalid when Analytics configuration is empty and Analytics extension exists', () => {
    const result: ValidationPluginResult = plugin([
       invalidConfigurationEmpty,
       analyticsVersionEvent 
    ]);

    expect(result).toMatchObject({
      events: [],
      message: 'Missing required configuration for Adobe Analytics.',
      result: 'not matched'
    });
  });

  it('should return valid when Analytics configuration is valid and Analytics extension exists', () => {
    const result: ValidationPluginResult = plugin([
       validConfiguration,
       analyticsVersionEvent 
    ]);

    expect(result).toMatchObject({
      events: [],
      message: 'Valid! Adobe Analytics Extension has been configured!',
      result: 'matched'
    });
  });
});
