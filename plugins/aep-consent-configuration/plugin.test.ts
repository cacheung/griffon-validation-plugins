import {
  SharedStateConfig,
  sharedStateConfig,
  sharedStateVersions,
  SharedStateVersions
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

const configConsentEventNoVal  = sharedStateConfig.mock({
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

describe('Consent Default Config', () => {
  it('should show default consent value is yes', () => {
    const result = plugin([configEventValY]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is set to yes. Events are sent to the Edge Network.',
      events: [],
      result: 'matched'
    });
  });

  it('should show default consent value is no', () => {
    const result = plugin([configEventValN]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is set to no. Events are dropped until the status is updated to yes or pending.',
      events: [],
      result: 'unknown'
    });
  });

  it('should show default consent value is pending', () => {
    const result = plugin([configEventValP]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is set to pending. Events are queued until the status is updated to yes or no.',
      events: [],
      result: 'unknown'
    });
  });

  it('should show no consent Tag registered but consent sdk was installed', () => {
    const result = plugin([versionEvent]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is not set, but the Consent SDK extension is registered. This is a required setting, and events may be blocked on the device by the Edge SDK extension until the collect consent level is specified.  Please follow the steps in the link to configure the Consent extension in Data Collection UI then reload this validator.',
      events: [],
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
        }
      ],
      result: 'not matched'
    });
  });

  it('should show no default collect consent message', () => {
    const result = plugin([configConsentEventNoVal]);
    expect(result).toMatchObject({
      message: 'Default collect consent level is not set. By default the collect consent settings used for Edge Network events is yes. If you intended to use the Consent extension to control these settings, please follow the steps in the link then reload this validator.',
      events: [],
      result: 'unknown'
    });
  });
});
