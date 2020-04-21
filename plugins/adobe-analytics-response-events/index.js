(events) => {
  const analyticsTrackEvents = events.filter(event => event.type === 'AnalyticsTrack' || event.type === 'LifecycleStart');
  const analyticsResponseEvents = events.filter(event => event.type === 'AnalyticsResponse');
  let valid = true;
  const invalidEvents = [];
  for (let i = 0; i < analyticsTrackEvents.length; i++) {
    const analyticsTrackEvent = analyticsTrackEvents[i];
    const requestEventIdentifier = analyticsTrackEvent.payload.ACPExtensionEventUniqueIdentifier;
    const found = analyticsResponseEvents.find(event =>
      event.payload.ACPExtensionEventData.requestEventIdentifier === requestEventIdentifier);
    if (!found) {
      valid = false;
      invalidEvents.push(analyticsTrackEvent.uuid);
    }
  }
  const message = valid ? 'Valid! All Analytics events have a corresponding AnalyticsResponse event' : 'Invalid! There are events missing an AnalyticsResponse event!';
  return { message, errors: invalidEvents };
};
