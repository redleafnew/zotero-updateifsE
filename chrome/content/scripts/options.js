// 读取options.xul对话框值并写入配置，用于显示隐藏子菜单

// test = function(paneID, action) {

//     var io = {pane: paneID, action: action};
//     window.openDialog('chrome://zoteroupdateifs/content/title-search-replace.xul',
//         'updateifs-title-search-replace',
//         'chrome,titlebar,toolbar,centerscreen', io
//     );
// };

openTitleFindRelace = function(paneID, action) {

    var io = {pane: paneID, action: action};
    window.openDialog('chrome://zoteroupdateifs/content/title-search-replace.xul',
        'updateifs-title-search-replace',
        'chrome,titlebar,toolbar,centerscreen', io
    );
};

titleFindReplace = async function() {
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') {whiteSpace = ''};
    var alertInfo = '';
    var oldTitle = document.getElementById('id-updateifs-textb-old-name').value.trim(); // 被替换的部分单词或整个题目
    var newTitle = document.getElementById('id-updateifs-textb-new-name').value.trim(); // 新的部分单词或整个题目
    // 如果新或老题目为空则提示
    if (oldTitle == '' || newTitle =='') {

        alertInfo = Zotero.UpdateIFs.ZUIFGetString('title.empty');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');

    } else if ( oldTitle == newTitle) { 
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('find.replace.same');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
    } else {
        // alertInfo = oldTitle;
        // Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
     var items = Zotero.UpdateIFs.getSelectedItems();
     var n = 0;
     var itemOldTitle = ''; // 原题目
     var replaced_title = ''; // 新题目
     if (items.length == 0) {
         alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
         Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
         } else {
             for (item of items) {
                     itemOldTitle = item.getField('title').trim(); //原题目
                     if (itemOldTitle.indexOf(oldTitle) != -1) { //如果包含原字符
                     replaced_title = itemOldTitle.replace(oldTitle, newTitle);
                     item.setField('title', replaced_title);
                     await item.saveTx();
                     n ++;
                    }
                  }

                 
             }
             var statusInfo = n == 0 ? 'failed' : 'finished';
             var itemNo = n > 1 ? 'success.mul' : 'success.sig';
            alertInfo = n + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(itemNo);
            Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);  
         }
     //}
      
    
};


showToolboxMenu = function() {
    // var pane = Services.wm.getMostRecentWindow("navigator:browser")
    // .ZoteroPane;
    var boldStar = document.getElementById('id-menu-bold-star-ckb').checked;
    var cleanBold = document.getElementById('id-menu-clean-bold-ckb').checked;
    var cleanStar = document.getElementById('id-menu-clean-star-ckb').checked;
    var CeanBoldStar = document.getElementById('id-menu-clean-bold-star-ckb').checked;
    var auTitleCase = document.getElementById('id-menu-chang-author-title-case-ckb').checked;
    var swapAu = document.getElementById('id-menu-swap-author-name-ckb').checked;
    var pubTitle = document.getElementById('id-menu-chang-pub-title-ckb').checked;
    var pubTitleCase = document.getElementById('id-menu-chang-pub-title-case-ckb').checked;
    var titleSenCase = document.getElementById('id-menu-title-sentence-case-ckb').checked;
    var profileDir = document.getElementById('id-menu-show-profile-dir-ckb').checked;
    var dataDir = document.getElementById('id-meun-show-data-dir-ckb').checked;
    var sep1 = document.getElementById('id-menu-sep-1-ckb').checked;
    var sep2 = document.getElementById('id-menu-sep-2-ckb').checked;

    Zotero.Prefs.set('pref-updateifs-menu-bold-star', boldStar, true);
    Zotero.Prefs.set('pref-updateifs-menu-clean-bold', cleanBold, true);
    Zotero.Prefs.set('pref-updateifs-menu-clean-star', cleanStar, true);
    Zotero.Prefs.set('pref-updateifs-menu-clean-bold-star', CeanBoldStar, true);
    Zotero.Prefs.set('pref-updateifs-menu-au-title-case', auTitleCase, true);
    Zotero.Prefs.set('pref-updateifs-menu-swap-au', swapAu, true);
    Zotero.Prefs.set('pref-updateifs-menu-pub-title', pubTitle, true);
    Zotero.Prefs.set('pref-updateifs-menu-pub-title-case', pubTitleCase, true);
    Zotero.Prefs.set('pref-updateifs-menu-title-sen-case', titleSenCase, true);
    Zotero.Prefs.set('pref-updateifs-menu-profile-dir', profileDir, true);
    Zotero.Prefs.set('pref-updateifs-data-dir-star', dataDir, true);
    Zotero.Prefs.set('pref-updateifs-sep1', sep1, true);
    Zotero.Prefs.set('pref-updateifs-sep2', sep2, true);

   
};

