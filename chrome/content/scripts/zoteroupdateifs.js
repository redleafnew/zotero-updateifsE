if (typeof Zotero === 'undefined') {
    Zotero = {};
}
Zotero.UpdateIFs = {};
// ScholarCitations 改为 UpdateIFs

// Preference managers

Zotero.UpdateIFs.getPref = function (pref) {
    return Zotero.Prefs.get('extensions.updateifs.' + pref, true);
};

// Zotero.UpdateIFs.setPref = function(pref, value) {
//     return Zotero.Prefs.set('extensions.updateifs.' + pref, value, true);
// };




// *********** Change the checkbox, topref
// Zotero.UpdateIFs.changePref = function changePref(option) {
//     Zotero.UpdateIFs.setPref("autoretrieve", option);
// };

// /**
//  * Open UpdateIFs preference window
//  */
Zotero.UpdateIFs.test = function () {
    //var bd = document.getElementById('id-menu-bold-star-ckb').checked
    //return bd;
    alertInfo = 'bd';
    Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
};

Zotero.UpdateIFs.showToolboxMenu = function () {

    // 读取设置
    var boldStar = Zotero.Prefs.get('pref-updateifs-menu-bold-star', true);
    var boldStar = Zotero.Prefs.get('pref-updateifs-menu-bold-star', true);
    var cleanBold = Zotero.Prefs.get('pref-updateifs-menu-clean-bold', true);
    var cleanStar = Zotero.Prefs.get('pref-updateifs-menu-clean-star', true);
    var cleanBoldAndStar = Zotero.Prefs.get('pref-updateifs-menu-clean-bold-star', true);
    var auTitleCase = Zotero.Prefs.get('pref-updateifs-menu-au-title-case', true);
    var swapAu = Zotero.Prefs.get('pref-updateifs-menu-swap-au', true);
    var titleSenCase = Zotero.Prefs.get('pref-updateifs-menu-title-sen-case', true);
    var titleFindReplace = Zotero.Prefs.get('pref-updateifs-menu-find-replace-item-title', true); // 题目查找替换
    var pubTitle = Zotero.Prefs.get('pref-updateifs-menu-pub-title', true);
    var pubTitleCase = Zotero.Prefs.get('pref-updateifs-menu-pub-title-case', true);
    var profileDir = Zotero.Prefs.get('pref-updateifs-menu-profile-dir', true);
    var dataDir = Zotero.Prefs.get('pref-updateifs-data-dir-star', true);
    var sep1 = Zotero.Prefs.get('pref-updateifs-sep1', true);
    var sep2 = Zotero.Prefs.get('pref-updateifs-sep2', true);

    // 设置菜单隐藏
    document.getElementById('menu_Tools-updateifs-menu-popup-bold-star').hidden = !boldStar;
    document.getElementById('menu_Tools-updateifs-menu-popup-remove-bold').hidden = !cleanBold;
    document.getElementById('menu_Tools-updateifs-menu-popup-remove-star').hidden = !cleanStar;
    document.getElementById('menu_Tools-updateifs-menu-remove-bold-and-star').hidden = !cleanBoldAndStar;
    document.getElementById('menu_Tools-updateifs-chang-author-case').hidden = !auTitleCase;
    document.getElementById('menu_Tools-updateifs-swap-author').hidden = !swapAu;
    document.getElementById('menu_Tools-updateifs-menu-chang-title-case').hidden = !titleSenCase;
    document.getElementById('menu_Tools-updateifs-menu-item-title-find-replace').hidden = !titleFindReplace; // 题目查找替换
    document.getElementById('menu_Tools-updateifs-chang-pub-title').hidden = !pubTitle;
    document.getElementById('id-menu-chang-pub-title-case').hidden = !pubTitleCase;
    document.getElementById('menu_Tools-updateifs-menu-show-profile-dir').hidden = !profileDir;
    document.getElementById('menu_Tools-updateifs-menu-show-data-dir').hidden = !dataDir;
    document.getElementById('id-updateifs-separator-1').hidden = !sep1;
    document.getElementById('id-updateifs-separator-2').hidden = !sep2;


};


// 打开设置对话框
Zotero.UpdateIFs.openPreferenceWindow = function (paneID, action) {
    var io = { pane: paneID, action: action };
    window.openDialog('chrome://zoteroupdateifs/content/options.xul',
        'updateifs-pref',
        'chrome,titlebar,toolbar,centerscreen' + Zotero.Prefs.get('browser.preferences.instantApply', true) ? 'dialog=no' : 'modal', io
    );
};

// 打开更改期刊名称对话框
Zotero.UpdateIFs.openUtilsWindow = function (paneID, action) {
    var io = { pane: paneID, action: action };
    window.openDialog('chrome://zoteroupdateifs/content/change-publication-title.xul',
        'updateifs-change-pub-title',
        'chrome,titlebar,toolbar,centerscreen' + Zotero.Prefs.get('browser.preferences.instantApply', true) ? 'dialog=no' : 'modal', io
    );
};

// 打开作者加粗加星对话框
Zotero.UpdateIFs.openAuthorProcess = function (paneID, action) {
    var io = { pane: paneID, action: action };
    window.openDialog('chrome://zoteroupdateifs/content/author-bold-star.xul',
        'updateifs-change-pub-title',
        'chrome,titlebar,toolbar,centerscreen', io
    );
};

// Controls for Tools menu end


// Startup - initialize plugin初始化

Zotero.UpdateIFs.init = function () {

    if (!Zotero.UpdateIFs) {
        var fileLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
            .getService(Components.interfaces.mozIJSSubScriptLoader);
        var scripts = ['zoteroupdateifs', 'options.js'];
        scripts.forEach(s => fileLoader.loadSubScript('chrome://zoteroupdateifs/content/scripts/' + s + '.js', {}, "UTF-8"));
        Zotero.UpdateIFs.showToolboxMenu();
    }

    // Register the callback in Zotero as an item observer
    var notifierID = Zotero.Notifier.registerObserver(
        Zotero.UpdateIFs.notifierCallback, ['item']);

    // Unregister callback when the window closes (important to avoid a memory leak)
    window.addEventListener('unload', function (e) {
        Zotero.Notifier.unregisterObserver(notifierID);
    }, false);



};

