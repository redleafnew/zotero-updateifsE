import {
  BasicExampleFactory,
  KeyExampleFactory,
  UIExampleFactory,
} from "./modules/examples";
import { config } from "../package.json";
import { initLocale } from "./utils/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";
import { registerShortcuts } from "./modules/shortcuts";

const addonFTL = `${config.addonRef}-addon.ftl`;

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  initLocale();

  BasicExampleFactory.registerPrefs();

  BasicExampleFactory.registerNotifier();
  //KeyExampleFactory.registerShortcuts();
  registerShortcuts(); //新的注册快捷键
  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );
}

async function onMainWindowLoad(win: Window) {
  (win as any).MozXULElement.insertFTLIfNeeded(addonFTL);
  UIExampleFactory.registerAllMenus(); // 右键菜单 + Tools 菜单（多主窗口只注册一次）
  // UIExampleFactory.registerRightClickMenuPopup(); // 右键弹出菜单
  await UIExampleFactory.registerExtraColumn();
}

async function onMainWindowUnload(win: Window) {
  ztoolkit.Keyboard.unregisterAll();
  unloadAddonFTL(win);
}

function unloadAddonFTL(win: Window) {
  win.document.querySelector(`[href="${addonFTL}"]`)?.remove();
}

// 设置自定义列
// async function setExtraColumn() {
//   await UIExampleFactory.registerExtraColumn()
// }

function onShutdown(): void {
  Zotero.getMainWindows().forEach((win) => unloadAddonFTL(win));
  UIExampleFactory.unregisterAllMenus(); // 注销 Zotero 官方菜单
  UIExampleFactory.unregisterExtraColumns();
  ztoolkit.unregisterAll();
  // Remove addon object
  addon.data.alive = false;
  // @ts-ignore - Plugin instance is not typed
  delete Zotero[config.addonInstance];
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log("notify", event, type, ids, extraData);

  if (event == "add" && type == "item") {
    const regularItems = Zotero.Items.get(ids as number[]).filter(
      (item) =>
        item.isRegularItem() &&
        // @ts-ignore item has no isFeedItem
        !item.isFeedItem &&
        // @ts-ignore libraryID is got from item, so get() will never return false
        Zotero.Libraries.get(item.libraryID)._libraryType == "user",
    );

    if (regularItems.length !== 0) {
      // await KeyExampleFactory.setExtra(regularItems);
      BasicExampleFactory.exampleNotifierCallback(regularItems);
      Zotero.debug(
        `新增条目了。添加条目了${Zotero.ItemTypes.getName(regularItems[0].itemTypeID)}！`,
      );
      return;
    }
    //Zotero.debug(`添加条目了${ids}！`)
  }
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load":
      registerPrefsScripts(data.window);
      UIExampleFactory.disableUppJourAbbDot(); // 当更新期刊禁用时，禁用期刊是否带点选项
      break;
    default:
      return;
  }
}

// function onShortcuts(type: string) {
//   switch (type) {
//     case "larger":
//       KeyExampleFactory.exampleShortcutLargerCallback();
//       break;
//     case "smaller":
//       KeyExampleFactory.exampleShortcutSmallerCallback();
//       break;
//     case "confliction":
//       KeyExampleFactory.exampleShortcutConflictionCallback();
//       break;
//     default:
//       break;
//   }
// }

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintian.
// function getSelectedItems() {
//  return KeyExampleFactory.getSelectedItems();
// }
export default {
  onStartup,
  onMainWindowLoad,
  onMainWindowUnload,
  onShutdown,
  onNotify,
  onPrefsEvent,
  // onShortcuts,
  // setExtraColumn,
  // getSelectedItems,
};
