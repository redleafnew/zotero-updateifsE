import {
  BasicExampleFactory,
  HelperExampleFactory,
  KeyExampleFactory,
  // PromptExampleFactory,
  UIExampleFactory,
} from "./modules/examples";
import { config } from "../package.json";
import { getString, initLocale } from "./modules/locale";
import { registerPrefsScripts } from "./modules/preferenceScript";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,

  ]);
  initLocale();
  ztoolkit.ProgressWindow.setIconURI(
    "default",
    `chrome://${config.addonRef}/content/icons/favicon.png`
  );

  const popupWin = new ztoolkit.ProgressWindow(config.addonName, {
    closeOnClick: true,
    closeTime: -1,
  })
    .createLine({
      text: getString("startup.begin"),
      type: "default",
      progress: 0,
    })
    .show();


  BasicExampleFactory.registerPrefs();

  BasicExampleFactory.registerNotifier();


  KeyExampleFactory.registerShortcuts();

  //await Zotero.Promise.delay(1000);
  popupWin.changeLine({
    progress: 30,
    text: `[30%] ${getString("startup.begin")}`,
  });

  // UIExampleFactory.registerStyleSheet();

  // UIExampleFactory.disableMenu(); //禁用的菜单

  UIExampleFactory.registerRightClickMenuItem();// 右键菜单

  // UIExampleFactory.registerRightClickMenuPopup(); // 右键弹出菜单

  UIExampleFactory.registerWindowMenuWithSeprator();

  await UIExampleFactory.registerExtraColumn();

  //监听分类右键显示菜单
  ZoteroPane.collectionsView.onSelect.addListener(UIExampleFactory.displayColMenuitem); //监听分类右键显示菜单


  //监听右键显示菜单
  ZoteroPane.itemsView.onSelect.addListener(UIExampleFactory.displayContexMenuitem); //监听右键显示菜单

  // UIExampleFactory.refreshButton(); // 原想加按钮

  // await UIExampleFactory.registerExtraColumnWithCustomCell();

  // await UIExampleFactory.registerCustomCellRenderer();  // Title下黑色背景函数

  // UIExampleFactory.registerLibraryTabPanel(); // LibraryTab

  // await UIExampleFactory.registerReaderTabPanel(); // Reader

  // PromptExampleFactory.registerAlertPromptExample();



  //await Zotero.Promise.delay(1000);

  popupWin.changeLine({
    progress: 100,
    text: `[100%] ${getString("startup.finish")}`,
  });
  popupWin.startCloseTimer(5000);

  // addon.hooks.onDialogEvents("dialogExample");
}

// 设置自定义列
// async function setExtraColumn() {
//   await UIExampleFactory.registerExtraColumn()
// }
function hideMenu(): void {
  UIExampleFactory.hideMenu();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  // Remove addon object
  addon.data.alive = false;
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
  extraData: { [key: string]: any }
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log("notify", event, type, ids, extraData);

  if (event == "add" && type == "item") {
    //Zotero.debug(`添加条目了${ids}！`)

    // Add an item
    BasicExampleFactory.exampleNotifierCallback(ids)
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
  onShutdown,
  onNotify,
  onPrefsEvent,
  // onShortcuts,
  hideMenu,
  // setExtraColumn,
  // getSelectedItems,
};
