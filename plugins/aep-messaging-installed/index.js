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
  const { sharedStateVersions: versions } = kit['aep-mobile'];
  const versionEvents = kit.match(versions.matcher, events);

  return !versionEvents.length ? {
    message: 'No version info could be found. Either Griffon isn\'t registered or it did not pass in cached events upon activating.',
    errors: [],
    status: 'help'
  } : versionEvents.some(versions.getExtensionsKey('"com.adobe.messaging"')) ? {
    message: 'Messaging Extension was registered',
    errors: [],
    status: 'valid'
  } : {
    message: 'Did not detect initialization of the Messaging Extension',
    errors: versionEvents.map(event => event.uuid),
    status: 'invalid'
  };
});