//从设置中读取复选框是否选中
setCheckbox= function() {

        // 读取设置
        var boldStar = Zotero.Prefs.get('pref-updateifs-menu-bold-star', true);
        var boldStar = Zotero.Prefs.get('pref-updateifs-menu-bold-star', true);
        var cleanBold = Zotero.Prefs.get('pref-updateifs-menu-clean-bold', true);
        var cleanStar = Zotero.Prefs.get('pref-updateifs-menu-clean-star', true);
        var cleanBoldAndStar = Zotero.Prefs.get('pref-updateifs-menu-clean-bold-star', true);
        var auTitleCase = Zotero.Prefs.get('pref-updateifs-menu-au-title-case', true);
        var swapAu = Zotero.Prefs.get('pref-updateifs-menu-swap-au', true);
        var titleSenCase = Zotero.Prefs.get('pref-updateifs-menu-title-sen-case',  true);
        var pubTitle = Zotero.Prefs.get('pref-updateifs-menu-pub-title', true);
        var pubTitleCase = Zotero.Prefs.get('pref-updateifs-menu-pub-title-case', true);
        var profileDir = Zotero.Prefs.get('pref-updateifs-menu-profile-dir',  true);
        var dataDir = Zotero.Prefs.get('pref-updateifs-data-dir-star', true);
        var sep1 = Zotero.Prefs.get('pref-updateifs-sep1', true);
        var sep2 = Zotero.Prefs.get('pref-updateifs-sep2', true);

        // 设置复选框
          document.getElementById('id-menu-bold-star-ckb').checked = boldStar;
           document.getElementById('id-menu-clean-bold-ckb').checked = cleanBold;
          document.getElementById('id-menu-clean-star-ckb').checked = cleanStar;
           document.getElementById('id-menu-clean-bold-star-ckb').checked = CeanBoldStar;
           document.getElementById('id-menu-chang-author-title-case-ckb').checked = auTitleCase;
           document.getElementById('id-menu-swap-author-name-ckb').checked = swapAu;
           document.getElementById('id-menu-chang-pub-title-ckb').checked = pubTitle;
           document.getElementById('id-menu-chang-pub-title-case-ckb').checked = pubTitleCase;
           document.getElementById('id-menu-title-sentence-case-ckb').checked = titleSenCase;
           document.getElementById('id-menu-show-profile-dir-ckb').checked = profileDir;
           document.getElementById('id-meun-show-data-dir-ckb').checked = dataDir;
          document.getElementById('id-menu-sep-1-ckb').checked = sep1 ;
          document.getElementById('id-menu-sep-2-ckb').checked = sep2;


};
// 更改期刊名称大小写
changPubTitleCase = async function() {
    var items = Zotero.UpdateIFs.getSelectedItems();
    var whiteSpace = Zotero.UpdateIFs.whiteSpace();
    var n = 0;
    var newPubTitle = '';
    if (items.length == 0) {
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        }  else {
            for (item of items) {
                    oldPubTitle = item.getField("publicationTitle").trim();//原题目
                    newPubTitle =  titleCase(oldPubTitle). //转为词首字母大写
                                    replace(' And ', ' and '). // 替换And
                                    replace(' For ', ' for '). // 替换For
                                    replace(' In ', ' in '). // 替换In
                                    replace(' Of ', ' of '). // 替换Of
                                    replace('Plos One', 'PLOS ONE').
                                    replace('Plos', 'PLOS').
                                    replace('Msystems', 'mSystems').
                                    replace('Lwt', 'LWT').
                                    replace('LWT-food', 'LWT-Food').
                                    replace('LWT - food', 'LWT - Food').
                                    replace('Ieee', 'IEEE').
                                    replace('Gida', 'GIDA').
                                    replace('Pnas', 'PNAS').
                                    replace('Iscience', 'iScience')


                    item.setField("publicationTitle", newPubTitle);
                    await item.saveTx();
                    n++;
                                  
            }
            var statusInfo = n == 0 ? 'failed' : 'finished';
            var itemNo = n > 1 ? 'success.pub.title.mul' : 'success.pub.title.sig';
            alertInfo = n + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(itemNo);
            Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);  
        }

   
    };

