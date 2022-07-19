import {
  sharedStateVersions,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from 'types/validationPlugin';
// @ts-ignore
import plugin from './index';

const versions = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        version: '3.4.2',
        extensions: {
          'com.adobe.edge.identity': {
            version: '1.0.1',
            friendlyName: 'Edge Identity'
          },
          'com.adobe.optimize': {
            version: '1.0.0',
            friendlyName: 'Optimize'
          },
          'com.adobe.module.lifecycle': {
            version: '3.4.2',
            friendlyName: 'Lifecycle'
          },
          'com.adobe.messaging': {
            version: '1.1.0',
            friendlyName: 'Messaging'
          },
          'com.adobe.module.configuration': {
            version: '3.4.2',
            friendlyName: 'Configuration'
          },
          'com.adobe.edge.consent': {
            version: '1.0.0',
            friendlyName: 'Consent'
          },
          'com.adobe.module.signal': {
            version: '3.4.2',
            friendlyName: 'Signal'
          },
          'com.adobe.assurance': {
            version: '3.0.1',
            friendlyName: 'Assurance'
          },
          'com.adobe.edge': {
            version: '1.3.0',
            friendlyName: 'AEPEdge'
          }
        }
      }
    }
  }
}) as SharedStateVersions;

const invalidVersions = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.marketing.mobile': {
            version: '1.0.0'
          },
          'com.adobe.edge': {
            version: '1.0.0'
          },
          'com.adobe.core': {
            version: '1.0.0'
          }
        },
        version: '1.0.0'
      }
    }
  }
}) as SharedStateVersions;

describe('AEP IAM Dependencies', () => {
  it('should validate when all dependencies are installed', () => {
    const result: ValidationPluginResult = plugin([versions]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return invalid when dependencies are missing', () => {
    const result: ValidationPluginResult = plugin([invalidVersions]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
