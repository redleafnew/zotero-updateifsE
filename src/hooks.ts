import {
  BasicExampleFactory,
  HelperExampleFactory,
  KeyExampleFactory,
  PromptExampleFactory,
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

  await Zotero.Promise.delay(1000);
  popupWin.changeLine({
    progress: 30,
    text: `[30%] ${getString("startup.begin")}`,
  });

  // UIExampleFactory.registerStyleSheet();

  UIExampleFactory.registerRightClickMenuItem();

  // UIExampleFactory.registerRightClickMenuPopup(); // 右键菜单

  UIExampleFactory.registerWindowMenuWithSeprator();

  await UIExampleFactory.registerExtraColumn();

  //监听分类右键显示菜单
  ZoteroPane.collectionsView.onSelect.addListener(UIExampleFactory.displayColMenuitem); //监听分类右键显示菜单

  //监听右键显示菜单
  // ZoteroPane.itemsView.onSelect.addListener(UIExampleFactory.displayContexMenuitem); //监听右键显示菜单


  // await UIExampleFactory.registerExtraColumnWithCustomCell();

  // await UIExampleFactory.registerCustomCellRenderer();  // Title下黑色背景函数

  // UIExampleFactory.registerLibraryTabPanel(); // LibraryTab

  // await UIExampleFactory.registerReaderTabPanel(); // Reader

  PromptExampleFactory.registerAlertPromptExample();



  await Zotero.Promise.delay(1000);

  popupWin.changeLine({
    progress: 100,
    text: `[100%] ${getString("startup.finish")}`,
  });
  popupWin.startCloseTimer(5000);

  // addon.hooks.onDialogEvents("dialogExample");
}

function hideMenu(): void {
  const menuboldStar = document.getElementById('zotero-toolboxmenu-auBoldStar'),  //
    menucleanBold = document.getElementById('zotero-toolboxmenu-cleanBold'),  //
    menucleanStar = document.getElementById('zotero-toolboxmenu-cleanStar'),  //
    menucleanBoldStar = document.getElementById('zotero-toolboxmenu-cleanBoldStar'),  //
    menuchAuTitle = document.getElementById('zotero-toolboxmenu-chAuTitle'),  //
    menuswapAuName = document.getElementById('zotero-toolboxmenu-swapAuName'),  //
    menusep1 = document.getElementById('zotero-toolboxmenu-sep1'),  //
    menuchTitleCase = document.getElementById('zotero-toolboxmenu-chTitleCase'),  //
    menuchPubTitle = document.getElementById('zotero-toolboxmenu-chPubTitle'),  //
    menuchPubTitleCase = document.getElementById('zotero-toolboxmenu-chPubTitleCase'),  //
    menuitemTitleFindReplace = document.getElementById('zotero-toolboxmenu-itemTitleFindReplace'),  //
    menusep2 = document.getElementById('zotero-toolboxmenu-sep2'),  //
    menushowProfile = document.getElementById('zotero-toolboxmenu-showProfile'),  //
    menushowData = document.getElementById('zotero-toolboxmenu-showData');  //

  const boldStar = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.bold.star`, true),
    cleanBold = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.remove.bold`, true),
    cleanStar = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.remove.star`, true),
    cleanBoldStar = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.remove.bold.star`, true),
    chAuTitle = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.author.case`, true),
    swapAuName = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.swap.author`, true),
    sep1 = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sep1`, true),
    chTitleCase = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.title`, true),
    chPubTitle = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.pub.title`, true),
    chPubTitleCase = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chang.pub.title.case`, true),
    itemTitleFindReplace = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.item.title.find.replace`, true),
    sep2 = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sep2`, true),
    showProfile = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.show.profile.dir`, true),
    showData = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.show.data.dir`, true);

  // menuboldStar?.setAttribute('hidden', String(!boldStar));
  menuboldStar?.setAttribute('hidden', String(!boldStar));
  menucleanBold?.setAttribute('hidden', String(!cleanBold));
  menucleanStar?.setAttribute('hidden', String(!cleanStar));
  menucleanBoldStar?.setAttribute('hidden', String(!cleanBoldStar));
  menuchAuTitle?.setAttribute('hidden', String(!chAuTitle));
  menuswapAuName?.setAttribute('hidden', String(!swapAuName));
  menusep1?.setAttribute('hidden', String(!sep1));
  menuchTitleCase?.setAttribute('hidden', String(!chTitleCase));
  menuchPubTitle?.setAttribute('hidden', String(!chPubTitle));
  menuchPubTitleCase?.setAttribute('hidden', String(!chPubTitleCase));
  menuitemTitleFindReplace?.setAttribute('hidden', String(!itemTitleFindReplace));
  menusep2?.setAttribute('hidden', String(!sep2));
  menushowProfile?.setAttribute('hidden', String(!showProfile));
  menushowData?.setAttribute('hidden', String(!showData));

  // menuboldStar?.setAttribute('disabled', 'true');
  // (document.getElementById('zotero-toolboxmenu-auBoldStar') as HTMLElement).hidden = !boldStar;
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.add.update`, true);
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.update.abbr`, true);
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.update.abbr.dot`, true);
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.en.abbr`, true);
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ch.abbr`, true);
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.core`, true);
  // Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.high.quality`, true);



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
  ids: Array<string>,
  extraData: { [key: string]: any }
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log("notify", event, type, ids, extraData);
  if (
    event == "select" &&
    type == "tab" &&
    extraData[ids[0]].type == "reader"
  ) {
    BasicExampleFactory.exampleNotifierCallback();
  } else {
    return;
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
      break;
    default:
      return;
  }
}

function onShortcuts(type: string) {
  switch (type) {
    case "larger":
      KeyExampleFactory.exampleShortcutLargerCallback();
      break;
    case "smaller":
      KeyExampleFactory.exampleShortcutSmallerCallback();
      break;
    case "confliction":
      KeyExampleFactory.exampleShortcutConflictionCallback();
      break;
    default:
      break;
  }
}

function onDialogEvents(type: string) {
  switch (type) {
    case "dialogExample":
      HelperExampleFactory.dialogExample();
      break;
    case "clipboardExample":
      HelperExampleFactory.clipboardExample();
      break;
    case "filePickerExample":
      HelperExampleFactory.filePickerExample();
      break;
    case "progressWindowExample":
      HelperExampleFactory.progressWindowExample();
      break;
    case "vtableExample":
      HelperExampleFactory.vtableExample();
      break;
    default:
      break;
  }
}

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
  onShortcuts,
  onDialogEvents,
  hideMenu,
  // getSelectedItems,
};
