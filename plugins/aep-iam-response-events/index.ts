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

import { PersonalizationEdgeResponse } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

interface DecodedScope {
  activityId: string;
  placementId: string;
}

interface IAMPersonalizationItem {
  id: string;
  data: {
    id: string;
    content: string;
  };
}

type IAMPersonalizationResponse = PersonalizationEdgeResponse & {
  payload: {
    id: string;
    scope: string;
    activity: {
      id: string;
    };
    placement: {
      id: string;
    };
    items: IAMPersonalizationItem[];
  };
};

(function (events: Event[]): ValidationPluginResult {
  const { toolkit: kit } = window.griffon;
  const { personalizationEdgeResponse } = kit['aep-mobile'];
  const personalizationResponses = kit.match(
    personalizationEdgeResponse.matcher,
    events
  ) as IAMPersonalizationResponse[];

  const invalidScopes = personalizationResponses.reduce(
    (result, { payload, uuid }) => {
      const decodedScope = JSON.parse(
        atob(payload?.scope as string)
      ) as DecodedScope;

      if (
        decodedScope.activityId !== payload?.activity?.id ||
        decodedScope.placementId !== payload?.placement?.id
      ) {
        result.push(uuid);
      }
      return result;
    },
    [] as string[]
  );

  const invalidContent = personalizationResponses.reduce(
    (result, { payload, uuid }) => {
      const hasInvalidContent = payload.items.some((item) => {
        const content = JSON.parse(item?.data?.content);
        if (!content.rules?.length) {
          return true;
        }
        return false;
      });

      if (hasInvalidContent) {
        result.push(uuid);
      }

      return result;
    },
    [] as string[]
  );

  const errors = [...invalidScopes, ...invalidContent];

  return errors.length
    ? {
        message: `There are issues with the IAM response events: ${
          !!invalidScopes.length &&
          `There are scopes that are incorrect in the payload.`
        } ${
          !!invalidContent.length &&
          `There are responses missing IAM rules in the payload.`
        }`,
        result: 'invalid',
        errors
      }
    : {
        message: 'Valid! All IAM Response Events are correct.',
        result: 'valid'
      };
});
