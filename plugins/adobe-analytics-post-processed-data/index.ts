/*
  Copyright 2021 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import { Event } from '@adobe/griffon-toolkit-common';
import { GenericTrack } from '@adobe/griffon-toolkit-aep-mobile';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const {
    toolkit: { 'aep-mobile': aepMobile, combineAny, match }
  } = window.griffon;
  const analyticsTrackEvents = match(
    combineAny([
      aepMobile.genericTrack.matcher,
      aepMobile.lifecycleStart.matcher
    ]),
    events
  ) as GenericTrack[];
  let valid = true;
  const invalidEvents: string[] = [];
  for (let i = 0; i < analyticsTrackEvents.length; i++) {
    const analyticsTrackEvent = analyticsTrackEvents[i];
    const analyticsAnnotation = analyticsTrackEvent.annotations.find(
      (annotation) => annotation.type === 'analytics'
    );
    if (
      !analyticsAnnotation ||
      !analyticsAnnotation.payload ||
      !analyticsAnnotation.payload.hitDebugMessage
    ) {
      valid = false;
      invalidEvents.push(analyticsTrackEvent.uuid);
    }
  }
  const message = valid
    ? 'Valid! All Analytics events have post-processed data!'
    : 'Invalid! These events are missing post-processed data:';
  return {
    events: invalidEvents,
    message,
    result: valid ? 'matched' : 'not matched'
  };
});
