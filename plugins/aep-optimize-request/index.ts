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

import {
  PersonalizationEdgeRequest,
  PersonalizationEdgeResponse
} from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const {
    toolkit: { 'aep-mobile': aepMobile, match }
  } = window.griffon;

  const validRequestTypes = [
    'personalization.request',
    'decisioning.propositionDisplay',
    'decisioning.propositionInteract'
  ];

  const personalizationEdgeRequests = match(
    aepMobile.personalizationEdgeRequest.matcher,
    events
  ) as PersonalizationEdgeRequest[];

  const personalizationEdgeResponses = match(
    aepMobile.personalizationEdgeResponse.matcher,
    events
  ) as PersonalizationEdgeResponse[];

  const invalidEvents: string[] = [];

  const responseIds = personalizationEdgeResponses.map(
    (response) => response.payload?.ACPExtensionEventData?.requestEventId
  );

  personalizationEdgeRequests.forEach((request) => {
    if (
      !responseIds.includes(request.payload.ACPExtensionEventUniqueIdentifier)
    ) {
      invalidEvents.push(request.uuid);
    }
  });

  const invalidRequestTypes: string[] = [];

  personalizationEdgeRequests.forEach((request) => {
    if (
      !validRequestTypes.includes(
        request.payload.ACPExtensionEventData.xdm.eventType
      )
    ) {
      invalidRequestTypes.push(request.uuid);
    }
  });

  const valid = !invalidEvents.length && !invalidRequestTypes.length;

  const messages: string[] = [];

  if (invalidEvents.length) {
    messages.push(
      'There are events missing an Personalization response event.'
    );
  }

  if (invalidRequestTypes.length) {
    messages.push('There are events with an invalid request type.');
  }

  const message = valid
    ? 'Valid! All Personalization request events have a corresponding Personalization response event and valid request types.'
    : messages.join(' ');

  return {
    events: [...invalidEvents, ...invalidRequestTypes],
    message,
    result: valid ? 'matched' : 'not matched'
  };
});
