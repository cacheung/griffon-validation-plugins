(events) => {
  const configurationEvents = events.filter(event => event.payload.ACPExtensionEventType === 'com.adobe.eventType.configuration');
  const valid = configurationEvents.some((event) => {
    const rsids = event.payload.ACPExtensionEventData['analytics.rsids'];
    const server = event.payload.ACPExtensionEventData['analytics.server'];
    return rsids && server;
  });

  const message = valid ? 'Valid! Adobe Analytics Extension has been configured'
    : 'Missing required configuration for Adobe Analytics!';
  return { message, errors: valid ? [] : configurationEvents.map(event => event.uuid) };
};
