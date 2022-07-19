import {
  configuration,
  Configuration
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const configEvent = configuration.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'edge.configId': '123'
    }
  }
}) as Configuration;

const invalidConfigEvent = configuration.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      'edge.configId': null
    }
  }
}) as Configuration;

describe('Edge Config', () => {
  it('should return a valid response when edge is configured', () => {
    const result = plugin([invalidConfigEvent, configEvent]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return a invalid response when edge is missing from configuration', () => {
    const result = plugin([invalidConfigEvent, invalidConfigEvent]);

    expect(result).toMatchObject({
      events: ['1', '1'],
      result: 'not matched'
    });
  });

  it('should return a invalid response when no configuration events are passed', () => {
    const result = plugin([]);

    expect(result).toMatchObject({
      events: [],
      result: 'not matched'
    });
  });
});
