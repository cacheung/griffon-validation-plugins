import {
  sharedStateVersions,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const versionEvent = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.edge.consent': {
            version: '4.0.0'
          }
        },
        version: '4.0.0'
      }
    }
  }
}) as SharedStateVersions;

const invalidVersionEvent = sharedStateVersions.mock({
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

describe('Edge Consent Installed', () => {
  it('should validate when consent has been installed', () => {
    const result = plugin([versionEvent]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should not validate when consent has not been installed', () => {
    const result = plugin([invalidVersionEvent]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });

  it('should not validate when there are no version events', () => {
    const result = plugin([]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
