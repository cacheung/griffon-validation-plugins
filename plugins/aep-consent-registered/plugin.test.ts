import {
  sharedStateVersions,
  SharedStateVersions,
  SharedStateConfig,
  sharedStateConfig,
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

const consentTagExist = sharedStateConfig.mock({
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

describe('Edge Consent SDK Registered', () => {
  it('should validate when consent has been installed', () => {
    const result = plugin([versionEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Consent Extension was registered. Make sure default consent is also setup in the Data Collection UI.',
      result: 'matched'
    });
  });

  it('should show consent tag were detected, but the consent extension is not installed', () => {
    const result = plugin([invalidVersionEvent, consentTagExist]);

    expect(result).toMatchObject({
      events: [],
      message: 'Default collect consent settings were detected, but the Consent extension is either not installed or not registered with the Mobile Core. Please follow the link for instructions.',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
        }
      ],
      result: 'not matched'
    });
  });

  it('should show consent extension is not installed and default consent is set to yes (in no consent tag installed case)', () => {
    const result = plugin([invalidVersionEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Consent extension is not installed or registered with the Mobile Core. By default the collect consent settings used for Edge Network events is yes. If you intended to use the Consent extension to control these settings, please follow the steps in the link then reload this validator.',
      links: [
        {
          type: 'doc',
          url: 'https://developer.adobe.com/client-sdks/documentation/consent-for-edge-network/'
        }
      ],
      result: 'unknown'
    });
  });

  it('should not validate when there are no version events', () => {
    const result = plugin([]);

    expect(result).toMatchObject({
      events: [],
      message:
          "No version info could be found. Either Assurance isn't registered or it did not pass in cached events upon activating.",
      result: 'not matched'
    });
  });
});
