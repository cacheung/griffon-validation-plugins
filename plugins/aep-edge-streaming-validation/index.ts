/* eslint-disable no-underscore-dangle */
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
import { StreamingValidation } from '@adobe/griffon-toolkit-edge';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const { toolkit } = window.griffon;
  const genericStreamingValidationMatcher = toolkit.combineAll([
    'type==`generic`',
    'vendor==`com.adobe.streaming.validation`',
    'timestamp'
  ]);

  const vals = toolkit.match(
    toolkit.combineAny([
      toolkit.edge.streamingValidation.matcher,
      genericStreamingValidationMatcher
    ]),
    events
  ) as StreamingValidation[];

  const errors: string[] = [];
  const errorMessages: string[] = [];
  let message = 'All streaming validation events are successful.';

  vals.forEach((val) => {
    const messages = toolkit.edge.streamingValidation.getMessages(val);
    let data;
    try {
      data = messages ? JSON.parse(messages[1]) : val.payload;
    } catch {
      data = val.payload;
    }

    if (data._errors) {
      errors.push(val.uuid);

      const errorMessage = data?._errors?._streamingValidation?.[0].message;

      if (errorMessages.indexOf(errorMessage) === -1) {
        errorMessages.push(errorMessage);
      }
    }
  });

  if (errors.length) {
    message = `Some streaming errors were detected: ${errorMessages.join(
      ' -- '
    )}`;
  }

  return {
    events: errors,
    message,
    result: !errors.length ? 'matched' : 'not matched'
  };
});
