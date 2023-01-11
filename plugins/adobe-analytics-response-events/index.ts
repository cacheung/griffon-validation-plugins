/*
  Copyright 2022 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import {
  AnalyticsResponse,
  Configuration,
  GenericTrack,
  LifecycleStart
} from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const {
    toolkit: { 'aep-mobile': aepMobile, combineAny, match }
  } = window.griffon;
  const analyticsTrackEvents: GenericTrack[] & LifecycleStart[] = match(
    combineAny([
      aepMobile.genericTrack.matcher,
      aepMobile.lifecycleStart.matcher
    ]),
    events
  );
  const analyticsResponseEvents: AnalyticsResponse[] = match(
    aepMobile.analyticsResponse.matcher,
    events
  ).reduce((map, event) => {
    const { requestEventIdentifier } = event.payload.ACPExtensionEventData;
    return requestEventIdentifier
      ? { [requestEventIdentifier]: event, ...map }
      : map;
  }, {});

  const matchedMessage =
    'All Analytics events have a corresponding AnalyticsResponse event with the debug flag!';
  const notMatchedEvents = [];
  let notMatchedMessage = 'Some events are missing an AnalyticsResponse event!';
  for (let i = 0; i < analyticsTrackEvents.length; i++) {
    const analyticsTrackEvent = analyticsTrackEvents[i];
    const requestEventIdentifier = analyticsTrackEvent.payload
      .ACPExtensionEventUniqueIdentifier as string;
    const found = analyticsResponseEvents[requestEventIdentifier];
    if (!found) {
      notMatchedEvents.push(analyticsTrackEvent.uuid);
    }
  }

  const links = [];

  if (notMatchedEvents.length) {
    const configurationEvents: Configuration[] = match(
      aepMobile.configuration.matcher,
      events
    );
    const optedin = configurationEvents.every((event) => {
      const eventData = aepMobile.configuration.getEventData(event);
      const privacy =
        eventData['global.privacy'] ||
        event.payload.metadata?.['state.data']?.['global.privacy'];
      return privacy === 'optedin';
    });

    if (!optedin) {
      notMatchedMessage +=
        ' If your report suite is not timestamp enabled, hits are discarded until the privacy status changes to `optedin`';
      links.push({
        type: 'doc',
        url: 'https://developer.adobe.com/client-sdks/documentation/adobe-analytics/faq/#verify-current-privacy-status'
      });
    }
  }

  const message = !notMatchedEvents.length ? matchedMessage : notMatchedMessage;
  return {
    events: notMatchedEvents,
    links,
    message,
    result: !notMatchedEvents.length ? 'matched' : 'not matched'
  };
});
