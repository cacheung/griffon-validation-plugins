import {
  configuration,
  Configuration
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const validConfig = configuration.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'experienceCloud.org': '123',
      'edge.configId': '123',
      'messaging.eventDataset': '123'
    }
  }
}) as Configuration;

const invalidConfig = configuration.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      'experienceCloud.org': '123',
      'edge.configId': ''
    }
  }
}) as Configuration;

describe('AEP IAM Configuration', () => {
  it('should validate if all required configuration keys are present in at least one event', () => {
    const result = plugin([invalidConfig, validConfig]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should not successfully validate when configuration is wrong', () => {
    const result = plugin([invalidConfig, invalidConfig, invalidConfig]);

    expect(result).toMatchObject({
      events: ['2', '2', '2'],
      result: 'not matched'
    });
  });
});
