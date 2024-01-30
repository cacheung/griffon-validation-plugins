/*
  Copyright 2024 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import {
  PropositionsRequest,
  PropositionsResponse,
  propositionsRequest,
  propositionsResponse
} from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;

  const requests = kit.match(
    propositionsRequest.matcher,
    events
  ) as PropositionsRequest[];
  const responses = kit.match(
    propositionsResponse,
    events
  ) as PropositionsResponse[];

  const responseSurfaces = responses.flatMap((response) =>
    response.payload.ACPExtensionEventData?.propositions?.map(
      (prop) => prop.scope
    )
  );

  const errors = requests.reduce((result, event) => {
    if (
      !responses.some(
        (e) =>
          e.payload.ACPExtensionParentID === event.payload.ACPExtensionUniqueID
      )
    ) {
      result.push(event.uuid);
    }

    (event.payload?.ACPExtensionEventData?.surfaces ?? []).forEach(
      (surface) => {
        if (!responseSurfaces.includes(surface.uri)) {
          result.push(event.uuid);
        }
      }
    );
    return result;
  }, []);

  return errors.length
    ? {
        message: 'Some requested Code Based Propositions were not returned',
        result: 'not matched',
        events: Array.from(new Set(errors))
      }
    : {
        message: 'Valid! All requested Code Based Propositions were returned',
        result: 'matched',
        events: []
      };
});
