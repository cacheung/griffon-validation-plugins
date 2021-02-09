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

## Testing in the Project Griffon UI
You can run and test your validation plugin against a Project Griffon session in the UI.

First, serve up your plugin directory using a tool like [server-static](https://www.npmjs.com/package/serve-static).

Then open up your session in the Project Griffon UI and then open your browser's developer console and add something like the following:

```
localStorage.setItem('griffonPlugin', JSON.stringify([
{
  displayName: 'Showcase My Griffon Validation Plugin',
  src: 'https://localhost:4321/my-plugin/index.js',
  type: 'validation'
}
]))
```

Note: _Make sure the scope of the console window is pointing to ui.griffon.adobe.com_

Now you should be able to see the results of your script in the `Validation Summary` view plugin.

## Uploading

Each directory found in the `plugins` directory can be packaged and uploaded to the Project Griffon server. 

### Manifest File
Plugin packages are required to contain a manifest file at the root level named `plugin.json` . The manifest file should contain the following metadata:

#### src (required)
Path to the validation script.

#### displayName
A display name for your plugin to be presented in view plugins.

#### namespace (required)
Needs to be a unique namespace.

#### type (required)
Indicates either `validation` or `view` plugin.

#### version (required)
Needs to follow a version described by the [semver specification](https://semver.org/).

#### description
Brief description that explains what the plugin is validating.

#### category
For grouping validation plugin results in view plugins.

To upload your plugin, you need to have an IMS account and set the following environment variables:

IMS Username `export IMS_USERNAME=XXXXX`

IMS Password `export IMS_PASSWORD=XXXXX`

Client Secret `export CLIENT_SECRET=XXXXX`

IMS Organization ID `export IMS_ORG=XXXXX`

Then package the plugin as a zip folder.

```
npm run package
```

Next run the uploader. If you're updating the plugin, be sure to update the version in your `plugin.json` manifest file.

```
npm run upload
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE.md) for more information.
