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

import { Event } from '@adobe/griffon-toolkit-common';
import { ValidationPluginResult } from '../../types/validationPlugin';

(function (events: Event[]): ValidationPluginResult {
  const lifecycleType = 'com.adobe.eventtype.lifecycle';
  const lifecycleLaunchSource = 'com.adobe.eventsource.applicationlaunch';
  const lifecycleCloseSource = 'com.adobe.eventsource.applicationclose';
  const lifecycleEvents = events.filter(
    (event) => event.payload.ACPExtensionEventType === lifecycleType
  );

  let message = 'Lifecycle Error: no application close detected';
  let result = 'not matched';
  let prevEvent;

  // eslint-disable-next-line no-restricted-syntax
  for (const lifecycleEvent of lifecycleEvents) {
    if (
      lifecycleEvent.payload.ACPExtensionEventSource === lifecycleLaunchSource
    ) {
      result = 'unknown';
      message =
        'Lifecycle Warning: application launch detected without an associated close';
      if (prevEvent) {
        if (
          prevEvent.payload.ACPExtensionEventSource === lifecycleCloseSource
        ) {
          result = 'unknown';
          message =
            'Lifecycle Warning: application launch detected without an associated close';
        } else {
          result = 'not matched';
          message =
            'Lifecycle Error: multiple application launches without an associated close';
        }
      }
    } else if (
      lifecycleEvent.payload.ACPExtensionEventSource === lifecycleCloseSource
    ) {
      if (
        prevEvent &&
        prevEvent.payload.ACPExtensionEventSource === lifecycleLaunchSource
      ) {
        message =
          'Lifecycle Info: Implementation validated. Application close detected in proper order';
        result = 'matched';
      } else {
        result = 'not matched';
        message =
          'Lifecycle Error: Application close detected without prior launch';
      }
    }
    prevEvent = lifecycleEvent;
  }

  return {
    message,
    events: [],
    result
  };
});
