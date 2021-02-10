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
  const { toolkit } = window.griffon;
  const hits = toolkit.match(toolkit.edge.analyticsHit.matcher, events);
  const mappingHitIds = toolkit.match(toolkit.edge.analyticsMapping.matcher, events)
    .map(event => toolkit.edge.analyticsMapping.getAttributesKey('primaryHitId', event));

  const errors = [];
  let message = 'All analytics.hit events have an associated analytics.mapping event.';
  let result = 'matched';

  const getHitReceivedMatcher = requestId => toolkit.combineAll([
    toolkit.edge.edgeHitReceived.matcher,
    `payload.attributes.requestId=='${requestId}'`
  ]);

  hits.forEach((hit) => {
    const hitId = toolkit.edge.analyticsHit.get(toolkit.edge.analyticsHit.path.hitId, hit);
    if (mappingHitIds.indexOf(hitId) === -1) {
      const requestId = toolkit.edge.analyticsHit
        .get(toolkit.edge.analyticsHit.path.requestId, hit);
      const hitReceived = toolkit.match(getHitReceivedMatcher(requestId), events);
      const errorEventUuid = hitReceived.length ? hitReceived[0].uuid : hit.uuid;
      message = 'One or more analytics.hit events are missing an analytics.mapping event.';
      result = 'not matched';
      errors.push(errorEventUuid);
    }
  });

  return {
    events: errors,
    message,
    result
  };
});
