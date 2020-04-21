# Project Griffon Validation Plugins

A Project Griffon Validation Plugin is a single function with the intent to validate one thing and one thing only. The Project Griffon UI loads all Validation Plugins into a single iFrame and get a validation result for each plugin. Validation plugins will have access to a set of global API's to help with their scripts.

## Implementation

```
// Events may be a subset of all the events in a session
function validateEvents(events) {
    return {
        "message": "All your base are belong to us",
        "errors": ["uuid1", "uuid2"] // list of events where the problem was discovered
    };
}
```


