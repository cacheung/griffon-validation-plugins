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

  const getProfileAnnotation = pushEvent => (pushEvent.annotations || []).find(
    a => a.type === 'dev',
  );

  // replace with setPushIdentifier event once it's released in griffon-toolkit
  const pushIDMatcher = kit.combineAll([
    'payload.ACPExtensionEventData.pushidentifier',
    'payload.ACPExtensionEventSource==\'com.adobe.eventsource.requestcontent\'',
    'payload.ACPExtensionEventType==\'com.adobe.eventtype.generic.identity\'',
    'timestamp'
  ]);

  const pushIdEvents = kit.match(pushIDMatcher, events);
  const TIMEOUT = 15 * 60 * 1000; // 15 minutes

  if (!pushIdEvents.length) {
    return {
      message: 'No push ID was registered in the app.',
      errors: [],
      status: 'invalid'
    };
  }

  // check to see if any of these events have the push annotation
  let lastTS = 0;
  let hasAnnotation = false;

  pushIdEvents.forEach((event) => {
    if (lastTS < event.timestamp) {
      lastTS = event.timestamp;
    }
    const annotation = getProfileAnnotation(event);
    if (annotation && annotation.payload.platformProfile) {
      hasAnnotation = true;
    }
  });

  return hasAnnotation ? {
    message: 'Push token was saved in the Platform!',
    errors: [],
    status: 'valid'
  } : lastTS < Date.now() - TIMEOUT ? {
    message: 'Operation timed out. Could not find push token on platform',
    errors: [],
    status: 'invalid'
  } : {
    message: 'Attempting to locate push token in the platform. This can take up to 15 minutes.',
    errors: [],
    status: 'wait'
  };
});
