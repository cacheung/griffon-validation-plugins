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
  for (let i = 0; i < analyticsResponseEvents.length; i++) {
    const analyticsResponseEvent = analyticsResponseEvents[i];
    const analyticsAnnotation = analyticsResponseEvent.annotations.find(annotation => annotation.type === 'analytics');
    if (!analyticsAnnotation
      || !analyticsAnnotation.payload || !analyticsAnnotation.payload.hitDebugMessage) {
      const { requestEventIdentifier } = analyticsResponseEvent.payload.ACPExtensionEventData;
      const found = analyticsTrackEvents
        .find(event => event.payload.ACPExtensionEventUniqueIdentifier === requestEventIdentifier);
      if (found) {
        valid = false;
        invalidEvents.push(found.uuid);
      }
    }
  }
  const message = valid ? 'Valid! All Analytics events have post-processed data!' : 'Invalid! These events are missing post-processed data.';
  return { message, errors: invalidEvents };
});