Zotero.UpdateIFs.cleanExtra = function () {
    var items = Zotero.UpdateIFs.getSelectedItems();
    if (items == '') { // 如果没有选中条目
        var alertInfo = Zotero.UpdateIFs.ZUIFGetString("clean.failed");
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
    } else {
        var requireInfo = items.length > 1 ? "clean.extra.mul" : "clean.extra.sig";
        var truthBeTold = window.confirm(Zotero.UpdateIFs.ZUIFGetString(requireInfo));
        if (truthBeTold) {
            for (let item of items) {

                if (item.isRegularItem() && !item.isCollection()) {
                    try {
                        item.setField('extra', '');
                        item.saveTx();

                    } catch (error) {
                        // numFail = numFail + 1;
                    }
                }
            }
            var alertInfo = Zotero.UpdateIFs.ZUIFGetString("clean.finished");
            Zotero.UpdateIFs.showPopUP(alertInfo, 'finished');
        }
    }
};

// 清除摘要、系列、系列文本、归档、归档位置、索引号、版权 20220722
Zotero.UpdateIFs.cleanIfsFields = function () {
    var items = Zotero.UpdateIFs.getSelectedItems();
    if (items == '') { // 如果没有选中条目
        var alertInfo = Zotero.UpdateIFs.ZUIFGetString("clean.failed");
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
    } else {
        var requireInfo = items.length > 1 ? "clean.ifs.fields.sig" : "clean.ifs.fields.mul";
        var truthBeTold = window.confirm(Zotero.UpdateIFs.ZUIFGetString(requireInfo));
        if (truthBeTold) {
            for (let item of items) {

                if (item.isRegularItem() && !item.isCollection()) {
                    try {
                        item.setField('abstractNote', '');  //摘要
                        item.setField('archive', ''); //归档
                        item.setField('archiveLocation', '');  //归档位置
                        item.setField('callNumber', '');  //索引号
                        item.setField('rights', ''); //版权
                        item.setField('series', '');  //系列
                        item.setField('seriesText', '');  //系列文本
                        item.setField('seriesTitle', '');  //系列标题
                        item.setField('libraryCatalog', '');  //图书馆目录
                        item.setField('extra', ''); //其它
                        item.saveTx();

                    } catch (error) {
                        // numFail = numFail + 1;
                    }
                }
            }
            var alertInfo = Zotero.UpdateIFs.ZUIFGetString("clean.ifs.finished");
            Zotero.UpdateIFs.showPopUP(alertInfo, 'finished');
        }
    }
};


// 清除加粗
Zotero.UpdateIFs.cleanBold = async function () {
    var rn = 0;
    var items = Zotero.UpdateIFs.getSelectedItems();
    for (item of items) {
        let creators = item.getCreators();
        let newCreators = [];

        for (creator of creators) {
            if (/<b>/.test(creator.firstName) || /<b>/.test(creator.lastName)) {  // 是否包含<b>

                creator.firstName = creator.firstName.replace(/<b>/g, '').replace(/<\/b>/g, '');
                creator.lastName = creator.lastName.replace(/<b>/g, '').replace(/<\/b>/g, '');
                creator.fieldMode = creator.fieldMode;
                rn++;
            }
            newCreators.push(creator);

        }
        item.setCreators(newCreators);

        await item.saveTx();

    }
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') { whiteSpace = '' };
    var rnInfo = rn > 1 ? 'author.changed.mul' : 'author.changed.sig';
    var statusInfo = rn > 0 ? 'finished' : 'failed';
    var alertInfo = rn + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(rnInfo);
    Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);

};



// 清除加星
Zotero.UpdateIFs.cleanStar = async function () {
    var rn = 0;
    var items = Zotero.UpdateIFs.getSelectedItems();
    for (item of items) {
        let creators = item.getCreators();
        let newCreators = [];

        for (creator of creators) {
            if (/\*/.test(creator.firstName) || /\*/.test(creator.lastName)) {

                creator.firstName = creator.firstName.replace(/\*/g, '');
                creator.lastName = creator.lastName.replace(/\*/g, '');
                creator.fieldMode = creator.fieldMode;
                rn++;
            }
            newCreators.push(creator);

        }
        item.setCreators(newCreators);

        // await item.save();
        await item.saveTx()

    }
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') { whiteSpace = '' };
    var rnInfo = rn > 1 ? 'author.changed.mul' : 'author.changed.sig';
    var statusInfo = rn > 0 ? 'finished' : 'failed';
    var alertInfo = rn + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(rnInfo);
    Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);


};

// 清除加粗加星
Zotero.UpdateIFs.cleanBoldAndStar = async function () {
    Zotero.UpdateIFs.cleanStar();
    Zotero.UpdateIFs.cleanBold();


};

Zotero.UpdateIFs.getAuthorName = function () {

    var auName = document.getElementById('id-updateifs-textb-author-name');
    Zotero.Prefs.set('extensions.updateifs.author-name', auName, true);


};

// 将题目改为句首字母大写
Zotero.UpdateIFs.changeTitleCase = async function () {
    var items = Zotero.UpdateIFs.getSelectedItems();
    var alertInfo = '';
    // progresswindow   // 20220310   
    progressWin = null; // 20220310
    itemProgress = []; // 20220310
    progressWin = new Zotero.ProgressWindow(); // 20220310
    progressWin.changeHeadline(Zotero.UpdateIFs.ZUIFGetString('title.case')); // 20220310
    var icon_1 = 'chrome://zoteroupdateifs/skin/pen.png'; // 20220310
    var icon_2 = 'chrome://zoteroupdateifs/skin/greenarrow.png'; // 20220310

    if (items.length == 0) {
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
    } else {
        var result = "";
        for (item of items) {
            var title = item.getField('title');
            if (Zotero.UpdateIFs.detectUpCase(title)) {//如果期刊名全部为大写，转换并提醒
                title = Zotero.UpdateIFs.titleCase(title); // 转换为单词首字母大写
                alertInfo = Zotero.UpdateIFs.ZUIFGetString('all.upcase');
                Zotero.UpdateIFs.showPopUP(alertInfo, 'infomation');
            }

            result += " " + title + "\n";
            var new_title = title.replace(/\b([A-Z][a-z0-9]+|A)\b/g, function (x) { return x.toLowerCase(); });
            new_title = new_title.replace(/(^|\?\s*)[a-z]/, function (x) { return x.toUpperCase(); }).
                replace('china', 'China'). // 替换china  代码来源于fredericky123，感谢。
                replace('chinese', 'Chinese'). // 替换chinese
                replace('america', 'America'). // 替换america
                replace('english', 'English'). // 替换english
                replace('england', 'England'). // 替换england
                replace('india', 'India').// 替换india
                //20220510 增加冒号后面为大写字母   
                // https://stackoverflow.com/questions/72180052/regexp-match-and-replace-to-its-uppercase-in-javascript#72180194           
                replace(/：|:\s*\w/, fullMatch => fullMatch.toUpperCase()); //匹配冒号后面的空格及一个字母，并转为大写

            //20220509 增加冒号后面为大写字母  
            //colon_letter = new_title.match((/(：|:\s*\w)/))[0];  
            //new_title = new_title.replace(colon_letter, colon_letter.toUpperCase()); //转为大写

            // result += "-> " + new_title + "\n\n";
            // // Do it at your own risk
            //pronew =  title + "\n" + "-> " + new_title + "\n\n" ; //// 20220310
            itemProgress.push(new progressWin.ItemProgress(icon_1, title)); //// 20220310
            itemProgress.push(new progressWin.ItemProgress(icon_2, new_title)); //// 20220310
            itemProgress.push(new progressWin.ItemProgress('', '')); // 加空行 20220310
            item.setField('title', new_title);
            await item.saveTx();
        }
        // alertInfo = result;
        // Zotero.UpdateIFs.showPopUP(alertInfo, 'finished');
        progressWin.show(); //// 20220310
        progressWin.startCloseTimer(4000); //// 20220310
    }

};

