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
import { AnalyticsHit, AnalyticsMapping } from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event): ValidationPluginResult {
  const { toolkit } = window.griffon;
  const hits: AnalyticsHit[] = toolkit.match(
    toolkit.edge.analyticsHit.matcher,
    events
  );
  const mappingHitIds = toolkit
    .match(toolkit.edge.analyticsMapping.matcher, events)
    .map((event: AnalyticsMapping) =>
      toolkit.edge.analyticsMapping.getAttributesKey('primaryHitId', event)
    );

  const errors: string[] = [];
  let message =
    'All analytics.hit events have an associated analytics.mapping event.';

  const getHitReceivedMatcher = (requestId: string) =>
    toolkit.combineAll([
      toolkit.edge.edgeHitReceived.matcher,
      `payload.attributes.requestId=='${requestId}'`
    ]);

  hits.forEach((hit) => {
    const hitId = toolkit.edge.analyticsHit.get(
      toolkit.edge.analyticsHit.path.hitId,
      hit
    );
    if (mappingHitIds.indexOf(hitId) === -1) {
      const requestId = toolkit.edge.analyticsHit.get(
        toolkit.edge.analyticsHit.path.requestId,
        hit
      );
      const hitReceived = toolkit.match(
        getHitReceivedMatcher(requestId),
        events
      );
      const errorEventUuid: string = hitReceived.length
        ? hitReceived[0].uuid
        : hit.uuid;
      message =
        'One or more analytics.hit events are missing an analytics.mapping event.';
      errors.push(errorEventUuid);
    }
  });

  return {
    events: errors,
    message,
    result: errors.length ? 'not matched' : 'matched'
  };
});
