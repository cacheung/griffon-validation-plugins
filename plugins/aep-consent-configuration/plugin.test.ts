import {
  SharedStateConfig,
  SharedStateConfig
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const configEventValY = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    "metadata": {
      "state.data": {
        "edge.configId": "12345-6789-1011-1213-123456789012",
        "consent.default": {
          "consents": {
            "collect": {
              "val": "y"
            }
          }
        },
      }
    },
  }
}) as SharedStateConfig;

const configEventValN  = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    "metadata": {
      "state.data": {
        "edge.configId": "12345-6789-1011-1213-123456789012",
        "consent.default": {
          "consents": {
            "collect": {
              "val": "n"
            }
          }
        },
      }
    },
  }
}) as SharedStateConfig;

const configEventValP  = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    "metadata": {
      "state.data": {
        "edge.configId": "12345-6789-1011-1213-123456789012",
        "consent.default": {
          "consents": {
            "collect": {
              "val": "p"
            }
          }
        },
      }
    },
  }
}) as SharedStateConfig;

const configEventNoVal  = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    "metadata": {
      "state.data": {
        "edge.configId": "12345-6789-1011-1213-123456789012",
        "lifecycle.sessionTimeout": 300,
      }
    },
  }
}) as SharedStateConfig;

describe('Consent Default Config', () => {
  it('should show default consent value is yes', () => {
    const result = plugin([configEventValY]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is set to yes',
      events: [],
      result: 'matched'
    });
  });

  it('should show default consent value is no', () => {
    const result = plugin([configEventValN]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is set to no',
      events: [],
      result: 'unknown'
    });
  });

  it('should show default consent value is pending', () => {
    const result = plugin([configEventValP]);
    expect(result).toMatchObject({
      message: 'Default collect consent is set to pending; events are queued until the settings are changed to yes / no',
      events: [],
      result: 'unknown'
    });
  });

  it('should show no default collect consent message', () => {
    const result = plugin([configEventNoVal]);
    expect(result).toMatchObject({
      message: 'Default collect consent settings are not found, check that you install and configure the Consent extension in data collection UI',
      events: [],
      result: 'unknown'
    });
  });
});
