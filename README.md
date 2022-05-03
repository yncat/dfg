# Online daifugo

This is a text-based [Daifugo](https://en.wikipedia.org/wiki/Daifug%C5%8D) game. It has completely playable with screen readers. Internet Explorer is not supported.

## Setup development environment

I'm currently using Node.JS v15. 16 or later will work, but I haven't tested.

You need [the server-side program](https://github.com/yncat/dfg-server) .

First, clone the server-side program. Run `npm ci` to install dependencies, then run `npm start` to start serving. It starts waiting for connections at `localhost:2567` .

Next, clone this repository, run `npm run ci` then `npm start` . It launches browser for the first time. While the development server is running, the game be accessed by requesting to `localhost:3000` .

The development server supports hot-reloading. When you make changes to the source, it will be automatically applied. When you have compilation errors, your browser window will display it for you.

## Testing

Run `npm run test` to run tests. 

## Building

Run `npm run build` to make a optimized production build. If you're trying to host the game somewhere, you need to modify package.json since the homepage field now points to my website domain.

If you build the app with default setting, it will try to connect to localhost. In order to change endpoint for production, create `.env.production.local` inside the project root directory, and specify like this.

```
REACT_APP_SERVER_ADDRESS=wss://example.com
```

If you want to specify port number,

```
REACT_APP_SERVER_ADDRESS=wss://example.com:portnum
```

## Adding sounds

If you want to add sounds, you first need to place it as a wave format in dev/sounds_wave directory. Then, run `npm run sounds:build` to convert them into supported formats. For file conversion, you must have ffmpeg installed in your system. 

In order to use the added sounds inside the game, you must define sound events in `src/logic/sound.ts` . The definition is very straitforward.

## Translation

I haven't coded language switching, but multiple language can be supported. Implement the interface located at `src/i18n/interface.ts` and place the class into the same directory. See japanese.ts for example.
