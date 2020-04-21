(events) => {
  const analyticsTrackEvents = events.filter(event => event.type === 'AnalyticsTrack' || event.type === 'LifecycleStart');
  const analyticsResponseEvents = events.filter(event => event.type === 'AnalyticsResponse');
  let valid = true;
  const invalidEvents = [];
  for (let i = 0; i < analyticsResponseEvents.length; i++) {
    const analyticsResponseEvent = analyticsResponseEvents[i];
    const analyticsAnnotation = analyticsResponseEvent.annotations.find(annotation => annotation.type === 'analytics');
    if (!analyticsAnnotation
      || !analyticsAnnotation.payload || !analyticsAnnotation.payload.hitDebugMessage) {
      valid = false;
      const { requestEventIdentifier } = analyticsResponseEvent.payload.ACPExtensionEventData;
      const found = analyticsTrackEvents
        .find(event => event.payload.ACPExtensionEventUniqueIdentifier === requestEventIdentifier);
      if (found) {
        invalidEvents.push(found.uuid);
      }
    }
  }
  const message = valid ? 'Valid! All Analytics events have post-processed data!' : 'Invalid! These events are missing post-processed data.';
  return { message, errors: invalidEvents };
};
