import {
  sharedStateVersions,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const bothIdentityValid = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.module.analytics': {
            version: '1.2.10'
          },
          'com.adobe.module.identity': {
            version: '1.3.2'
          },
          'com.adobe.edge': {
            version: '1.4.0'
          },
          'com.adobe.edge.identity': {
            version: '1.1.0'
          }
        },
        version: '3.0.0'
      }
    }
  }
}) as SharedStateVersions;

const edgeIdentityInvalid = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.module.analytics': {
            version: '1.2.10'
          },
          'com.adobe.module.identity': {
            version: '1.3.2'
          },
          'com.adobe.edge': {
            version: '1.4.0'
          }
        },
        version: '3.0.0'
      }
    }
  }
}) as SharedStateVersions;

const coreIdentityInvalid = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.module.analytics': {
            version: '1.2.10'
          },
          'com.adobe.edge': {
            version: '1.4.0'
          },
          'com.adobe.edge.identity': {
            version: '1.1.0'
          }
        },
        version: '3.0.0'
      }
    }
  }
}) as SharedStateVersions;

describe('Identity Extensions Installed', () => {
  it('should match when the Identity and Identity for Edge Network extensions have been installed', () => {
    const result = plugin([bothIdentityValid]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'matched'
    });
  });

  it('should not match when the Edge Network extension is installed but the Identity for Edge Network extension is not', () => {
    const result = plugin([edgeIdentityInvalid]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });

  it('should not match when an Experience Cloud solution extension is installed but the core Identity extension is not', () => {
    const result = plugin([coreIdentityInvalid]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });
});
