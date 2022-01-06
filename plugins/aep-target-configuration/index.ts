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

import { Configuration } from '@adobe/griffon-toolkit-aep-mobile';
import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const configurationEvents = events.filter(
    (event) =>
      event.payload.ACPExtensionEventType ===
      'com.adobe.eventtype.configuration'
  ) as Configuration[];
  const valid = configurationEvents.some((event) => {
    const clientCode = event.payload.ACPExtensionEventData['target.clientCode'];
    const environmentId = event.payload.ACPExtensionEventData[
      'target.environmentId'
    ] as string[];
    return clientCode && environmentId?.length;
  });

  const message = valid
    ? 'Valid! Adobe Target Extension has been configured!'
    : 'Missing required configuration for Adobe Target';
  const errors = valid ? [] : configurationEvents.map((event) => event.uuid);
  return {
    events: errors,
    message,
    result: valid ? 'matched' : 'not matched'
  };
});