// 将单词转为首字母大写
Zotero.UpdateIFs.titleCase = function (str) {
    var newStr = str.split(" ");
    for (var i = 0; i < newStr.length; i++) {
        newStr[i] = newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
    }
    return newStr.join(" ");
};

// 检查句子是否为全部大写
Zotero.UpdateIFs.detectUpCase = function (word) {
    var arr_is_uppercase = [];
    for (var char of word) {
        if (char.charCodeAt() < 97) {
            arr_is_uppercase.push(1);   // 是大写就加入 1
        } else {
            arr_is_uppercase.push(0);   // 是小写就加入 0
        }
    }
    var uppercase_sum = arr_is_uppercase.reduce((x, y) => x + y);
    if (
        uppercase_sum === word.length   // 全部为大写
    ) {
        return true;
    } else {
        return false;
    }
};

// 显示配置目录
Zotero.UpdateIFs.showProfileDir = function () {
    var profileDir = Zotero.Profile.dir;  // 配置目录

    var alertInfo = Zotero.UpdateIFs.ZUIFGetString('show.profile.dir') + ' ' + profileDir;
    Zotero.UpdateIFs.showPopUP(alertInfo, 'finished');

};


// 显示数据目录
Zotero.UpdateIFs.showDataDir = function () {
    var dataDir = Zotero.DataDirectory.dir;// 数据目录
    var alertInfo = Zotero.UpdateIFs.ZUIFGetString('show.data.dir') + ' ' + dataDir;
    Zotero.UpdateIFs.showPopUP(alertInfo, 'finished');

};




// 添加条目时自动添加影响因子及分区
Zotero.UpdateIFs.notifierCallback = {
    notify: function (event, type, ids, extraData) {
        var addedItems = Zotero.Items.get(ids);
        var addUppdate = Zotero.Prefs.get('extensions.updateifs.add-update', true); // 是否在添加条目时更新
        var items = [];
        // 得到正常的条目
        for (let item of addedItems) {
            if (event == 'add' && addUppdate && !item.isNote() &&
                item.isRegularItem() && !item.isCollection()) {
                //Zotero.UpdateIFs.updateSelectedItems();// 20221126

                items.push(item);// 20221126
            }

        }
        if (event == 'add' && addUppdate) {
            Zotero.UpdateIFs.updateSelectedItem(items);
        }
    } //此处如果以“，”结尾会提示两次。
};



// 更新分类
Zotero.UpdateIFs.updateSelectedColl = async function () {
    var collection = ZoteroPane.getSelectedCollection();
    var items = collection.getChildItems();
    Zotero.UpdateIFs.updateSelectedItem(items); // 调用更新所选条目函数
    await collection.saveTx();
};

// 更新所选条目
Zotero.UpdateIFs.updateSelectedItems = async function () {
    var items = Zotero.UpdateIFs.getSelectedItems();
    Zotero.UpdateIFs.updateSelectedItem(items); // 调用更新所选条目函数
};


// 得到所选条目
Zotero.UpdateIFs.getSelectedItems = function () {
    var zoteroPane = Zotero.getActiveZoteroPane();
    var items = zoteroPane.getSelectedItems();
    return items; // 
};

