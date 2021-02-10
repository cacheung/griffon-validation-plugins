/*!
 * Copyright 2020 Adobe. All rights reserved.
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
  const analyticsTrackEvents = events.filter(event => event.type === 'AnalyticsTrack' || event.type === 'LifecycleStart');
  const analyticsResponseEvents = events.filter(event => event.type === 'AnalyticsResponse');
  let valid = true;
  const invalidEvents = [];
  for (let i = 0; i < analyticsTrackEvents.length; i++) {
    const analyticsTrackEvent = analyticsTrackEvents[i];
    const requestEventIdentifier = analyticsTrackEvent.payload.ACPExtensionEventUniqueIdentifier;
    const found = analyticsResponseEvents.find(event =>
      event.payload.ACPExtensionEventData.requestEventIdentifier === requestEventIdentifier);
    if (!found) {
      valid = false;
      invalidEvents.push(analyticsTrackEvent.uuid);
    }
  }
  const message = valid ? 'Valid! All Analytics events have a corresponding AnalyticsResponse event' : 'Invalid! There are events missing an AnalyticsResponse event:';
  return {
    events: invalidEvents,
    message,
    result: valid ? 'matched' : 'not matched'
  };
});
