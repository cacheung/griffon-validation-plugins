/*
  Copyright 2023 Adobe. All rights reserved.
  This file is licensed to you under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License. You may obtain a copy
  of the License at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under
  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  OF ANY KIND, either express or implied. See the License for the specific language
  governing permissions and limitations under the License.
*/

import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit } = window.griffon;
  const { edgeEvent } = toolkit.edge;
  const ssfRuleEvents = toolkit.match(
    'payload.name==`evaluatingRule` && vendor==`com.adobe.launch.ssf` && type==`service`',
    events
  );

  let responseBody;
  let valid = true;
  const uuids = [];
  ssfRuleEvents.forEach((event) => {
    const messages = edgeEvent.getMessages(event);
    const isMetaApiEvent = messages.some((message) =>
      message.includes('graph.facebook.com')
    );
    if (isMetaApiEvent) {
      const responseStatusIndex = messages.findIndex(
        (message) => message === 'Response Status'
      );
      const responseStatus = messages[responseStatusIndex + 1];
      if (responseStatusIndex > -1 && responseStatus !== '200') {
        const responseBodyIndex = messages.findIndex(
          (message) => message === 'Response Body'
        );
        responseBody = messages[responseBodyIndex + 1];
        valid = false;
        uuids.push(event.uuid);
      }
    }
  });
  return {
    message: ssfRuleEvents.length
      ? valid
        ? 'Passed!'
        : `Failed to send some PageView events to Meta Conversions API - ${responseBody}`
      : 'No PageView events have been sent to Meta Conversions API',
    events: uuids,
    links: [],
    result: ssfRuleEvents.length
      ? valid
        ? 'matched'
        : 'not matched'
      : 'unknown'
  };
});