// 更新期刊缩写和影响因子
Zotero.UpdateIFs.updateSelectedItem = async function (items) {

    // 得到是否显示南农核心期刊的设置
    var njauCore = Zotero.Prefs.get('extensions.updateifs.njau-core', true);
    var njauCoreField = Zotero.Prefs.get('extensions.updateifs.njau-core-field', true);
    var njauHighQulity = Zotero.Prefs.get('extensions.updateifs.njau-high-quality', true);
    var njauHighQulityField = Zotero.Prefs.get('extensions.updateifs.njau-high-quality-field', true);

    // 得到是否显示分区的设置
    var jcrQu = Zotero.Prefs.get('extensions.updateifs.jcr-qu', true); // JCR分区
    var casQu1 = Zotero.Prefs.get('extensions.updateifs.cas-qu1', true); // 中科院分区升级版
    var casQu2 = Zotero.Prefs.get('extensions.updateifs.cas-qu2', true); // 中科院分区基础版

    var jcrQuField = Zotero.Prefs.get('extensions.updateifs.jcr-qu-field', true); // JCR分区显示字段
    var casQu1Field = Zotero.Prefs.get('extensions.updateifs.cas-qu1-field', true); // 中科院分区升级版显示字段
    var casQu2Field = Zotero.Prefs.get('extensions.updateifs.cas-qu2-field', true); // 中科院分区基础显示字段

    // 得到是否显示影响因子的设置
    var sciIf = Zotero.Prefs.get('extensions.updateifs.sci-if', true);  // IF
    var sciIf5 = Zotero.Prefs.get('extensions.updateifs.sci-if5', true); // 5年IF
    var chjCscd = Zotero.Prefs.get('extensions.updateifs.chj-cscd', true); // CSCD
    var pkuCore = Zotero.Prefs.get('extensions.updateifs.pku-core', true); // 北大核心
    var sciCore = Zotero.Prefs.get('extensions.updateifs.sci-core', true); // 科技核心
    var njuCore = Zotero.Prefs.get('extensions.updateifs.com-if', true); // <!--南大核心 -->
    var eiJour = Zotero.Prefs.get('extensions.updateifs.agg-if', true); // <!-- EI -->

    var sciIfField = Zotero.Prefs.get('extensions.updateifs.sci-if-field', true);  // IF字段
    var sciIf5Field = Zotero.Prefs.get('extensions.updateifs.sci-if5-field', true); // 5年IF字段
    var cscdField = Zotero.Prefs.get('extensions.updateifs.chj-cscd-field', true); // CSCD字段
    var pkuField = Zotero.Prefs.get('extensions.updateifschj-pku-field', true);  // 北大核心字段
    var sciCoreField = Zotero.Prefs.get('extensions.updateifs.chj-sci-field', true);  // 科技核心字段
    var njuField = Zotero.Prefs.get('extensions.updateifs.chj-com-field', true);  //南大核心字段
    var eiJourField = Zotero.Prefs.get('extensions.updateifs.agg-if-field', true);  // EI字段

    var sciAllExtra = Zotero.Prefs.get('extensions.updateifs.sci-all-extra', true);  // 显示所有期刊信息到其它

    var numSuccess = 0;
    var numFail = 0;
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') { whiteSpace = '' };
    var paperName = Zotero.UpdateIFs.getPaperName(items); // publications: tempID 和tempID：publications两个字典
    // 文献类型为期刊时才写入

    var ifs = await Zotero.UpdateIFs.getIFs(paperName);
    if (ifs == '') {
        var statusInfo = 'failed';
        var alertInfo = Zotero.UpdateIFs.ZUIFGetString('not.found');
        Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);
        // return;
    } else {
        var ptID = paperName[1]; // publications: tempID 用于得到后面的tempID

        for (i = 0; i < items.length; i++) {
            if (Zotero.ItemTypes.getName(items[i].itemTypeID) == 'journalArticle' // 文献类型为期刊
            ) {
                await Zotero.UpdateIFs.upJourAbb(items[i]); // 更新期刊缩写
                Zotero.UpdateIFs.setChineseIFs(items[i]); // 更新复合和综合影响因子
                var lanItem = items[i].getField('language'); //得到条目语言
                if (items[i].isRegularItem() && !items[i].isCollection()) {

                    if (njauCore) items[i].setField( // 设置南农核心
                        njauCoreField,
                        Zotero.UpdateIFs.NJAU_Core(items[i]));

                    if (njauHighQulity) items[i].setField( // 设置南农高质量期刊
                        njauHighQulityField,
                        Zotero.UpdateIFs.NJAU_High_Quality(items[i]));



                    try {
                        var pubT = items[i].getField('publicationTitle');
                        var pattern = new RegExp("[\u4E00-\u9FA5]+");
                        var chineseJournal = pattern.test(pubT); // 期刊名中是否有中文，作为判断是否为中文期刊的依据。
                        var tempID = ptID[pubT.toUpperCase()];  // 得到期刊题目的tempID
                        var ifc = ifs.filter(e => e.tempID == tempID)[0]; //当前期刊的信息
                        if (ifc !== undefined) {
                            var sci = ifc['sci']; // JCR分区
                            var sciUp = ifc['sciUp']; // 中科院分区升级版
                            var sciBase = ifc['sciBase']; // 中科院分区基础版
                            var ifCurrent = ifc['sciif']; // 当前影响因子
                            var if5Year = ifc['sciif5'];//5年平均影响因子
                            var eiivalue = ifc['eii'];// EI收录
                            var cssci = ifc['cssci']; // CSSCI南大核心
                            var cscd = ifc['cscd']; // CSCD
                            var pku = ifc['pku'] === '1' ? '中文核心期刊' : ''; // 北大核心
                            var zhongguokejihexin = ifc['zhongguokejihexin']; // 科技核心

                            var eiivalueExtra = ifc['eii'] == 'EI' ? '是' : '否'; // EI收录 用于放入Extra
                            var cssciExtra = ifc['cssci'] === 'CSSCI' ? '是' : '否'; // CSSCI南大核心 用于放入Extra
                            var pkuExtra = ifc['pku'] === '1' ? '是' : '否';// 北大核心 用于放入Extra
                            var zhongguokejihexinExtra = ifc['zhongguokejihexin'] === '中国科技核心期刊' ? '是' : '否'; // 科技核心 用于放入Extra

                            //}

                            // 设置JCR
                            if (jcrQu && sci !== undefined) {
                                items[i].setField(jcrQuField, sci);
                            };
                            //中科院分区分级版
                            if (casQu1 && sciUp !== undefined) {
                                items[i].setField(casQu1Field, sciUp);
                            };
                            //中科院分区基础版
                            if (casQu2 && sciBase !== undefined) {
                                items[i].setField(casQu2Field, sciBase);

                            };
                            //EI
                            if (eiJour && eiivalue !== undefined) {
                                items[i].setField(eiJourField, eiivalue);

                            };

                            // 设置影响因子
                            if (sciIf && ifCurrent !== undefined) {
                                items[i].setField(sciIfField, ifCurrent);

                            };
                            // 设置5年影响因子
                            if (sciIf5 && if5Year !== undefined) {
                                items[i].setField(sciIf5Field, if5Year);

                            };
                            // 中文期刊才写入北大核心、南大核心、CSCD和科技核心字段 
                            if (chineseJournal) {
                                //北大中文核心
                                if (pkuCore && pku !== undefined) {
                                    items[i].setField(pkuField, pku);

                                };
                                //南大核心
                                if (njuCore && cssci !== undefined) {
                                    items[i].setField(njuField, cssci);

                                };


                                //CSCD 
                                if (chjCscd && cscd !== undefined) {
                                    items[i].setField(cscdField, cscd);

                                };

                                //科技核心
                                if (sciCore && zhongguokejihexin !== undefined) {
                                    items[i].setField(sciCoreField, zhongguokejihexin);

                                };
                            };
                            // 填充到Extra的字符串前辍
                            var jcrs = '';
                            var casQu1s = ''
                            var casQu2s = ''
                            var eiJours = ''
                            var ifc = '';
                            var if5 = '';
                            var njuCores = ''
                            var pkuCores = ''
                            var cscds = ''
                            var sciTechs = ''

                            // 得到Extra
                            if (sciAllExtra) {
                                if (sci === undefined) {
                                    sci = '未知';
                                };
                                jcrs = 'JCR分区: ' + sci + '\n';
                                // };
                                //中科院分区分级版
                                if (sciUp === undefined) {
                                    sciUp = '未知';
                                };

                                casQu1s = '中科院分区升级版: ' + sciUp + '\n';
                                // };
                                //中科院分区基础版
                                if (sciBase === undefined) {
                                    sciBase = '未知';
                                };

                                casQu2s = '中科院分区基础版: ' + sciBase + '\n';
                                // };
                                //EI
                                if (eiivalueExtra === undefined) {
                                    eiivalueExtra = '否';
                                };
                                eiJours = 'EI: ' + eiivalueExtra + '\n';
                                // };

                                // 设置影响因子
                                if (ifCurrent === undefined) {
                                    ifCurrent = '未知';
                                };

                                ifc = '影响因子: ' + ifCurrent + '\n';
                                //  };
                                // 设置5年影响因子
                                if (if5Year === undefined) {
                                    if5Year = '未知';
                                };
                                if5 = '5年影响因子: ' + if5Year + '\n';
                                //  };
                                //北大中文核心
                                if (pkuExtra === undefined) {
                                    pkuExtra = '否';
                                };

                                pkuCores = '中文核心期刊/北大核心: ' + pkuExtra + '\n';
                                //};
                                //南大核心
                                if (cssciExtra === undefined) {
                                    cssciExtra = '否';
                                };

                                njuCores = 'CSSCI/南大核心: ' + cssciExtra + '\n';
                                //};
                                //CSCD
                                //if ( cscd !== undefined) {
                                if (cscd === undefined) {
                                    cscd = '否'
                                };
                                cscds = 'CSCD: ' + cscd + '\n';
                                //};
                                //科技核心
                                if (zhongguokejihexinExtra === undefined) {
                                    zhongguokejihexinExtra = '否';
                                };

                                sciTechs = '中国科技核心期刊: ' + zhongguokejihexinExtra + '\n';
                            };

                            var newExtrasEn = jcrs + casQu1s + casQu2s + ifc + if5 + eiJours; // 英文期刊的Extra
                            var newExtrasCh = eiJours + pkuCores + njuCores + cscds + sciTechs; // 中文期刊的Extra

                            var newExtras = lanItem.indexOf('en') !== -1 ? newExtrasEn : newExtrasCh; // 根据期刊语言得到Extra
                            // return newExtras

                            var old = items[i].getField('extra');
                            // 匹配原来Extra的正则
                            var pattExtraEn = /JCR分区:\s.+\n中科院分区升级版:\s.+\n中科院分区基础版:\s.+\n影响因子:\s.+\n5年影响因子:\s.+\nEI:\s.+/g  // 匹配英文期刊Extra
                            var pattExtraCh = /EI:\s.+\n中文核心期刊\/北大核心:\s.+\nCSSCI\/南大核心:\s.+\nCSCD:\s.+\n中国科技核心期刊:\s.+/g; // 匹配中文期刊Extra
                            var pattExtra = lanItem.indexOf('en') !== -1 ? pattExtraEn : pattExtraCh;

                            //return old.replace(pattExtra, newExtras)
                            try {
                                if (sciAllExtra) { // 如果所有英文期刊信息到其它为真，则全部显示到其它字段
                                    if (old.length == 0) {   // 如果内容为空
                                        items[i].setField('extra', newExtras);
                                    } else if (old.search(pattExtra) != -1) { // 如果以前有影响因子则替换
                                        // 匹配原来Extra内容
                                        items[i].setField(
                                            'extra',
                                            old.replace(pattExtra, newExtras).
                                                replace('\n\n', '\n')); // 两个换行替换为一个

                                    } else {   // 以前没有，且内容不为空
                                        items[i].setField('extra', newExtras + old);
                                    }
                                };
                            } catch (error) {
                                numFail++;
                            }

                            items[i].save();
                            numSuccess++;
                        } else {
                            umFail++;
                        }
                    } catch (error) {
                        numFail++;
                    }

                }

            }
            // items[i].save();
            await items[i].saveTx();
        }

        // 更新失败消息提醒
        if (numFail > 0) {
            var failStatusInfo = 'failed';
            var failInfo = numFail > 1 ? 'fail.mul' : 'fail.sig';
            var alertInfo = numFail + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(failInfo);
            Zotero.UpdateIFs.showPopUP(alertInfo, failStatusInfo);

        }

        // 更新成功消息提醒
        var statusInfo = numSuccess > 0 ? 'finished' : 'failed';
        var successInfo = numSuccess > 1 ? 'success.mul' : 'success.sig';
        var alertInfo = numSuccess + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(successInfo);
        Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);
    }
};

