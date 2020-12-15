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
  const { toolkit: kit } = window.griffon;

  // replace with setPushIdentifier event once it's released in griffon-toolkit
  const pushIDMatcher = kit.combineAll([
    'payload.ACPExtensionEventData.pushidentifier',
    'payload.ACPExtensionEventSource==\'com.adobe.eventsource.requestcontent\'',
    'payload.ACPExtensionEventType==\'com.adobe.eventtype.generic.identity\'',
    'timestamp'
  ]);

  const pushIdEvents = kit.match(pushIDMatcher, events);

  return !pushIdEvents.length ? {
    errors: [],
    message: 'No push ID was registered in the app.',
    status: 'invalid'
  } : {
    errors: [],
    message: 'Messaging Extension was registered',
    status: 'valid'
  };
});
