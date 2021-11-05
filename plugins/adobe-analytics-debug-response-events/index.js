/*!
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 */
(function (events) {
  const { toolkit: { 'aep-mobile': aepMobile, combineAny, match } } = window.griffon;
  const analyticsTrackEvents = match(combineAny([
    aepMobile.genericTrack.matcher,
    aepMobile.lifecycleStart.matcher
  ]), events);
  const analyticsResponseEvents = match(aepMobile.analyticsResponse.matcher, events)
    /* eslint-disable no-param-reassign */
    .reduce((map, event) => {
      const { requestEventIdentifier } = event.payload.ACPExtensionEventData;
      if (requestEventIdentifier) {
        map[requestEventIdentifier] = event;
      }
      return map;
    }, {});
    /* eslint-enable no-param-reassign */

  const matchedMessage = 'All Adobe Analytics events sent the debug flag!';
  const notMatchedEvents = [];
  const notMatchedMessage = 'Some Adobe Analytics events did not send the debug flag!';
  for (let i = 0; i < analyticsTrackEvents.length; i++) {
    const analyticsTrackEvent = analyticsTrackEvents[i];
    const requestEventIdentifier = analyticsTrackEvent.payload.ACPExtensionEventUniqueIdentifier;
    const found = analyticsResponseEvents[requestEventIdentifier];
    if (found) {
      const { hitUrl } = found?.payload?.ACPExtensionEventData;
      const hasDebug = hitUrl.indexOf('p.&debug=true&.p') > -1;
      if (!hasDebug) {
        notMatchedEvents.push(analyticsTrackEvent.uuid);
      }
    }
  }
  const message = !notMatchedEvents.length ? matchedMessage : notMatchedMessage;
  return {
    events: notMatchedEvents,
    message,
    result: !notMatchedEvents.length ? 'matched' : 'not matched'
  };
});