// 更改期刊名称
changeTitle = async function() {
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') {whiteSpace = ''};
    var alertInfo = '';
    var oldTitle = document.getElementById('id-updateifs-old-title-textbox').value.trim();
    var newTitle = document.getElementById('id-updateifs-new-title-textbox').value.trim();
    // 如果新或老题目为空则提示
    if (oldTitle == '' || newTitle =='') {

        alertInfo = Zotero.UpdateIFs.ZUIFGetString('pub.title.empty');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');

    } else {
    var items = Zotero.UpdateIFs.getSelectedItems();
    var n = 0;
    var itemOldTitle = '';
    if (items.length == 0) {
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        }  else {
            for (item of items) {
                    itemOldTitle = item.getField("publicationTitle").trim();//原题目
                    if (oldTitle == itemOldTitle) { //如果和输入的相等则替换
                    item.setField("publicationTitle", newTitle);
                    await item.saveTx();
                    n++;
                 }

                 
            }
            var statusInfo = n == 0 ? 'failed' : 'finished';
            var itemNo = n > 1 ? 'success.mul' : 'success.sig';
            alertInfo = n + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(itemNo);
            Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);  
        }
      
    }
  
};

addBoldStar = async function (boldStar) {
    var auName = document.getElementById('id-updateifs-textb-author-name').value.trim(); // 得到文本框中作者姓名
       
    var newName = newNames (auName, boldStar);
    var alertInfo = newName;

    // //英文替换
      var oldName = newName[0];
      var newFirstName = newName[1];
      var newLastName = newName[2];
      var newFieldMode = newName[3]; // 0: two-field, 1: one-field (with empty first name)
      var mergeedName = newName[4];
      var mergeedNameNew = newName[5];
    
    var rn = 0; //计数替换条目个数
    //await Zotero.DB.executeTransaction(async function () {
      
        items = Zotero.UpdateIFs.getSelectedItems();
        if (items.length == 0) { // 如果没有选中条目则提示，中止
            alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
            Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
            }  else {
                for (item of items) {
                let creators = item.getCreators();
                let newCreators = [];
                for (let creator of creators) {
                    if (`${creator.firstName} ${creator.lastName}`.trim() == oldName) {
                        creator.firstName = newFirstName;
                        creator.lastName = newLastName;
                        creator.fieldMode = newFieldMode;
                                rn ++;
                    }
        
                    if (`${replaceBoldStar(creator.lastName)}`.trim() == mergeedName) { // 针对已经合并姓名的
                        creator.firstName = '';
                        creator.lastName = mergeedNameNew;
                        creator.fieldMode = newFieldMode;
                                rn ++;
                    }
                    if (`${replaceBoldStar(creator.firstName)} ${replaceBoldStar(creator.lastName)}`.trim() == oldName) {
                        creator.firstName = newFirstName;
                        creator.lastName = newLastName;
                        creator.fieldMode = newFieldMode;
                                rn ++;
                    }

                    newCreators.push(creator);
        
                }
                item.setCreators(newCreators);
        
                await item.save();
        
                }
        
        //}); 
        var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
        var whiteSpace = ' ';
        if (lanUI == 'zh-CN') {whiteSpace = ''};
        var rnInfo = rn > 1 ? 'author.changed.mul' : 'author.changed.sig';
        var statusInfo = rn > 0 ? 'finished' : 'failed';
        var alertInfo = rn + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(rnInfo);
        Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);
        // return rn + " item(s) updated";
    }

    
};

