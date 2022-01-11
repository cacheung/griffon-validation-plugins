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

  const personalizationEdgeRequests = match(
    aepMobile.personalizationEdgeRequest.matcher,
    events
  ) as PersonalizationEdgeRequest[];

  const personalizationEdgeResponses = match(
    aepMobile.personalizationEdgeResponse.matcher,
    events
  ) as PersonalizationEdgeResponse[];

  const invalidEvents: string[] = [];

  personalizationEdgeRequests.forEach((request) => {
    const response = personalizationEdgeResponses.find((edgeResponse) => {
      const requestId =
        edgeResponse.payload?.ACPExtensionEventData?.requestEventId;
      return (
        requestId ===
        request.payload?.ACPExtensionEventData
          ?.ACPExtensionEventUniqueIdentifier
      );
    });

    if (!response) {
      invalidEvents.push(request.uuid);
    }
  });

  const valid = !!invalidEvents.length;

  const message = valid
    ? 'Valid! All Personalization request events have a corresponding Personalization response event'
    : 'Invalid! There are events missing an Personalization response event:';

  return {
    events: invalidEvents,
    message,
    result: valid ? 'matched' : 'not matched'
  };
});
