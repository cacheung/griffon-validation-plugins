import {
  analyticsResponse,
  AnalyticsResponse,
  genericTrack,
  GenericTrack,
  lifecycleStart,
  LifecycleStart
} from '@adobe/griffon-toolkit-aep-mobile';
// @ts-ignore
import plugin from './index';

const genericTrackEvent = genericTrack.mock({
  uuid: '1',
  payload: {
    ACPExtensionEventUniqueIdentifier: '1',
    ACPExtensionEventData: {
      contextdata: {},
      requestEventIdentifier: '1'
    }
  }
}) as GenericTrack;

const lifecycleStartEvent = lifecycleStart.mock({
  uuid: '2',
  payload: {
    ACPExtensionEventUniqueIdentifier: '2',
    ACPExtensionEventData: {
      requestEventIdentifier: '2'
    }
  }
}) as LifecycleStart;

const genericTrackTwo = genericTrack.mock({
  uuid: '3',
  payload: {
    ACPExtensionEventUniqueIdentifier: '3',
    ACPExtensionEventData: {
      contextdata: {},
      requestEventIdentifier: '3'
    }
  }
}) as GenericTrack;

const lifecycleStartTwo = lifecycleStart.mock({
  uuid: '4',
  payload: {
    ACPExtensionEventUniqueIdentifier: '4',
    ACPExtensionEventData: {
      requestEventIdentifier: '4'
    }
  }
}) as LifecycleStart;

const analyticsResponseEvent = analyticsResponse.mock({
  uuid: '5',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '1',
      hitUrl: 'somethingp.&debug=true&.psomething',
      headers: {
        ETag: '1'
      }
    }
  }
}) as AnalyticsResponse;

const analyticsResponseTwo = analyticsResponse.mock({
  uuid: '6',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '2',
      hitUrl: 'somethingp.&debug=true&.psomething',
      headers: {
        ETag: '2'
      }
    }
  }
}) as AnalyticsResponse;

const analyticsResponseThree = analyticsResponse.mock({
  uuid: '7',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '3',
      hitUrl: 'test',
      headers: {
        ETag: '3'
      }
    }
  }
}) as AnalyticsResponse;

const analyticsResponseFour = analyticsResponse.mock({
  uuid: '8',
  payload: {
    ACPExtensionEventData: {
      requestEventIdentifier: '4',
      hitUrl: 'test',
      headers: {
        ETag: '4'
      }
    }
  }
}) as AnalyticsResponse;

describe('Adobe Analytics Debug Response Events', () => {
  it('should return a valid response when all events has a matching response event with debug flag', () => {
    const result = plugin([
      genericTrackEvent,
      lifecycleStartEvent,
      analyticsResponseEvent,
      analyticsResponseTwo
    ]);

    expect(result).toMatchObject({
      events: [],
      result: 'matched'
    });
  });

  it('should return an error when any response events are missing a debug flag', () => {
    const result = plugin([
      genericTrackEvent,
      lifecycleStartEvent,
      genericTrackTwo,
      lifecycleStartTwo,
      analyticsResponseEvent,
      analyticsResponseTwo,
      analyticsResponseThree,
      analyticsResponseFour
    ]);

    expect(result).toMatchObject({
      events: ['3', '4'],
      result: 'not matched'
    });
  });
});
