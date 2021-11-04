/*!
 * Copyright 2021 Adobe. All rights reserved.
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
  const { clientInfoIOS, sharedStateVersions: versions } = toolkit['aep-mobile'];
  const clientEvents = toolkit.match(toolkit.combineAll([
    'payload.type==`connect`',
    'type==`client`',
    'timestamp'
  ]), events);
  const versionEvents = toolkit.match(versions.matcher, events);

  const uniqueClients = {};
  for (let i = 0; i < clientEvents.length; i++) {
    const clientEvent = clientEvents[i];
    if (!uniqueClients[clientEvent.clientId]) {
      uniqueClients[clientEvent.clientId] = clientEvent;
    }
  }

  const versionRegex = /^(\d)\.(\d)/;

  const isAndroidCompatible = (assuranceVersionMatches, analyticsVersionMatches) =>
    parseInt(assuranceVersionMatches[1], 10) >= 1 && parseInt(analyticsVersionMatches[1], 10) >= 1
      && parseInt(analyticsVersionMatches[2] >= 2, 10)
        && parseInt(analyticsVersionMatches[3], 10) >= 6;

  const isIOSCompatible = (assuranceVersionMatches, analyticsVersionMatches) =>
    parseInt(assuranceVersionMatches[1], 10) >= 1 && parseInt(analyticsVersionMatches[1], 10) >= 2
      && parseInt(analyticsVersionMatches[2], 10) >= 4;

  let analyticsVersion;
  let assuranceVersion;
  const compatible = versionEvents.every((event) => {
    const clientEvent = uniqueClients[event.clientId];
    const isCompatible = clientInfoIOS.isMatch(clientEvent) ? isIOSCompatible : isAndroidCompatible;
    const extensions = versions.getExtensions(event);
    assuranceVersion = extensions['com.adobe.assurance']?.version || '';
    analyticsVersion = extensions.Analytics?.version || '';
    const assuranceVersionMatches = assuranceVersion.match(versionRegex) || [];
    const analyticsVersionMatches = analyticsVersion.match(versionRegex) || [];
    return isCompatible(assuranceVersionMatches, analyticsVersionMatches);
  });

  return !versionEvents.length ? {
    events: [],
    message: 'No version info could be found. Either the Assurance SDK isn\'t registered or the SDK did not pass in cached events upon activating.',
    result: 'unknown'
  } : compatible ? {
    events: [],
    message: 'The installed Assurance SDK and Adobe Analytics Extensions are compatible.',
    result: 'matched'
  } : {
    message: `Assurance SDK version ${assuranceVersion} and Adobe Analytics Extension version ${analyticsVersion} are not compatible!`,
    events: versionEvents.map((event) => event.uuid),
    result: 'not matched'
  };
});
