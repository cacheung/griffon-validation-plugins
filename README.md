# Project Griffon Validation Plugins

A Project Griffon Validation Plugin is a single function with the intent to validate one thing and one thing only. The Project Griffon UI loads validations into an iFrame and collects results for each function. Validations have access to a set of global APIs to simplify writing functions.

This project contains validations owned by some Adobe organizations.

View the [wiki](https://github.com/adobe/griffon-validation-plugins/wiki) to learn more about validations and how to get started

## Uploading

Each directory found in the `plugins` directory is packaged and uploaded to Project Griffon.

This project leverages the [Project Griffon Plugin Tools](https://github.com/adobe/griffon-plugin-tools) to package and upload each directory.

Alternatively, validations can be uploaded [Using the Validation Summary View](https://github.com/adobe/griffon-validation-plugins/wiki/Using-the-Validation-Summary-View) from the editor panel. 

### Manifest File
Validations are required to contain a manifest file at the root level named `plugin.json`.

In the Validation Summary view, this file is auto-generated.

A manifest file should contain the following metadata:

#### src (required)
Path to the validation script.

#### displayName
A display name for your validation.

#### namespace (required)
A unique namespace.

#### type (required)
Indicates the type of plugin. The value should be `validation`.

#### version (required)
Needs to follow a version described by the [semver specification](https://semver.org/).

#### description
Brief description that explains what the validation does.

#### category
For grouping validation results in views.

To upload validations from the command line using the [Project Griffon Plugin Tools](https://github.com/adobe/griffon-plugin-tools), you need to have an IMS account and set the following environment variables:

IMS Username `export IMS_USERNAME=XXXXX`

IMS Password `export IMS_PASSWORD=XXXXX`

Client Secret `export CLIENT_SECRET=XXXXX`

IMS Organization ID `export IMS_ORG=XXXXX`

Then package the plugin as a zip folder.

```
npm run package
```

Next run the uploader. If you're updating the validation, be sure to update the version in your `plugin.json` manifest file.

```
npm run upload
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE.md) for more information.
