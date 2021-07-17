import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as isDev from 'electron-is-dev';
import { defaultSearchEngine, userDataPath } from "./utils/userdata";

let mainWindow: BrowserWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: isDev
    },
    width: 800,
    frame: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(defaultSearchEngine);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    // url이 https인지 검사하고 http일시 경고 전송
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

import { mainReloader, rendererReloader } from 'electron-hot-reload';

const mainFile = path.join(app.getAppPath(), 'dist', 'main.js');
const rendererFile = path.join(app.getAppPath(), 'dist', 'renderer.js');

mainReloader(mainFile, undefined, (error, path) => {
  console.log("It is a main's process hook!");
});

rendererReloader(rendererFile, undefined, (error, path) => {
  console.log("It is a renderer's process hook!");
});

/*
ipcMain.on('test', (event, args) => {

});
*/