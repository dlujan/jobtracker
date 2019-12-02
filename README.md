
# Job Tracker

A clean and simple desktop app made with React and Electron that lets you easily manage your jobs and income.

![screenshot_1](https://imgur.com/aJAGmfE.jpg)

## Requirements
 * Node >= 8.2.0

## Installing
Clone the repo:

```bash
git clone --depth=1 https://github.com/dlujan/jobtracker.git
```

Then install dependencies and run the project

```bash
$ cd your-project-name
$ npm i
$ npm start
```

## Packaging the app
1. `npm run build`
2. `npm run pack`
3. `npm run dist`

Your app will packaged as an .exe in the dist folder using the [electron-builder](https://github.com/electron-userland/electron-builder) package. Edit the build section of the package.json to build on additional platforms.

## Resources
* [Create React App](https://github.com/facebookincubator/create-react-app)
* [Electron](https://electronjs.org/docs/tutorial/quick-start)
* [electron-builder](https://github.com/electron-userland/electron-builder)
