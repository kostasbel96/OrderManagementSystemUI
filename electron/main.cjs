const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;
let splash;
let confirmWindow;
let isQuitting = false;

function createSplash() {
  splash = new BrowserWindow({
    width: 420, height: 260, frame: false, alwaysOnTop: true, transparent: true, resizable: false, center: true,
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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.setMenu(null);

  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) splash.close();
      mainWindow.show();
    }, 300);
  });

  // Right click menu
  mainWindow.webContents.on("context-menu", (e, params) => {
    const menu = Menu.buildFromTemplate([
      { role: "cut" }, { role: "copy" }, { role: "paste" },
      { type: "separator" }, { role: "selectAll" }, { type: "separator" },
      {
        label: "Inspect Element",
        click: () => { mainWindow.webContents.inspectElement(params.x, params.y); },
      },
    ]);
    menu.popup();
  });

  mainWindow.on("close", (e) => {
    if (isQuitting) return;
    e.preventDefault();
    confirmWindow = new BrowserWindow({
      width: 380, height: 200, parent: mainWindow, modal: true, frame: false, transparent: true, resizable: false, center: true,
      webPreferences: { nodeIntegration: true, contextIsolation: false },
    });
    confirmWindow.loadFile(path.join(__dirname, "confirm.html"));
  });
}

// =================================================================
// --- IPC HANDLERS (Η ΟΡΙΣΤΙΚΗ ΕΜΠΟΡΙΚΗ ΛΥΣΗ) ---
// =================================================================

ipcMain.handle("print", async (_, content) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; background: white; color: black; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; font-size: 13px; text-align: left; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `;

    // 1. Δημιουργούμε ένα κρυφό παράθυρο στο background για να κάνει το rendering
    const tempWin = new BrowserWindow({ show: false });
    await tempWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

    // 2. Μετατρέπουμε το HTML σε καθαρό PDF αρχείο
    const pdfBuffer = await tempWin.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
    });
    tempWin.destroy();

    // 3. Το αποθηκεύουμε προσωρινά στα Temp των Windows
    const pdfPath = path.join(app.getPath("temp"), `print-preview-${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);

    // 4. Λέμε στα Windows να ανοίξουν το PDF.
    // Θα ανοίξει ακαριαία στον Edge/Chrome όπου το Print Preview δουλεύει 100% τέλεια!
    await shell.openPath(pdfPath);

    return { success: true };
  } catch (err) {
    console.error("Print error:", err);
    return { success: false, error: err.message };
  }
});

// Handler για το Confirm Exit
ipcMain.on("confirm-exit", (_, confirmed) => {
  if (confirmWindow && !confirmWindow.isDestroyed()) confirmWindow.close();
  if (confirmed) { isQuitting = true; app.quit(); }
});

// =================================================================
// --- APP LIFECYCLE ---
// =================================================================
app.whenReady().then(() => {
  createSplash();
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplash(); createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});