// 返回新的名字用以替换
function newNames (auName, boldStar) {
        var newName = [];
        var splitName = '';
        var oldName= '';
        var newFirstName= '';
        var newLastName= '';
        var reg =/[一-龟]/; // 匹配所有汉字
        var mergeedName ='';
        var mergeedNameNew ='';
        var alertInfo ='';
        
        var authorName = auName; // 得到文本框姓名
        
    
        if (authorName == ''){ // 如果作者为空时提示
            alertInfo = Zotero.UpdateIFs.ZUIFGetString("author.empty");
            Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        } else if (!/\s/.test(authorName) ) {  //检测输入的姓名中是否有空格,无空格提示
            alertInfo = Zotero.UpdateIFs.ZUIFGetString("author.no.space");
            Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        } else {  
            
            var splitName =  authorName.split(/\s/); // 用空格分为名和姓
            var firstName = splitName[1];
            var lastName = splitName[0];
            oldName = firstName + ' ' + lastName;
            // 检测姓名是否为中文
            if (reg.test(authorName)) { // 为真时匹配到中文
            var newFieldMode = 1;  // 1中文时为合并
            mergeedName = authorName.replace(/\s/, ''); // 中文姓名删除空格得到合并的姓名
            } else {
                newFieldMode = 0; // 0为拆分姓名，英文
                mergeedName = oldName; // 英文姓名与原姓名相同
            };
    
    
   
            switch (boldStar) {
                case 'boldStar':  // 加粗加星
                       
                    mergeedNameNew = '<b>' + mergeedName + '*</b>';
                    newFirstName = '<b>' + firstName + '*</b>';
                    newLastName = '<b>' + lastName  + '</b>';
                    if (reg.test(authorName)) { // 中文姓名
                        newFirstName = "";
                        newLastName = '<b>' + lastName + firstName +'*</b>';
                    };
                    break;
                case 'bold': // 仅加粗
                
                mergeedNameNew = '<b>' + mergeedName + '</b>'; 
                    newFirstName = '<b>' + firstName + '</b>';
                    newLastName = '<b>' + lastName  + '</b>';
                    if (reg.test(authorName)) { // 中文姓名
                        newFirstName = "";
                        newLastName = '<b>' + lastName + firstName +'</b>';
                    };
                    break;
                case 'star':  // 加粗加星
                
                    mergeedNameNew = mergeedName + '*'; 
                    newFirstName =  firstName + '*';
                    newLastName = lastName;
                    if (reg.test(authorName)) { // 中文姓名
                        newFirstName = "";
                        newLastName = lastName + firstName +'*';
                    };
                    break;
                case 'n':
                    //var alertInfo = Zotero.UpdateIFs.ZUIFGetString("bold.or.star");
                    //Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
                    break;
             
            }
            newName.push(oldName, newFirstName, newLastName, newFieldMode, mergeedName, mergeedNameNew)
            return  newName;
    
        }
    
    };

  

// 清除加粗加星
cleanBoldAndStar = async function() {
    var rn = 0;
    var  items = Zotero.UpdateIFs.getSelectedItems();
    var boldStarCon = ''; // 是否含粗体和星号
    var reg = /<b>|<\/b>|\*/; // 是否含粗体和星号正则
    if (items.length == 0) { // 如果没有选中条目则提示，中止
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        }  else {
            for (item of items) {
            let creators = item.getCreators();
            let newCreators = [];
        
            for (creator of creators) {

                boldStarCon = reg.test(creator.firstName) || reg.test(creator.lastName);

                if (boldStarCon) {
                    
                    creator.firstName = replaceBoldStar(creator.firstName);
                    creator.lastName = replaceBoldStar(creator.lastName);
                    creator.fieldMode = creator.fieldMode;
                            rn ++;
                }
                newCreators.push(creator);

                }
            item.setCreators(newCreators);

            await item.save();

            }
            var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
            var whiteSpace = ' ';
            if (lanUI == 'zh-CN') {whiteSpace = ''};
            var rnInfo = rn > 1 ? 'author.changed.mul' : 'author.changed.sig';
            var statusInfo = rn > 0 ? 'finished' : 'failed';
            var alertInfo = rn + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(rnInfo);
            Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);
    }

};

