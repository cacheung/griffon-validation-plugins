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
  const vals = toolkit.match(toolkit.edge.streamingValidation.matcher, events);

  const errors = [];
  const errorMessages = [];
  let message = 'All streaming validation events are successful.';

  vals.forEach((val) => {
    const messages = toolkit.edge.streamingValidation.getMessages(val);
    const message = JSON.parse(messages[1]);

    if (message._errors) {
      errors.push(val.uuid);

      const errorMessage = message?._errors?._streamingValidation?.[0].message;

      if (errorMessages.indexOf(errorMessage) === -1) {
        errorMessages.push(errorMessage);
      }
    }
  })

  if (errors.length) {
    message = 'Some streaming errors were detected: ' + errorMessages.join(' -- ');
  }

  return {
    events: errors,
    message,
    result: !errors.length ? 'matched' : 'not matched'
  };
});
