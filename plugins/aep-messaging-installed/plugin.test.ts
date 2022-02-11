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
        extensions: {
          'com.adobe.edge': {
            version: '1.0.0'
          },
          'com.adobe.messaging': {
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

const invalidVersions = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
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

describe('AEP Messaging Installed', () => {
  it('should validate when messaging is installed', () => {
    const result: ValidationPluginResult = plugin([versions]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return invalid when messaging is not installed', () => {
    const result: ValidationPluginResult = plugin([invalidVersions]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });

  it('should return empty message when no configuration events are passed', () => {
    const result: ValidationPluginResult = plugin([]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
