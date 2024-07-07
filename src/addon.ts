import { ColumnOptions, VirtualizedTableHelper } from "zotero-plugin-toolkit/dist/helpers/virtualizedTable";
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
  public api: {};

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

import { BasicTool, makeHelperTool, unregister } from "zotero-plugin-toolkit/dist/basic";
import { UITool } from "zotero-plugin-toolkit/dist/tools/ui";
import { DialogHelper } from "zotero-plugin-toolkit/dist/helpers/dialog";
import { ProgressWindowHelper } from "zotero-plugin-toolkit/dist/helpers/progressWindow";
import { MenuManager } from "zotero-plugin-toolkit/dist/managers/menu";
import { ExtraFieldTool } from "zotero-plugin-toolkit/dist/tools/extraField";
import { ShortcutManager } from "zotero-plugin-toolkit/dist/managers/shortcut";
import { PreferencePaneManager } from "zotero-plugin-toolkit/dist/managers/preferencePane";

export class MyToolkit extends BasicTool {
  UI: UITool;
  ExtraField: ExtraFieldTool;
  Shortcut: ShortcutManager;
  Menu: MenuManager;
  PreferencePane: PreferencePaneManager;
  Dialog: typeof DialogHelper;
  ProgressWindow: typeof ProgressWindowHelper;
  VirtualizedTable: typeof VirtualizedTableHelper;

  constructor() {
    super();
    this.UI = new UITool(this);
    this.ExtraField = new ExtraFieldTool(this);
    this.Shortcut = new ShortcutManager(this);
    this.Menu = new MenuManager(this);
    this.PreferencePane = new PreferencePaneManager(this);
    this.Dialog = makeHelperTool(DialogHelper, this);
    this.ProgressWindow = makeHelperTool(ProgressWindowHelper, this);
    this.VirtualizedTable = makeHelperTool(VirtualizedTableHelper, this);
  }

  unregisterAll() {
    unregister(this);
  }
}

export default Addon;