// 删除作者姓名中的粗体和星号标识
function replaceBoldStar (auName) {
       return  auName.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/\*/g, '');
        
    };

changAuthorCase = async function() {
    var rn = 0; //计数替换条目个数
    // var newFieldMode = 0; // 0: two-field, 1: one-field (with empty first name)
    //await Zotero.DB.executeTransaction(async function () {
    var  items = Zotero.UpdateIFs.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        }  else {
                for (item of items) {

                        var creators = item.getCreators();
            
                        let newCreators = [];
                        for (let creator of creators) {
                            creator.firstName = titleCase(creator.firstName.trim());
                            creator.lastName = titleCase(creator.lastName.trim());
                            creator.fieldMode = creator.fieldMode;
                            newCreators.push(creator);
                            } 
                        item.setCreators(newCreators);
                        await item.save();
                       rn ++;
                }
           

    }
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') {whiteSpace = ''};
    var rnInfo = rn > 1 ? 'item.changed.mul' : 'item.changed.sig';
    var statusInfo = rn > 0 ? 'finished' : 'failed';
    var alertInfo = rn + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(rnInfo);
    Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);
};

// 将单词转为首字母大写
function titleCase(str) {   
     var newStr = str.split(" ");    
     for(var i = 0; i < newStr.length; i++) {
        newStr[i] = newStr[i].slice(0,1).toUpperCase() + newStr[i].slice(1).toLowerCase();
        }      
     return newStr.join(" ");
};
 
// 交换作者姓和名
swapAuthorName = async function() {

   
    var rn = 0; //计数替换条目个数
    //var newFieldMode = 0; // 0: two-field, 1: one-field (with empty first name)
    //await Zotero.DB.executeTransaction(async function () {
    var  items = Zotero.UpdateIFs.getSelectedItems();
    if (items.length == 0) { // 如果没有选中条目则提示，中止
        alertInfo = Zotero.UpdateIFs.ZUIFGetString('zotero.item');
        Zotero.UpdateIFs.showPopUP(alertInfo, 'failed');
        }  else {
            for (item of items) {
                
              
                    let creators = item.getCreators();
                    let newCreators = [];
                    for (let creator of creators) {
                        // if (`${creator.firstName} ${creator.lastName}`.trim() == oldName) {
                            let firstName = creator.firstName;
                            let lastName = creator.lastName;
                        
                            creator.firstName = lastName;
                            creator.lastName = firstName;
                            creator.fieldMode = creator.fieldMode;
                                
                        // }
                        newCreators.push(creator);
    
                    }
                    item.setCreators(newCreators);
                    rn++;
                    await item.save();
    
                }
                
    //}); 
    // return rn + " item(s) updated";
    }
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') {whiteSpace = ''};
    var rnInfo = rn > 1 ? 'item.changed.mul' : 'item.changed.sig';
    var statusInfo = rn > 0 ? 'finished' : 'failed';
    var alertInfo = rn + whiteSpace + Zotero.UpdateIFs.ZUIFGetString(rnInfo);
    Zotero.UpdateIFs.showPopUP(alertInfo, statusInfo);
};
// 右下角弹出函数 
// showPopUP = function (alertInfo, status) {  

//     var progressWindow = new Zotero.ProgressWindow({closeOnClick:true});
//     progressWindow.changeHeadline(Zotero.UpdateIFs.ZUIFGetString(status));
//     progressWindow.addDescription(alertInfo);
//     progressWindow.show();
//     progressWindow.startCloseTimer(4000);
// };



