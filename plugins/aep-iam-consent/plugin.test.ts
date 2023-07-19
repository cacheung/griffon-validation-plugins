import { ValidationPluginResult } from 'types/validationPlugin';
import {
  configuration,
  sharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const configEvent = configuration.mock({
  payload: {
    metadata: {
      'state.data': {
        'consent.default': {
          consents: {
            collect: {
              val: 'y'
            }
          }
        }
      }
    }
  }
});

const versionsEvent = sharedStateVersions.mock({
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.edge.consent': {
            version: '1.0.0'
          }
        }
      }
    }
  }
});

describe('AEP IAM Consent', () => {
  it('should validate consent is configured and registered', () => {
    const result: ValidationPluginResult = plugin([configEvent, versionsEvent]);
    expect(result.result).toBe('matched');
  });

  it('should error when consent is configured but not registered', () => {
    const result: ValidationPluginResult = plugin([configEvent]);
    expect(result.result).toBe('not matched');
  });

  it('should error when consent is not configured but registered', () => {
    const result: ValidationPluginResult = plugin([versionsEvent]);
    expect(result.result).toBe('not matched');
  });

  it("should warn when consent isn't installed or registered", () => {
    const result: ValidationPluginResult = plugin([]);
    expect(result.result).toBe('unknown');
  });
});
