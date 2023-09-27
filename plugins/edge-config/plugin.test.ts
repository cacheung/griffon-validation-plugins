import {
  sharedStateConfig,
  SharedStateConfig
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const validConfigEvent = sharedStateConfig.mock({
  uuid: '1',
    "metadata": {
      "state.data": {
        "edge.domain": "org5.data.text.net",
        "edge.configId": "d9935ee8-d9d2-419c-b0c7-ea427e8e4626"
      }
    },
}) as SharedStateConfig;

const missingDomainConfigEvent = sharedStateConfig.mock({
  uuid: '1',
    "metadata": {
      "state.data": {
        "edge.configId": "d9935ee8-d9d2-419c-b0c7-ea427e8e4626"
      }
    },
}) as SharedStateConfig;

const httpDomainConfigEvent = sharedStateConfig.mock({
  uuid: '1',
    "metadata": {
      "state.data": {
        "edge.domain": "http://org5.data.text.net",
        "edge.configId": "d9935ee8-d9d2-419c-b0c7-ea427e8e4626"
      }
    },
}) as SharedStateConfig;

const httpsDomainConfigEvent = sharedStateConfig.mock({
  uuid: '1',
    "metadata": {
      "state.data": {
        "edge.domain": "https://org5.data.text.net",
        "edge.configId": "d9935ee8-d9d2-419c-b0c7-ea427e8e4626"
      }
    },
}) as SharedStateConfig;

const wrongDomainConfigEvent = sharedStateConfig.mock({
  uuid: '1',
    "metadata": {
      "state.data": {
        "edge.domain": "123",
        "edge.configId": "d9935ee8-d9d2-419c-b0c7-ea427e8e4626"
      }
    },
}) as SharedStateConfig;

const invalidConfigEvent = sharedStateConfig.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'edge.configId': null
    }
  }
}) as SharedStateConfig;

describe('Edge Config', () => {
  it('should return valid result when edge is configured at the latest shared state', () => {
    const result = plugin([validConfigEvent, invalidConfigEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Edge extension was configured correctly',
      result: 'matched'
    });
  });

  it('should return invalid result when edge config id is missing from configuration', () => {
    const result = plugin([invalidConfigEvent, validConfigEvent]);

    expect(result).toMatchObject({
      events: ['1', '1'],
      message:
      "Did not detect the required Edge Network configuration values. You may need to install the Edge Network extension in the Date Collection UI and publish the settings.",
      result: 'not matched'
    });
  });

  it('should return a invalid result when edge domain name is missing', () => {
    const result = plugin([missingDomainConfigEvent, validConfigEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Edge extension is detected, but Edge Network domain value is not configured properly in the Data Collection UI. The domain name should be a valid domain with no protocol or slashes. For example company.data.adobedc.net would be valid where as https://company.data.adobedc.net/ would not.',
      result: 'not matched'
    });
  });

  it('should return a invalid result when edge domain name has https', () => {
    const result = plugin([httpsDomainConfigEvent, validConfigEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Edge extension is detected, but Edge Network domain value is not configured properly in the Data Collection UI. The domain name should be a valid domain with no protocol or slashes. For example company.data.adobedc.net would be valid where as https://company.data.adobedc.net/ would not.',
      result: 'not matched'
    });
  });

  it('should return a invalid result when edge domain name has http', () => {
    const result = plugin([httpDomainConfigEvent, validConfigEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Edge extension is detected, but Edge Network domain value is not configured properly in the Data Collection UI. The domain name should be a valid domain with no protocol or slashes. For example company.data.adobedc.net would be valid where as https://company.data.adobedc.net/ would not.',
      result: 'not matched'
    });
  });

  it('should return a invalid result when edge domain name do not match regex', () => {
    const result = plugin([wrongDomainConfigEvent, validConfigEvent]);

    expect(result).toMatchObject({
      events: [],
      message: 'Edge extension is detected, but Edge Network domain value is not configured properly in the Data Collection UI. The domain name should be a valid domain with no protocol or slashes. For example company.data.adobedc.net would be valid where as https://company.data.adobedc.net/ would not.',
      result: 'not matched'
    });
  });

  it('should return an invalid result when no configuration event', () => {
    const result = plugin([]);

    expect(result).toMatchObject({
      events: [],
      message:
        "No configuration info could be found. Either Assurance isn't registered or it did not pass in cached events upon activating.",
      result: 'not matched'
    });
  });
});