// 更新期刊缩写
Zotero.UpdateIFs.upJourAbb = async function (item) {
    // 得到期刊缩写设置
    var upJourAbb = Zotero.Prefs.get('extensions.updateifs.up-abbr', true);
    var dotAbb = Zotero.Prefs.get('extensions.updateifs.dot-abbr', true);
    var enAbb = Zotero.Prefs.get('extensions.updateifs.en-abbr', true);
    var chAbb = Zotero.Prefs.get('extensions.updateifs.ch-abbr', true);
    var lanItem = item.getField('language'); //得到条目语言
    var enItem = lanItem.indexOf('en') !== -1 || // 英文条目
        lanItem.indexOf('English') !== -1;
    var chItem = lanItem.indexOf('ch') !== -1 || //中文条目
        lanItem.indexOf('zh') !== -1 ||
        lanItem.indexOf('中文') !== -1 ||
        lanItem.indexOf('CN') !== -1;
    var pubT = item.getField('publicationTitle');
    if (upJourAbb) {
        var jourAbbs = await Zotero.UpdateIFs.getJourAbb(item); // 得到带点和不带点的缩写
        if (jourAbbs["record"] != 0) {
            try {
                var jourAbb = dotAbb ? jourAbbs["abb_with_dot"] : jourAbbs["abb_no_dot"];
                item.setField('journalAbbreviation', jourAbb);

            } catch (e) {
                return;
            }
            // 英文如果找不到缩写是否用全称代替
        } else if (enAbb && enItem) {
            item.setField('journalAbbreviation', pubT);
            // 英文如果找不到缩写是否用全称代替
        } else if (chAbb && chItem) {
            item.setField('journalAbbreviation', pubT);
        }
    }
    //return jourAbbs
    // item.save();
};

// 得到期刊缩写
Zotero.UpdateIFs.getJourAbb = async function (item) {
    var pubT = item.getField('publicationTitle');
    var url = "https://www.linxingzhong.top/journal";
    var postData = {
        key: "journal",
        "fullname": pubT
    };
    var headers = { "Content-Type": "application/json" };
    // Maybe need to set max retry in this post request.
    var resp = await Zotero.HTTP.request("POST", url, {
        body: JSON.stringify(postData),
        headers: headers,
    });
    try {
        var record = JSON.parse(resp.responseText);
        return record;
    } catch (e) {
        return;
    }
};

