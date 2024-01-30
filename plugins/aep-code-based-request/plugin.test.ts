import { propositionsRequest } from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const request = propositionsRequest.mock({
  payload: {
    ACPExtensionUniqueID: '1',
    ACPExtensionEventData: {
      surfaces: [
        { uri: 'mobileapp://test.app' },
        { uri: 'mobileapp://test2.app' }
      ]
    }
  }
});

const response = propositionsRequest.mock({
  payload: {
    ACPExtensionParentID: '1',
    ACPExtensionEventData: {
      propositions: [
        { scope: 'mobileapp://test.app' },
        { scope: 'mobileapp://test2.app' }
      ]
    }
  }
});

const response2 = propositionsRequest.mock({
  payload: {
    ACPExtensionParentID: '1',
    ACPExtensionEventData: {
      propositions: [{ scope: 'mobileapp://test.app' }]
    }
  }
});

describe('AEP Code Based Validation', () => {
  it('should validate payloads have valid content', () => {
    const result = plugin([request, response]);
    expect(result.result).toBe('matched');
  });

  it('should return errors when there is no response', () => {
    const result = plugin([request]);
    expect(result.result).toBe('not matched');
    expect(result.events.length).toBe(1);
  });

  it('should return errors when not all scopes are returned', () => {
    const result = plugin([request, response2]);
    expect(result.result).toBe('not matched');
    expect(result.events.length).toBe(1);
  });
});
