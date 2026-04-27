const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;
let splash;

function createSplash() {
  splash = new BrowserWindow({
    width: 420,
    height: 260,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    center: true
  });

  splash.loadFile(path.join(__dirname, "splash.html"));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // remove menu completely
  mainWindow.setMenu(null);

  // DEV / PROD
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // show when fully loaded
  mainWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      if (splash) splash.destroy();
      mainWindow.show();
    }, 200);
  });

  // RIGHT CLICK MENU (dev tool style)
  mainWindow.webContents.on("context-menu", (e, params) => {
    const menu = Menu.buildFromTemplate([
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { type: "separator" },
      { role: "selectAll" },
      { type: "separator" },
      {
        label: "Inspect Element",
        click: () => {
          mainWindow.webContents.inspectElement(params.x, params.y);
        }
      }
    ]);

    menu.popup();
  });
}

app.whenReady().then(() => {
  createSplash();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplash();
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});