// 设置复合影响因子及综合影响因子20220709
// 代码源于@l0o0，感谢。
Zotero.UpdateIFs.setChineseIFs = async function (item) {
    var fuIf = Zotero.Prefs.get('extensions.updateifs.fu-if', true);  // 复合影响因子
    var zongIf = Zotero.Prefs.get('extensions.updateifs.zong-if', true);  // 综合影响因子
    var fuIfField = Zotero.Prefs.get('extensions.updateifs.fu-field', true);  // 复合影响因子字段
    var zongIfField = Zotero.Prefs.get('extensions.updateifs.zong-field', true);  // 综合影响因子字段
    var pubT = item.getField('publicationTitle');
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    if (pattern.test(pubT)) { // 如果期刊名中含有中文才进行替换
        try {

            var body = `searchStateJson=%7B%22StateID%22%3A%22%22%2C%22Platfrom%22%3A%22%22%2C%22QueryTime%22%3A%22%22%2C%22Account%22%3A%22knavi%22%2C%22ClientToken%22%3A%22%22%2C%22Language%22%3A%22%22%2C%22CNode%22%3A%7B%22PCode%22%3A%22JOURNAL%22%2C%22SMode%22%3A%22%22%2C%22OperateT%22%3A%22%22%7D%2C%22QNode%22%3A%7B%22SelectT%22%3A%22%22%2C%22Select_Fields%22%3A%22%22%2C%22S_DBCodes%22%3A%22%22%2C%22QGroup%22%3A%5B%7B%22Key%22%3A%22subject%22%2C%22Logic%22%3A1%2C%22Items%22%3A%5B%5D%2C%22ChildItems%22%3A%5B%7B%22Key%22%3A%22txt%22%2C%22Logic%22%3A1%2C%22Items%22%3A%5B%7B%22Key%22%3A%22txt_1%22%2C%22Title%22%3A%22%22%2C%22Logic%22%3A1%2C%22Name%22%3A%22TI%22%2C%22Operate%22%3A%22%25%22%2C%22Value%22%3A%22'${encodeURIComponent(pubT)}'%22%2C%22ExtendType%22%3A0%2C%22ExtendValue%22%3A%22%22%2C%22Value2%22%3A%22%22%7D%5D%2C%22ChildItems%22%3A%5B%5D%7D%5D%7D%5D%2C%22OrderBy%22%3A%22OTA%7CDESC%22%2C%22GroupBy%22%3A%22%22%2C%22Additon%22%3A%22%22%7D%7D&displaymode=1&pageindex=1&pagecount=21&index=&searchType=%E5%88%8A%E5%90%8D(%E6%9B%BE%E7%94%A8%E5%88%8A%E5%90%8D)&clickName=&switchdata=search&random=0.2815758347350512`;
            var resp = await Zotero.HTTP.request(
                "POST",
                "https://navi.cnki.net/knavi/all/searchbaseinfo",
                {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.49",
                    },
                    body: body,
                }

            );

            var AllJour = resp.responseText;

            var reg = pubT + '\n(.*\n){10,40} .*复合影响因子：(.*)\n(.*\n){0,6} .*综合影响因子：(.*)'; //复合影响因子和综合影响因子正则，里面含有空格，\s不行
            var patt = new RegExp(reg, 'i'); // 
            var jour = AllJour.match(patt) // [2]为复合影响因子，[4]为综合IF

            var fuIfFill = jour[2];
            var zongIfFill = jour[4];

            // 复合影响因子
            if (fuIf && fuIfFill !== undefined) {
                item.setField(fuIfField, fuIfFill);

            };
            // 综合影响因子
            if (zongIf && zongIfFill !== undefined) {
                item.setField(zongIfField, zongIfFill);

            };
            item.save();
        } catch (e) {
            return;
        }
    }


};
// 得到影响因子及详细网址函数 
Zotero.UpdateIFs.getIFs = async function (paperName) {
    var data = {};
    var optionCheckd = ['sci', 'sciif5', 'sciUp', 'sciBase', 'sciif', 'eii',   // 英文期刊：分区、中科院升级版、中科院基础版、IF、EI
        'cssci', 'cscd', 'pku', 'zhongguokejihexin']; // 中文期刊：南大核心、CSCD、北大核心、科技核心：
    data["requirePaperRank"] = optionCheckd;
    data["version"] = "5.6";
    data["website"] = "Zotero";
    data["papersName"] = paperName[0]; // [0] 为id：期刊

    data["paperTotal"] = Object.keys(data["papersName"]).length;
    var url = "https://easyscholar.cc/homeController/getPapersRank.ajax";
    var headers = { "Content-Type": "application/json" };
    // Maybe need to set max retry in this post request.
    var resp = await Zotero.HTTP.request("POST", url, {
        credentials: "include",
        body: JSON.stringify(data),
        headers: headers,
    });
    try {
        var updateJson = JSON.parse(resp.responseText);
        return updateJson["papersRank"];
    } catch (e) {
    }
};

//得到要查询的期刊题目,形成字典形式：{key：期刊题目},用于查询
Zotero.UpdateIFs.getPaperName = function (items) {
    var papersName = {};
    var papersName0 = {};
    var papersName1 = {};
    var pt = Zotero.UpdateIFs.getPublicationTitles(items);
    var keys = Zotero.UpdateIFs.generateNKey(pt.length);
    for (i = 0; i < pt.length; i++) {
        papersName0[keys[i]] = pt[i];   //0为id：期刊
        papersName1[pt[i]] = keys[i];  //1为期刊：id
    }
    papersName[0] = papersName0;
    papersName[1] = papersName1;
    return papersName;
};
//得到要查询的期刊题目
Zotero.UpdateIFs.getPublicationTitles = function (items) {

    var publicationTitles = [];

    for (i = 0; i < items.length; i++) {
        publicationTitles.push(items[i].getField('publicationTitle').toUpperCase());

    }
    publicationTitles = Zotero.UpdateIFs.unique(publicationTitles); // 去除重复期刊题目
    return publicationTitles;
};

Zotero.UpdateIFs.generateNKey = function (n) {
    var keys = [];
    var key = Zotero.UpdateIFs.generate1Key();
    while (keys.length < n) {
        var key = Zotero.UpdateIFs.generate1Key();
        keys.push(key);
        keys = Zotero.UpdateIFs.unique(keys);
    }
    return keys;
};
// 生成4位有效数字 
// 代码源于：https://blog.csdn.net/hdq1745/article/details/88929612

Zotero.UpdateIFs.generate1Key = function () {

    var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var lastarr = new Array();

    while (lastarr.length < 4) {
        var num = Math.floor(Math.random() * 10);
        if (lastarr.indexOf(arr[num]) === -1) {
            lastarr += arr[num];
        }
    }

    return lastarr;
};

// 删除数组重复数据
// https://blog.csdn.net/weixin_44849078/article/details/89840871
Zotero.UpdateIFs.unique = function (arr) {
    let hash = [];
    for (let i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) === -1) {
            hash.push(arr[i]);
        }
    }
    return hash;
};

