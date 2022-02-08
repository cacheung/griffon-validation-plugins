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
  const { toolkit: kit } = window.griffon;
  const { personalizationEdgeRequest, personalizationEdgeResponse } =
    kit['aep-mobile'];
  const personalizationRequests = kit.match(
    personalizationEdgeRequest.matcher,
    events
  ) as PersonalizationEdgeRequest[];

  const personalizationResponses = kit.match(
    personalizationEdgeResponse.matcher,
    events
  ) as PersonalizationEdgeResponse[];

  const requestScopes = personalizationRequests.map((request) => ({
    uuid: request.uuid,
    scopes:
      request.payload.ACPExtensionEventData.query.personalization.decisionScopes
  }));

  const responseScopes = personalizationResponses.map(
    (response) => response.payload.scope
  );

  const errors = requestScopes.reduce((result, { uuid, scopes }) => {
    if (scopes.some((scope) => !responseScopes.includes(scope))) {
      result.push(uuid);
    }
    return result;
  }, [] as string[]);

  return errors.length
    ? {
        result: 'not matched',
        message:
          'There are IAM request scopes that did not have a corresponding response',
        errors
      }
    : {
        result: 'matched',
        message: 'Valid! All IAM Request scopes had a matching response'
      };
});
