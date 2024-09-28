import { ColumnOptions } from "zotero-plugin-toolkit";
import hooks from "./hooks";

class Addon {
  public data: {
    alive: boolean;
    // Env type, see build.js
    env: "development" | "production";
    ztoolkit: MyToolkit;
    // ztoolkit: ZoteroToolkit;
    locale?: {
      current: any;
    };
    prefs?: {
      window: Window;
      columns: Array<ColumnOptions>;
      rows: Array<{ [dataKey: string]: string }>;
    };
  };
  // Lifecycle hooks
  public hooks: typeof hooks;
  // APIs
  public api: object;

  constructor() {
    this.data = {
      alive: true,
      env: __env__,
      ztoolkit: new MyToolkit(),
      // ztoolkit: new ZoteroToolkit(),
    };
    this.hooks = hooks;
    this.api = {};
  }
}

/**
 * Alternatively, import toolkit modules you use to minify the plugin size.
 *
 * Steps to replace the default `ztoolkit: ZoteroToolkit` with your `ztoolkit: MyToolkit`:
 *
 * 1. Uncomment this file's line 30:            `ztoolkit: new MyToolkit(),`
 *    and comment line 31:                      `ztoolkit: new ZoteroToolkit(),`.
 * 2. Uncomment this file's line 10:            `ztoolkit: MyToolkit;` in this file
 *    and comment line 11:                      `ztoolkit: ZoteroToolkit;`.
 * 3. Uncomment `./typing/global.d.ts` line 12: `declare const ztoolkit: import("../src/addon").MyToolkit;`
 *    and comment line 13:                      `declare const ztoolkit: import("zotero-plugin-toolkit").ZoteroToolkit;`.
 *
 * You can now add the modules under the `MyToolkit` class.
 */

import { BasicTool, makeHelperTool, unregister } from "zotero-plugin-toolkit";
import { UITool } from "zotero-plugin-toolkit";
import { DialogHelper } from "zotero-plugin-toolkit";
import { ProgressWindowHelper } from "zotero-plugin-toolkit";
import { MenuManager } from "zotero-plugin-toolkit";
import { KeyboardManager } from "zotero-plugin-toolkit";
import { ExtraFieldTool } from "zotero-plugin-toolkit";
import { VirtualizedTableHelper } from "zotero-plugin-toolkit";

export class MyToolkit extends BasicTool {
  UI: UITool;
  ExtraField: ExtraFieldTool;
  Menu: MenuManager;
  Keyboard: KeyboardManager;
  Dialog: typeof DialogHelper;
  ProgressWindow: typeof ProgressWindowHelper;
  VirtualizedTable: typeof VirtualizedTableHelper;

  constructor() {
    super();
    this.UI = new UITool(this);
    this.ExtraField = new ExtraFieldTool(this);
    this.Menu = new MenuManager(this);
    this.Keyboard = new KeyboardManager(this);
    this.Dialog = makeHelperTool(DialogHelper, this);
    this.ProgressWindow = makeHelperTool(ProgressWindowHelper, this);
    this.VirtualizedTable = makeHelperTool(VirtualizedTableHelper, this);
  }

  unregisterAll() {
    unregister(this);
  }
}

export default Addon;