// 南京农业大学核心期刊分类2010
Zotero.UpdateIFs.NJAU_Core = function (item) {
    var classOne = ['病毒学报', '材料研究学报', '草业学报', '测绘学报', '大豆科学',
        '地理学报', '分析科学学报', '复合材料学报', '管理科学学报', '光学学报',
        '核农学报', '化学通报', '环境科学', '机械工程学报', '计算机学报',
        '计算机研究与发展', '解剖学报', '菌物学报', '昆虫学报', '林业科学',
        '麦类作物学报', '棉花学报', '摩擦学学报', '南京农业大学学报', '农业工程学报',
        '农业机械学报', '气象学报', '软件学报', '生态学报', '生物多样性',
        '生物工程学报', '食品科学', '数学学报',
        '水产学报', '水土保持学报',
        '太阳能学报', '土壤学报', '微生物学报', '畜牧兽医学报', '岩土工程学报',
        '遥感学报', '药学学报', '营养学报', '应用生态学报', '园艺学报',
        '振动工程学报', '植物保护学报', '植物病理学报', '植物生态学报', '植物学报',
        '植物营养与肥料学报', '中国公路学报', '中国环境科学', '中国激光', '中国农业科学',
        '中国生物化学与分子生物学报', '中国水稻科学', '中国中药杂志', '中华流行病学杂志', '中华微生物学和免疫学杂志',
        '自动化学报', '自然资源学报', '作物学报'];


    var classTwo = ['爆炸与冲击', '材料工程', '材料科学与工程学报', '材料科学与工艺', '长江流域资源与环境',
        '地理科学', '地理研究', '地球化学', '地球科学进展', '电子与信息学报',
        '动物分类学报', '动物学研究', '动物学杂志', '发光学报', '分析测试学报',
        '分析试验室', '分子细胞生物学报', '高分子材料科学与工程', '工程力学', '管理工程学报',
        '光子学报', '海洋与湖泊', '环境工程学报', '环境化学', '环境科学学报',
        '机器人', '机械设计', '计算机辅助设计与图型学学报', '计算机集成制造系统-CIMS', '计算机科学',
        '精细化工', '控制与决策', '昆虫知识', '力学进展', '林业科学研究',
        '免疫学杂志', '农业环境科学学报', '农业生物技术学报', '农业现代化研究', '汽车工程',
        '色谱', '生态学杂志', '生物物理学报', '食品工业科技', '食品与发酵工业',
        '食品与生物技术学报', '数学进展', '数学年刊A辑',
        '水生生物学报', '水土保持通报',
        '土壤', '土壤通报', '微生物学通报', '细胞与分子免疫学杂志', '西北植物学报',
        '小型微型计算机系统', '岩石学报', '遥感技术与应用', '仪器仪表学报', '遗传',
        '应用化学', '应用气象学报', '应用数学学报',
        '应用与环境生物学报', '杂交水稻',
        '振动与冲击', '植物保护', '植物生理学通讯', '植物研究', '植物遗传资源学报',
        '植物资源与环境学报', '中草药', '中国草地学报', '中国给水排水', '中国机械工程',
        '中国寄生虫学与寄生虫病杂志', '中国粮油学报', '中国人兽共患病学报', '中国生物防治', '中国生物医学工程学报',
        '中国兽医学报', '中国水产科学', '中国图象图形学报', '中国药理学通报', '中国药学杂志',
        '中国油料作物学报', '中国油脂', '中国兽医科学', '中药材', '资源科学',
        '草地学报', '茶叶科学*', '农药学学报', '气候变化研究进展'];
    var pubT = item.getField('publicationTitle');

    if (classOne.includes(pubT)) {
        return '一类核心';
    } else if (classTwo.includes(pubT)) {
        return '二类核心';
    } else {
        return '无'
    }


};

// 南京农业大学高质量期刊
Zotero.UpdateIFs.NJAU_High_Quality = function (item) {
    // 高质量论文一类
    var highQulityOne = ['中国农业科学', '农业工程学报', '南京农业大学学报', '核农学报', '园艺学报', '微生物学报',
        '生物工程学报'];
    // 高质量论文二类
    var highQulityTwo = ['食品与发酵工业', '微生物学通报', '中国粮油学报', '食品与生物技术学报'];

    // 高质量论文A类
    var highQulityA = ['Comprehensive Reviews in Food Science and Food Safety', 'Critical Reviews in Food Science and Nutrition',
        'ACS Nano', 'Metabolic Engineering', 'Postharvest Biology and Technology', 'Journal of Agricultural and Food Chemistry',
        'Food Hydrocolloids', 'Food Chemistry', 'Food Microbiology', 'Food Control', 'Food & Function', 'Microbiome', 'ISME Journal',
        'Ecotoxicology and Environmental Safety', 'Colloids and surfaces B-Biointerfaces', 'Food and Chemical Toxicology',
        'International Journal of Food Microbiology', 'Food Quality and Preference', 'Food Packaging and Shelf Life', 'Toxins',
        'Food Research International', 'Journal of Food Engineering', 'Journal of Functional Foods', 'Meat Science',
        'LWT-Food Science and Technology', 'Journal of Dairy Science', 'Journal of Food Composition and Analysis',
        'Journal of the Science of Food and Agriculture', 'Poultry Science', 'Scientia Horticulturae', 'Journal of Integrative Agriculture',
        'mBio', 'Free Radical Biology and Medicine', 'mSystems', 'Ultrasonics Sonochemistry', 'Journal of Experimental Botany',
        'Journal of Nutritional Biochemistry', 'Foods', 'Food Reviews International', 'Food and Bioproducts Processing',
        'Plant Foods for Human Nutrition', 'Microchemical Journal', 'Sensors', 'Current Opinion in Food Science'];

    // 高质量论文B类
    var highQulityB = ['Applied Microbiology and Biotechnology', 'Microorganisms', 'Frontiers in Microbiology', 'Food and Bioprocess Technology',
        'Food Analytical Methods', 'Food Science and Human Wellness', 'Food Bioscience', 'International Dairy Journal', 'Journal of Cereal Science',
        'International Journal of Food Sciences and Nutrition', 'Biotechnology Progress', 'International Journal of Food Science and Technology',
        'Journal of Bioscience and Bioengineering', 'Food Biophysics', 'Journal of Food Science', 'European Food Research and Technology',
        'Molecules', 'Process Biochemistry', 'Coatings', 'Drying Technology', 'Horticulture Environment and Biotechnology',
        'Animal Science Journal'];
    // 高质量论文C类
    var highQulityC = ['European Journal of Lipid Science and Technology'];

    var pubT = item.getField('publicationTitle');

    if (highQulityOne.includes(pubT)) {
        return '自然科学一类'; // 高质量论文一类
    } else if (highQulityTwo.includes(pubT)) {
        return '自然科学二类'; // 高质量论文二类
    } else if (highQulityA.includes(pubT)) {
        return '自然科学A';
    } else if (highQulityB.includes(pubT)) {
        return '自然科学B';
    } else if (highQulityC.includes(pubT)) {
        return '自然科学C';
    } else {
        return '无'
    }


};

