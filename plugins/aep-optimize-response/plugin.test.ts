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
    ACPExtensionEventData: {
      ACPExtensionEventUniqueIdentifier: '1',
      query: {
        personalization: {
          decisionScopes: ['1', '2', '3']
        }
      }
    }
  }
}) as PersonalizationEdgeRequest;

const edgeRequestTwo = personalizationEdgeRequest.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventData: {
      ACPExtensionEventUniqueIdentifier: '1',
      query: {
        personalization: {
          decisionScopes: ['4', '5', '6']
        }
      }
    }
  }
}) as PersonalizationEdgeRequest;

const edgeResponse = personalizationEdgeResponse.mock({
  uuid: '3',
  payload: {
    ACPExtensionEventData: {
      requestEventId: '1',
      payload: [
        {
          scope: '1'
        },
        {
          scope: '2'
        },
        {
          scope: '3'
        }
      ]
    }
  }
}) as PersonalizationEdgeResponse;

const edgeResponseTwo = personalizationEdgeResponse.mock({
  uuid: '4',
  payload: {
    ACPExtensionEventData: {
      requestEventId: '2',
      payload: [
        {
          scope: '4'
        },
        {
          scope: '5'
        },
        {
          scope: '6'
        }
      ]
    }
  }
}) as PersonalizationEdgeResponse;

describe('AEP Optimize Scope Validation', () => {
  it('should validate when all scopes have been responded to', () => {
    const result = plugin([
      edgeRequest,
      edgeRequestTwo,
      edgeResponse,
      edgeResponseTwo
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should not validate when requested scopes do not have a response', () => {
    const result = plugin([edgeRequest, edgeRequestTwo, edgeResponse]);

    expect(result).toMatchObject({
      events: ['1'],
      result: 'not matched'
    });
  });
});
