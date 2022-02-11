import {
  sharedStateVersions,
  SharedStateVersions
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const versions = sharedStateVersions.mock({
  uuid: '1',
  payload: {
    metadata: {
      'state.data': {
        extensions: {
          'com.adobe.optimize': {
            version: '1.0.0'
          },
          'com.adobe.edge': {
            version: '1.0.0'
          },
          'com.adobe.edge.identity': {
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
          }
        },
        version: '1.0.0'
      }
    }
  }
}) as SharedStateVersions;

describe('AEP Optimize Prerequisites', () => {
  it('should validate when all prerequisites are installed', () => {
    const result = plugin([versions]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should not successfully validate when configuration is wrong', () => {
    const result = plugin([invalidVersions]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
