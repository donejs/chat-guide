# donejs-chat-guide

[![Greenkeeper badge](https://badges.greenkeeper.io/donejs/chat-guide.svg)](https://greenkeeper.io/)

This repo contains the source files for the [DoneJS](http://donejs.com) [chat guide](http://donejs.com/Guide.html).

## Testing

To test that the guide works you can run:

```js
npm install
```

And then:

```js
npm test
```

## Modifying steps

Steps are stored in the `steps/` folder, and are named to match the step in the guide. The file names should be obvious, and most steps contain at least one test file.

## Debugging Tests

Running

```
node_modules/.bin/guide --help
```

Shows a list of options, these are nice when developing:

### local

By default a temporary folder is created to run the guide, but when debugging you pprobably want it to be installed to the local folder in PROJECT/donejs-chat Use this flag for that

### browser

Specify which browser to launch with.

### skip-to

Skips to a specific set. This only sort-of works because one of the steps is to start the `donejs develop` server and if you skip that step the subsequent steps that depend on live-reload will not work.  But you can skip ahead past the dev parts and go into production builds.

### root

If you are skipping past the `donejs develop` step you probably want to set the root, `--root donejs-chat` so that all commands are executed from there.
