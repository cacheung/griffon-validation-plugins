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

import { PersonalizationEdgeRequest } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const {
    toolkit: { 'aep-mobile': aepMobile, match }
  } = window.griffon;

  const personalizationEdgeRequests = match(
    aepMobile.personalizationEdgeRequest.matcher,
    events
  ) as PersonalizationEdgeRequest[];

  const invalidEvents: string[] = [];

  const validRequestTypes = [
    'personalization.request',
    'decisioning.propositionDisplay',
    'decisioning.propositionInteract'
  ];

  personalizationEdgeRequests.forEach((request) => {
    if (
      !validRequestTypes.includes(
        request.payload.ACPExtensionEventData.xdm.eventType
      )
    ) {
      invalidEvents.push(request.uuid);
    }
  });

  const valid = !invalidEvents.length;

  const message = valid
    ? 'Valid! All Personalization request have a valid request type'
    : 'Invalid! There are events with an invalid request type';

  return {
    events: invalidEvents,
    message,
    result: valid ? 'matched' : 'not matched'
  };
});
