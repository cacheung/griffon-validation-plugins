import {
  personalizationEdgeRequest,
  PersonalizationEdgeRequest,
  personalizationEdgeResponse,
  PersonalizationEdgeResponse
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const edgeRequest = personalizationEdgeRequest.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: '1',
    ACPExtensionEventData: {
      query: {
        personalization: {
          decisionScopes: ['1']
        }
      }
    }
  }
}) as PersonalizationEdgeRequest;

const edgeResponse = personalizationEdgeResponse.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventData: {
      requestEventId: '1'
    }
  }
}) as PersonalizationEdgeResponse;

describe('AEP Optimize Request', () => {
  it('should validate that every optimize request has a corresponding response', () => {
    const result = plugin([edgeRequest, edgeResponse]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return errors when a request does not have a corresponding response', () => {
    const result = plugin([edgeRequest]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });
});