// CSSCI、北大核心
Zotero.UpdateIFs.CSSCI_PKU = async function (item) {
    let url = item.getField("url");
    let resp = await Zotero.HTTP.request("GET", url);
    // Use DOMParser to parse text to HTML.
    // This DOMParser is from XPCOM.
    var parser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
        .createInstance(Components.interfaces.nsIDOMParser);
    let html = parser.parseFromString(resp.responseText, "text/html");
    var cssci = html.querySelectorAll("a.type");
    if (cssci.length > 0) {
        var njuCore = Array.prototype.map.call(cssci, ele => ele.innerText).join(", ");
    } else {
        var njuCore = '';
    }
    return njuCore;


};
//   // CSSCI、EI 无法抓取 网页加密了
//   Zotero.UpdateIFs.CSSCI_EI = async function(detailURL){
//     try {
//         var pubTitle = item.getField('publicationTitle');
//         var url = 'https://s.wanfangdata.com.cn/magazine?q=' + 
//                     encodeURIComponent(pubTitle); 
//         var xPathJour = '//*[@class="title-area"]';
//         var resp = await Zotero.HTTP.request("GET", url);
//         var parser = new DOMParser();
//         var html = parser.parseFromString(
//             resp.responseText,
//             "text/html"
//         );  
//        // return html;

//         var AllJour = Zotero.Utilities.xpath(html, xPathJour)[0].innerText;
//     }

//     catch (error){

//     }
//   };

// Localization (borrowed from ZotFile sourcecode) 
// 提示语言本地化函数 Zotero.UpdateIFs.updateItem = async function(item) {

Zotero.UpdateIFs.ZUIFGetString = function (name, params) {
    var l10n = '';
    stringsBundle = Components.classes['@mozilla.org/intl/stringbundle;1']
        .getService(Components.interfaces.nsIStringBundleService)
        .createBundle('chrome://zoteroupdateifs/locale/zoteroupdateifs.properties');
    try {
        if (params !== undefined) {
            if (typeof params != 'object') {
                params = [params];
            }
            l10n = tringsBundle.formatStringFromName(name, params, params.length);
        }
        else {
            l10n = stringsBundle.GetStringFromName(name);
        }
    }
    catch (e) {
        throw ('Localized string not available for ' + name);
    }
    return l10n;
};


// 是否显示菜单函数
Zotero.UpdateIFs.displayMenuitem = function () { // 如果条目不符合，则禁用菜单
    var pane = Services.wm.getMostRecentWindow("navigator:browser")
        .ZoteroPane;
    var collection = ZoteroPane.getSelectedCollection();
    var items = pane.getSelectedItems();
    if (collection) { var items_coll = collection.getChildItems(); }
    //Zotero.debug("**Jasminum selected item length: " + items.length);
    var showMenuItem = items.some((item) => Zotero.UpdateIFs.checkItem(item));  // 检查条目
    var showMenuColl = (collection == false); // 非正常文件夹，如我的出版物、重复条目、未分类条目、回收站，为false，此时返回值为true，隐藏菜单
    if (collection) { // 如果是正常分类才显示
        var showMenuColl = items_coll.some((item) => Zotero.UpdateIFs.checkItem(item));
    } else {
        var showMenuColl = false;
    } // 检查分类条目是否适合
    //   

    pane.document.getElementById( // 分类/文件夹菜单是否可见 
        "zotero-collectionmenu-updateifs"
    ).hidden = !showMenuColl; // 分类条目上不符合则隐藏

    // pane.document.getElementById( // 分类/文件夹分隔条是否可见 id-delcoll-separator
    //     "id-delcoll-separator"
    //     ).hidden = showMenuColl; //  分隔条

    pane.document.getElementById( // 条目上是否禁用
        "zotero-itemmenu-updateifs"
    ).disabled = !showMenuItem; // 如不符合则禁用 

};

// 检查条目是否符合
Zotero.UpdateIFs.checkItem = function (item) {
    if (item && !item.isNote()) {
        if (item.isRegularItem()) { // not an attachment already
            issn = item.getField('ISSN')

            if ( //issn.search('-') != -1 && // 如果isn中有'-'
                Zotero.ItemTypes.getName(item.itemTypeID) == 'journalArticle' // 文献类型为期刊
            ) { return true }

        }

    }
};

// 生成空格，如果是中文是无空格，英文为空格
Zotero.UpdateIFs.whiteSpace = function () {
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') { whiteSpace = '' };
    return whiteSpace;
};

// 右下角弹出函数 
Zotero.UpdateIFs.showPopUP = function (alertInfo, status) {

    var progressWindow = new Zotero.ProgressWindow({ closeOnClick: true });
    progressWindow.changeHeadline(Zotero.UpdateIFs.ZUIFGetString(status));
    progressWindow.addDescription(alertInfo);
    progressWindow.show();
    progressWindow.startCloseTimer(4000);
};

if (typeof window !== 'undefined') {

    window.addEventListener('load', function (e) {
        Zotero.UpdateIFs.init();

    }, false);
}

window.addEventListener(
    "load",
    function (e) {
        if (window.ZoteroPane) {
            var doc = window.ZoteroPane.document;
            // add event listener for menu items
            doc.getElementById("zotero-itemmenu").addEventListener(
                "popupshowing",
                Zotero.UpdateIFs.displayMenuitem,
                false
            );
            // add event listener for menu collections
            doc.getElementById("zotero-collectionmenu").addEventListener(
                "popupshowing",
                Zotero.UpdateIFs.displayMenuitem,
                false
            );
            // add event listener for pop menu监听弹出菜单，执行隐藏函数
            doc.getElementById("menu_ToolsPopup").addEventListener(
                "popupshowing",
                Zotero.UpdateIFs.showToolboxMenu,
                false
            );

            // add event listener for pop menu
            // doc.getElementById("menu_ToolsPopup").addEventListener(
            //     "popupshowing",
            //     Zotero.UpdateIFs.test,
            //     false
            // );

            // // add event listener for pop menu
            // doc.getElementById("menu_Tools-updateifs-menu").addEventListener(
            //     "popupshowing",
            //     Zotero.UpdateIFs.showToolboxMenu,
            //     false
            // );
            // // add event listener for pop menu
            // doc.getElementById("menu_Tools-updateifs-menu-popup").addEventListener(
            //                     "popupshowing",
            //                     Zotero.UpdateIFs.showToolboxMenu,
            //                     false
            // );
        }
    },
    false
)

module.exports = Zotero.UpdateIFs;
