# [Web-Client](https://hantishoy@bitbucket.org/curtasoft/web_client.git)

This is the manager of curta games.

## Requirements

- [Node](https://nodejs.org) 4.0 or newer
- [React Native](http://facebook.github.io/react-native/docs/getting-started.html) for development
- [Xcode](https://developer.apple.com/xcode/) for iOS development (optional)
- [Android SDK](https://developer.android.com/sdk/) for Android development (optional)

## Installation

After cloning the repository, install dependencies:

```sh
cd web_client
npm install
```

## Running

Once dependencies are installed, start the application with:

```sh
npm start
```

Open google chrome input http://localhost:8132 

## Change host and port

host and port for debug defined in webpack-dev-server.config.js.

## Publish

```sh
npm run build
```

## WebSocket

ensure websocket server is running. and config server ip in src\app.config.js. 