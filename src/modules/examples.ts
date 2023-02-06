import { config } from "../../package.json";
import { getString } from "./locale";
import { njauCore, njauJournal } from "./njau";

function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

export class BasicExampleFactory {
  @example
  static registerNotifier() {
    const callback = {
      notify: async (
        event: string,
        type: string,
        ids: Array<string>,
        extraData: { [key: string]: any }
      ) => {
        if (!addon?.data.alive) {
          this.unregisterNotifier(notifierID);
          return;
        }
        addon.hooks.onNotify(event, type, ids, extraData);
      },
    };

    // Register the callback in Zotero as an item observer
    const notifierID = Zotero.Notifier.registerObserver(callback, [
      "tab",
      "item",
      "file",
    ]);

    // Unregister callback when the window closes (important to avoid a memory leak)
    window.addEventListener(
      "unload",
      (e: Event) => {
        this.unregisterNotifier(notifierID);
      },
      false
    );
  }

  @example
  static exampleNotifierCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Open Tab Detected!",
        type: "success",
        progress: 100,
      })
      .show();
  }

  @example
  private static unregisterNotifier(notifierID: string) {
    Zotero.Notifier.unregisterObserver(notifierID);
  }

  @example
  static registerPrefs() {
    const prefOptions = {
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs.title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      extraDTD: [`chrome://${config.addonRef}/locale/overlay.dtd`],
      defaultXUL: true,
    };
    ztoolkit.PreferencePane.register(prefOptions);
  }
}

export class KeyExampleFactory {
  //得到所选条目
  @example
  static getSelectedItems() {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    return items;
  }
  //分类右击更新信息
  @example
  static async setExtraCol() {
    var collection = ZoteroPane.getSelectedCollection();
    var items = collection?.getChildItems();
    await KeyExampleFactory.setExtra(items);
  }
  //条目右键更新信息
  @example
  static async setExtraItems() {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    await KeyExampleFactory.setExtra(items);
  }
  @example
  static async setExtra(items: any) {
    var n = 0;
    for (let item of items) {
      if (UIExampleFactory.checkItem(item)) {  //如果是期刊才继续
        var easyscholarData = await KeyExampleFactory.getIFs(item); //得到easyscholar数据
        var chineseIFs = await KeyExampleFactory.getChineseIFs(item); //综合影响因子、复合影响因子
        // 加: any为了后面不报错
        var jcr: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.jcr.qu`, true);
        var basic: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.basic`, true);
        var updated: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.updated`, true);
        var ifs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if`, true);
        var if5: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if5`, true);
        var eii: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ei`, true);
        var chjcscd: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chjcscd`, true);
        var pkucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.pku.core`, true);
        var njucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.nju.core`, true);
        var scicore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.core`, true);
        var compoundIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.com.if`, true);
        var comprehensiveIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.agg.if`, true);
        var njauCoreShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.core`, true);
        var njauJourShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.high.quality`, true);

        if (easyscholarData) { //如果得到easyscholar数据再写入
          // HelperExampleFactory.progressWindow(easyscholarData['sci'], 'success')
          if (jcr && easyscholarData['sci']) {
            ztoolkit.ExtraField.setExtraField(item, 'JCR', easyscholarData['sci']);
          }
          if (updated && easyscholarData['sciUp']) {
            ztoolkit.ExtraField.setExtraField(item, '中科院分区升级版', easyscholarData['sciUp']);
          }
          if (basic && easyscholarData['sciBase']) {
            ztoolkit.ExtraField.setExtraField(item, '中科院分区基础版', easyscholarData['sciBase']);
          }
          if (ifs && easyscholarData['sciif']) {
            ztoolkit.ExtraField.setExtraField(item, 'IF', easyscholarData['sciif']);
          }
          if (if5 && easyscholarData['sciif5']) {
            ztoolkit.ExtraField.setExtraField(item, 'IF5', easyscholarData['sciif5']);
          }
          if (eii && easyscholarData['eii']) {
            ztoolkit.ExtraField.setExtraField(item, 'EI', '是');
          }
          if (chjcscd && easyscholarData['cscd']) {
            ztoolkit.ExtraField.setExtraField(item, 'CSCD', easyscholarData['cscd']);
          }
          if (pkucore && easyscholarData['pku']) {
            ztoolkit.ExtraField.setExtraField(item, '中文核心期刊/北大核心', '是');
          }
          if (njucore && easyscholarData['cssci']) {
            ztoolkit.ExtraField.setExtraField(item, 'CSSCI/南大核心', '是');
          }
          if (scicore && easyscholarData['zhongguokejihexin']) {
            ztoolkit.ExtraField.setExtraField(item, '中国科技核心期刊', '是');
          }
        }
        //复合影响因子、综合影响因子
        if (chineseIFs) { // 如果得到复合影响因子、综合影响因子再写入
          // if (!chineseIFs) { return } // 否则后面会报错
          if (compoundIFs) {
            ztoolkit.ExtraField.setExtraField(item, '复合影响因子', chineseIFs[0]);
          }
          if (comprehensiveIFs) {
            ztoolkit.ExtraField.setExtraField(item, '综合影响因子', chineseIFs[1]);
          }
        }
        // 南农核心期刊分类、高水平期刊
        if (njauCoreShow) {
          ztoolkit.ExtraField.setExtraField(item, '南农核心期', njauCore(item));
        }
        if (njauJourShow) {
          ztoolkit.ExtraField.setExtraField(item, '南农高质量期刊', njauJournal(item));
        }
        item.saveTx();
        n++
      }
    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    HelperExampleFactory.progressWindow(`${n}${whiteSpace}${getString('upIfsSuccess')}`, 'success')
  }

  @example
  // 从easyScholar获取数据
  static async getIFs(item: Zotero.Item) {
    var pt = (item.getField('publicationTitle') as any).toUpperCase();
    var data: any = {}; //data后加: any为了防止报错
    var optionCheckd = ['sci', 'sciif5', 'sciUp', 'sciBase', 'sciif', 'eii',   // 英文期刊：分区、中科院升级版、中科院基础版、IF、EI
      'cssci', 'cscd', 'pku', 'zhongguokejihexin']; // 中文期刊：南大核心、CSCD、北大核心、科技核心：
    data["requirePaperRank"] = optionCheckd;
    data["version"] = "5.6";
    data["website"] = "Zotero";
    data["papersName"] =
    {
      //     349: "NATURE",
      //     1807: "FOODS",
      2190: pt
    };  // key为自己生成，value为刊物名称（需要大写）

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
      return updateJson["papersRank"][0];
    } catch (e) {
      Zotero.debug('从easyScholar获取数据失败!')

    }
  };


  @example
  // 设置复合影响因子及综合影响因子20220709
  // 代码源于@l0o0，感谢。
  static async getChineseIFs(item: Zotero.Item) {
    var chineseIFs = [];
    var pubT = item.getField('publicationTitle');
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    if (pattern.test(String(pubT))) { // 如果期刊名中含有中文才进行替换
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
        var compoundIF = jour[2];
        var comprehensiveIF = jour[4];
        if (compoundIF !== undefined) { chineseIFs.push(compoundIF); }
        if (comprehensiveIF !== undefined) { chineseIFs.push(comprehensiveIF); }
        return chineseIFs;

      } catch (e) {
        Zotero.debug('复合影响因子、综合影响因子获取失败！');
        return;
      }
    }
  };

  //分类右击更新信息
  @example
  static async upMetaCol() {
    var collection = ZoteroPane.getSelectedCollection();
    var items = collection?.getChildItems();
    await KeyExampleFactory.upMeta(items);
  }
  //条目右键更新信息
  @example
  static async upMetaItems() {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    await KeyExampleFactory.upMeta(items);
  }

  @example
  //更新元数据执行函数
  // 代码来源于Quick动作
  //https://getquicker.net/Sharedaction?code=78da8f40-e73a-46e8-da6b-08da76a0d1ac和
  // https://getquicker.net/Sharedaction?code=305c5f6e-4f15-445c-996a-08dace1ee4e7
  //感谢@ttChen老师的源代码
  static async upMeta(items: any) {
    // var items = KeyExampleFactory.getSelectedItems();
    // var item = items[0];
    var n = 0;
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    for (let item of items) {
      if (UIExampleFactory.checkItem(item)) {//如果期刊才继续
        var title: any = item.getField("title");
        var doi = item.getField("DOI");
        var lan = pattern.test(title) ? 'zh-CN' : 'en-US';
        if (lan == 'zh-CN') { //中文条目
          async function getCNKIDetailURLByTitle(title: any) {
            var queryJson = {
              "Platform": "",
              "DBCode": "CFLS",
              "KuaKuCode": "CJFQ,CCND,CIPD,CDMD,BDZK,CISD,SNAD,CCJD,GXDB_SECTION,CJFN,CCVD",
              "QNode": {
                "QGroup": [{
                  "Key": "Subject",
                  "Title": "",
                  "Logic": 1,
                  "Items": [{ "Title": "篇名", "Name": "TI", "Value": title, "Operate": "%=", "BlurType": "" }],
                  "ChildItems": []
                }]
              }
            };

            var PostDATA =
              "IsSearch=true&QueryJson=" +
              encodeURIComponent(JSON.stringify(queryJson)) +
              `&PageName=defaultresult&DBCode=CFLS&KuaKuCodes=CJFQ%2CCCND%2CCIPD%2CCDMD%2CBDZK%2CCISD%2CSNAD%2CCCJD%2CGXDB_SECTION%2CCJFN%2CCCVD` +
              `&CurPage=1&RecordsCntPerPage=20&CurDisplayMode=listmode&CurrSortField=RELEVANT&CurrSortFieldType=desc&IsSentenceSearch=false&Subject=`;


            function getCookieSandbox() {
              var cookieData =
                `Ecp_ClientId=3210724131801671689;
            cnkiUserKey=2bf7144a-ddf6-3d32-afb8-d4bf82473d9f;
            RsPerPage=20;
            Ecp_ClientIp=58.154.105.222;
            Ecp_Userid=5002973;
            Hm_lvt_38f33a73da35494cc56a660420d5b6be=1657977228,1658755426,1659774372,1659793220;
            UM_distinctid=183d49fcff858b-0941bfea87e982-76492e2f-384000-183d49fcff9119c;
            knsLeftGroupSelectItem=1%3B2%3B; dsorder=relevant;
            _pk_ref=%5B%22%22%2C%22%22%2C1669645320%2C%22https%3A%2F%2Feasyscholar.cc%2F%22%5D;
            _pk_id=c26caf7b-3374-4899-9370-488df5c09825.1661393760.22.1669645320.1669645320.;
            Ecp_loginuserbk=db0172; Ecp_IpLoginFail=22113066.94.113.19;
            ASP.NET_SessionId=5mzsjs1nrl1tf0b5ec450grz; SID_kns8=123152;
            CurrSortField=%e7%9b%b8%e5%85%b3%e5%ba%a6%2frelevant%2c(%e5%8f%91%e8%a1%a8%e6%97%b6%e9%97%b4%2c%27time%27);
            CurrSortFieldType=DESC; dblang=ch`;

              var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56";
              var url = "https://cnki.net/";
              return new Zotero.CookieSandbox("", url, cookieData, userAgent);
            };


            var requestHeaders = {
              Accept: "text/html, */*; q=0.01",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              Connection: "keep-alive",
              "Content-Length": "992",
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              Host: "kns.cnki.net",
              Origin: "https://kns.cnki.net",
              Referer: `https://kns.cnki.net/kns8/defaultresult/index?kw=${encodeURIComponent(title)}&korder=TI`,
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-ch-ua": `"Microsoft Edge"; v = "107", "Chromium"; v = "107", "Not=A?Brand"; v = "24"`,
              "Sec-Fetch-Site": "same-origin",
              "X-Requested-With": "XMLHttpRequest"
            };

            var postUrl = "https://kns.cnki.net/kns8/Brief/GetGridTableHtml";

            function getHtml(responseText: any) {
              var parser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                .createInstance(Components.interfaces.nsIDOMParser);
              var html = parser.parseFromString(responseText, "text/html");
              return html;
            };
            var resp = await Zotero.HTTP.request("POST", postUrl, {
              headers: requestHeaders,
              cookieSandbox: getCookieSandbox(),
              body: PostDATA
            });
            return getHtml(resp.responseText);
          }
          function updateField(field: any, newItem: Zotero.Item, oldItem: Zotero.Item) {
            if (newItem.getField(field)) {
              oldItem.setField(field, newItem.getField(field))
            }
          }
          function updateINFO(newItem: any, oldItemID: any) {
            newItem.saveTx();
            let oldItem = Zotero.Items.get(oldItemID)
            oldItem.setCreators(newItem.getCreators());
            // 可根据下述网址增减需要更新的Field.
            // https://www.zotero.org/support/dev/client_coding/javascript_api/search_fields
            let fields = ["title", "publicationTitle", "journalAbbreviation", "volume", "issue", "date", "pages", "ISSN", "url", "abstractNote", "DOI", "type", "publisher"]
            for (let field of fields) {
              updateField(field, newItem, oldItem);
            }
            newItem.deleted = true;
            newItem.saveTx();
            oldItem.saveTx();
            Zotero.debug("succeeded!");
          }
          //中文条目更新函数
          var selectedItem = item;
          var ItemID = selectedItem.id;
          var title: any = selectedItem.getField("title");
          var publicationTitle = selectedItem.getField("publicationTitle");
          var html;
          var url;
          try {
            html = await getCNKIDetailURLByTitle(title);
            if (publicationTitle != "") {
              url = (Zotero.Utilities as any).xpath(html, `//td[normalize-space(string(.))="${publicationTitle}"]/preceding-sibling::td[@class="name" and normalize-space(string(.))="${title}"]/a`)[0].href;
            } else {
              url = (Zotero.Utilities as any).xpath(html, `//td[@class="name" and normalize-space(string(.))="${title}"]/a`)[0].href;
            }

            url = url.replace("/kns8/Detail", "https://kns.cnki.net/kcms/detail/detail.aspx");
          } catch (error) {
            var popw = new Zotero.ProgressWindow();
            popw.changeHeadline("未找到文献, 或者遇到了网络问题！", "", "");
            popw.addDescription(`文献：${title}`);
            popw.show();
            popw.startCloseTimer(5 * 1000);

            return;
            return;
          }
          Zotero.HTTP.loadDocuments(url,
            async function (doc: any) {
              let translate = new Zotero.Translate.Web();
              translate.setDocument(doc);
              translate.setTranslator("5c95b67b-41c5-4f55-b71a-48d5d7183063");
              let items = await translate.translate();
              updateINFO(items[0], ItemID)
            }
          );

        } else if (lan == 'en-US') {//英文条目
          if (doi != '') {
            let identifier =
            {
              itemType: "journalArticle",
              DOI: item.getField('DOI')
            };
            var translate = new Zotero.Translate.Search();
            translate.setIdentifier(identifier);
            let translators = await translate.getTranslators();
            translate.setTranslator(translators);
            let newItems = await translate.translate();
            let newItem = newItems[0];

            function update(field: any) {
              if (newItem.getField(field)) {
                item.setField(field, newItem.getField(field))
              }
            }
            item.setCreators(newItem.getCreators());

            // 可根据下述网址增减需要更新的Field.
            // https://www.zotero.org/support/dev/client_coding/javascript_api/search_fields

            let fields = ["title", "publicationTitle", "journalAbbreviation", "volume",
              "issue", "date", "pages", "issue", "ISSN", "url", "abstractNote"
            ]

            for (let field of fields) {
              update(field);
            }

            newItem.deleted = true;
            await item.saveTx();
            newItem.saveTx();
          }
        }
        n++
      }
    }
    var whiteSpace = HelperExampleFactory.whiteSpace();
    HelperExampleFactory.progressWindow(`${n}${whiteSpace}${getString('upIfsSuccess')}`, 'success')
  }
  @example
  static registerShortcuts() {
    const keysetId = `${config.addonRef}-keyset`;
    const cmdsetId = `${config.addonRef}-cmdset`;
    const cmdSmallerId = `${config.addonRef}-cmd-smaller`;
    // Register an event key for Alt+L
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-larger`,
      // key: "L",
      key: "D",
      modifiers: "alt",
      callback: (keyOptions) => {
        // addon.hooks.onShortcuts("larger");
        HelperExampleFactory.progressWindow(Zotero.DataDirectory.dir, 'default')
      },
    });
    // Register an element key using <key> for Alt+S
    ztoolkit.Shortcut.register("element", {
      id: `${config.addonRef}-key-smaller`,
      key: "S",
      modifiers: "alt",
      xulData: {
        document,
        command: cmdSmallerId,
        _parentId: keysetId,
        _commandOptions: {
          id: cmdSmallerId,
          document,
          _parentId: cmdsetId,
          oncommand: `'Zotero.${config.addonInstance}.hooks.onShortcuts('smaller')'`,
        },
      },
    });
    // Here we register an conflict key for Alt+S
    // just to show how the confliction check works.
    // This is something you should avoid in your plugin.
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-smaller-conflict`,
      key: "S",
      modifiers: "alt",
      callback: (keyOptions) => {
        ztoolkit.getGlobal("alert")("Smaller! This is a conflict key.");
      },
    });
    // Register an event key to check confliction
    ztoolkit.Shortcut.register("event", {
      id: `${config.addonRef}-key-check-conflict`,
      key: "C",
      modifiers: "alt",
      callback: (keyOptions) => {
        addon.hooks.onShortcuts("confliction");
      },
    });
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Example Shortcuts: Alt+L/S/C",
        type: "success",
      })
      .show();
  }

  @example
  static exampleShortcutLargerCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Larger!",
        type: "default",
      })
      .show();
  }

  @example
  static exampleShortcutSmallerCallback() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "Smaller!",
        type: "default",
      })
      .show();
  }

  @example
  static exampleShortcutConflictionCallback() {
    const conflictionGroups = ztoolkit.Shortcut.checkAllKeyConfliction();
    new ztoolkit.ProgressWindow("Check Key Confliction")
      .createLine({
        text: `${conflictionGroups.length} groups of confliction keys found. Details are in the debug output/console.`,
      })
      .show(-1);
    ztoolkit.log(
      "Conflictions:",
      conflictionGroups,
      "All keys:",
      ztoolkit.Shortcut.getAll()
    );
  }
}

export class UIExampleFactory {

  // 是否显示菜单函数 类型为期刊才显示可用
  // 是否显示分类右键菜单 隐藏
  static displayColMenuitem() {
    const collection = ZoteroPane.getSelectedCollection(),
      menuUpIFsCol = document.getElementById(`zotero-collectionmenu-${config.addonRef}-upifs`), // 删除分类及附件菜单
      menuUpMeta = document.getElementById(`zotero-collectionmenu-${config.addonRef}-upmeta`); // 导出分类附件菜单

    // 非正常文件夹，如我的出版物、重复条目、未分类条目、回收站，为false，此时返回值为true，禁用菜单
    // 两个！！转表达式为逻辑值
    var showmenuUpIFsCol = !!collection;
    var showmenuUpMetaCol = !!collection;

    if (!!collection) { // 如果是正常分类才显示
      var items = collection.getChildItems();
      showmenuUpIFsCol = items.some((item) => UIExampleFactory.checkItem(item)); //检查是否为期刊
      showmenuUpMetaCol = items.some((item) => UIExampleFactory.checkItemMeta(item)); // 更新元数据 中文有题目，英文检查是否有DOI
    } else {
      showmenuUpIFsCol = false;
    } // 检查分类是否有附件及是否为正常分类
    menuUpIFsCol?.setAttribute('disabled', String(!showmenuUpIFsCol)); // 禁用更新期刊信息
    menuUpMeta?.setAttribute('disabled', String(!showmenuUpMetaCol)); // 禁用更新元数据
  }

  // 禁用菜单
  // static disableMenu() {
  //   // 禁用添加条目更新期刊信息
  //   var menuUpAdd = document.getElementById('zotero-prefpane-greenfrog-add-update');
  //   menuUpAdd?.setAttribute('disabled', 'ture');
  //   menuUpAdd?.setAttribute('hidden', 'ture');
  // }
  // 是否显示条目右键菜单
  static displayContexMenuitem() {
    const items = ZoteroPane.getSelectedItems(),
      menuUpIfs = document.getElementById(`zotero-itemmenu-${config.addonRef}-upifs`), // 更新期刊信息
      menuUpMeta = document.getElementById(`zotero-itemmenu-${config.addonRef}-upmeta`), // 更新元数据

      showMenuUpIfs = items.some((item) => UIExampleFactory.checkItem(item)),// 更新期刊信息 检查是否为期刊
      showMenuUpMeta = items.some((item) => UIExampleFactory.checkItemMeta(item)); // 更新元数据 检查是否有DOI

    menuUpIfs?.setAttribute('disabled', `${!showMenuUpIfs}`); // 禁用更新期刊信息
    menuUpMeta?.setAttribute('disabled', `${!showMenuUpMeta}`); // 更新元数据
  }



  // 检查条目是否符合 是否为期刊
  static checkItem(item: Zotero.Item) {
    if (item && !item.isNote()) {
      if (item.isRegularItem()) { // not an attachment already
        if (Zotero.ItemTypes.getName(item.itemTypeID) == 'journalArticle' // 文献类型为期刊
        ) { return true }
      }
    }
  };

  // 检查条目元数据是否符合 英文必须有DOI
  static checkItemMeta(item: Zotero.Item) {
    var pattern = new RegExp("[\u4E00-\u9FA5]+");
    if (item && !item.isNote()) {
      if (item.isRegularItem()) { // not an attachment already
        var title: any = item.getField("title");
        var doi = item.getField("DOI");
        var lan = pattern.test(title) ? 'zh-CN' : 'en-US';
        if (Zotero.ItemTypes.getName(item.itemTypeID) == 'journalArticle' // 文献类型必须为期刊
        ) {
          if (lan == 'zh-CN') { //中文条目
            return title == '' ? false : true; // 题目为空时不能更新中文
          } else if (lan == 'en-US') {//英文条目
            return doi == '' ? false : true; // 英文DOI为空时不能更新英文
          }
        }
      }
    }
  };
  @example
  static registerStyleSheet() {
    const styles = ztoolkit.UI.createElement(document, "link", {
      properties: {
        type: "text/css",
        rel: "stylesheet",
        href: `chrome://${config.addonRef}/content/zoteroPane.css`,
      },
    });
    document.documentElement.appendChild(styles);
    document
      .getElementById("zotero-item-pane-content")
      ?.classList.add("makeItRed");
  }

  // 右键菜单
  @example
  static registerRightClickMenuItem() {
    const menuIconUpIFs = `chrome://${config.addonRef}/content/icons/favicon@0.5x.png`;
    const menuIconUpMeta = `chrome://${config.addonRef}/content/icons/upmeta.png`;
    // ztoolkit.Menu.register("item", {
    //   tag: "menuseparator",
    // });
    // item menuitem with icon
    // ztoolkit.Menu.register("item", {
    //   tag: "menuitem",
    //   id: "zotero-itemmenu-addontemplate-test",
    //   label: getString("menuitem.label"),
    //   commandListener: (ev) => addon.hooks.onDialogEvents("dialogExample"),
    //   icon: menuIcon,
    // });
    ztoolkit.Menu.register("item", {
      tag: "menuseparator",
    });

    // 分类右键
    ztoolkit.Menu.register("collection", {
      tag: "menuseparator",
    });
    // 分类更新条目信息
    ztoolkit.Menu.register("collection", {
      tag: "menuitem",
      id: `zotero-collectionmenu-${config.addonRef}-upifs`,
      label: getString("upifs"),
      commandListener: (ev) => KeyExampleFactory.setExtraCol(),
      icon: menuIconUpIFs,
    });
    // 分类更新元数据
    ztoolkit.Menu.register("collection", {
      tag: "menuitem",
      id: `zotero-collectionmenu-${config.addonRef}-upmeta`,
      label: getString("upmeta"),
      commandListener: (ev) => KeyExampleFactory.upMetaCol(),
      icon: menuIconUpMeta,
    });
    // 更新条目信息
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: `zotero-itemmenu-${config.addonRef}-upifs`,
      label: getString("upifs"),
      commandListener: (ev) => KeyExampleFactory.setExtraItems(),
      icon: menuIconUpIFs,
    });
    // 条目更新元数据
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: `zotero-itemmenu-${config.addonRef}-upmeta`,
      label: getString("upmeta"),
      commandListener: (ev) => KeyExampleFactory.upMetaItems(),
      icon: menuIconUpMeta,
    });
  }
  // @example
  // static registerRightClickMenuPopup() {
  //   ztoolkit.Menu.register(
  //     "item",
  //     {
  //       tag: "menu",
  //       label: getString("menupopup.label"),
  //       children: [
  //         {
  //           tag: "menuitem",
  //           label: getString("menuitem.submenulabel"),
  //           oncommand: "alert('Hello World! Sub Menuitem.')",
  //         },
  //       ],
  //     },
  //     "before",
  //     document.querySelector(
  //       "#zotero-itemmenu-addontemplate-test"
  //     ) as XUL.MenuItem
  //   );
  // }

  @example //Tools菜单
  static registerWindowMenuWithSeprator() {
    ztoolkit.Menu.register("menuTools", {
      tag: "menuseparator",
    });
    // menu->Tools menuitem
    // ztoolkit.Menu.register("menuTools", {
    //   tag: "menu",
    //   label: getString("menuitem.filemenulabel"),

    // onpopupshowing:  `Zotero.${config.addonInstance}.hooks.hideMenu()`,// 显示隐藏菜单
    // children: [
    //   {
    //     tag: "menuitem",
    //     label: getString("menuitem.submenulabel"),
    //     // oncommand: "alert('Hello World! Sub Menuitem.')",
    //     commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
    //   },

    // ],
    //oncommand: "alert('Hello World! File Menuitem.')",
    ztoolkit.Menu.register("menuTools", {
      tag: "menu",
      label: getString("toolbox"),
      onpopupshowing: `Zotero.${config.addonInstance}.hooks.hideMenu()`,// 显示隐藏菜单

      children: [
        // Author Bold and/ or Asterisk
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-auBoldStar",
          label: getString("auBoldStar"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Clean Author Bold
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-cleanBold",
          label: getString("cleanBold"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Clean Author Asterisk
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-cleanStar",
          label: getString("cleanStar"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Clean Author Bold and Asterisk
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-cleanBoldStar",
          label: getString("cleanBoldStar"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Change Author Name to Title Case
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chAuTitle",
          label: getString("chAuTitle"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Swap Authors First and Last Name
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-swapAuName",
          label: getString("swapAuName"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        {
          tag: "menuseparator",
          id: "zotero-toolboxmenu-sep1"
        },
        // Change Title to Sentense Case
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chTitleCase",
          label: getString("chTitleCase"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Change Publication Title
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chPubTitle",
          label: getString("chPubTitle"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Change Publication Title Case
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-chPubTitleCase",
          label: getString("chPubTitleCase"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.dialogAuBoldStar(),
        },
        // Item Title Find and Replace
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-itemTitleFindReplace",
          label: getString("itemTitleFindReplace"),
          // oncommand: "alert(KeyExampleFactory.getSelectedItems())",
          // oncommand: `ztoolkit.getGlobal('alert')(${KeyExampleFactory.getSelectedItems()})`,
          // commandListener: (ev) => KeyExampleFactory.setExtra(),
        },
        {
          tag: "menuseparator",
          id: "zotero-toolboxmenu-sep2"
        },
        // Show Porfile Directory
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-showProfile",
          label: getString("showProfile"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.progressWindow(Zotero.Profile.dir, 'default'),
        },
        // Show Data Directory
        {
          tag: "menuitem",
          id: "zotero-toolboxmenu-showData",
          label: getString("showData"),
          // oncommand: "alert('Hello World! Sub Menuitem.')",
          commandListener: (ev) => HelperExampleFactory.progressWindow(Zotero.DataDirectory.dir, 'default'),
        },
        //刷新自定义列
        // {
        //   tag: "menuitem",
        //   id: "zotero-toolboxmenu-refresh",
        //   label: 'Refresh',
        //   commandListener: (ev) => Zotero.greenfrog.hooks.setExtraColumn(),
        // },
      ],
    });
  }

  // 显示隐藏工具箱中的菜单
  @example
  static hideMenu() {
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


  }
  // @example
  //添加工具栏按钮
  // static refreshButton() {
  //   document.getElementById('zotero-collections-toolbar')?.appendChild( // 添加工具栏按钮
  //     ztoolkit.UI.createElement(document, 'toolbarbutton', {
  //       id: 'refresh-toolbar-button',
  //       classList: ['zotero-tb-button'],
  //       attributes: { tooltiptext: 'refrsh item tree' },
  //       styles: {
  //         'list-style-image': 'url("chrome://greenfrog/content/icons/favicon@0.5x.png");',
  //       },
  //       listeners: [{ type: 'command', listener: Zotero.greenfrog.hooks.setExtraColumn }]
  //     })
  //   );
  // var _window: Window = Zotero.getMainWindow();
  // var tool_button = _window.document.createElement("toolbarbutton");
  // tool_button.id = "zotero-tb-tara";
  // tool_button.setAttribute("type", "button");
  // tool_button.className = "zotero-tb-button";
  // tool_button.style["list-style-image"] =
  //   "url('chrome://greenfrog/content/icons/favicon@0.5x.png')";

  // document
  //   .querySelector("#zotero-collections-toolbar")
  //   .appendChild(tool_button);
  // }

  @example
  static async registerExtraColumn() {
    var jcr: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.jcr.qu`, true);
    var basic: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.basic`, true);
    var updated: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.updated`, true);
    var ifs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if`, true);
    var if5: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.if5`, true);
    var eii: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.ei`, true);
    var chjcscd: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.chjcscd`, true);
    var pkucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.pku.core`, true);
    var njucore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.nju.core`, true);
    var scicore: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.sci.core`, true);
    var compoundIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.com.if`, true);
    var comprehensiveIFs: any = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.agg.if`, true);
    var njauCoreShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.core`, true);
    var njauJourShow = Zotero.Prefs.get(`extensions.zotero.${config.addonRef}.njau.high.quality`, true);

    if (jcr) {
      // JCR
      await ztoolkit.ItemTree.register(
        "JCR",
        "JCR",
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var jcr = ztoolkit.ExtraField.getExtraField(item, 'JCR分区')
          return String(jcr == undefined ? '' : jcr);
        },
      );
    } else {

      await ztoolkit.ItemTree.unregister("JCR");
    }
    if (updated) {
      // 中科院分区升级版
      await ztoolkit.ItemTree.register(
        "CASUp",
        getString("CASUp"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CASUp = ztoolkit.ExtraField.getExtraField(item, '中科院分区升级版')
          return String(CASUp == undefined ? '' : CASUp);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CASUp");
    }
    if (basic) {
      // 中科院分区基础版
      await ztoolkit.ItemTree.register(
        "CASBasic",
        getString("CASBasic"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CASBasic = ztoolkit.ExtraField.getExtraField(item, '中科院分区基础版')
          return String(CASBasic == undefined ? '' : CASBasic);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CASBasic");
    }
    if (ifs) {
      // 影响因子
      await ztoolkit.ItemTree.register(
        "IF",
        "IF",
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var ifs = ztoolkit.ExtraField.getExtraField(item, '影响因子')
          return String(ifs == undefined ? '' : ifs);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("IF");
    }
    if (if5) {
      // 5年影响因子
      await ztoolkit.ItemTree.register(
        "IF5",
        "IF5",
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var IF5 = ztoolkit.ExtraField.getExtraField(item, '5年影响因子')
          return String(IF5 == undefined ? '' : IF5);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("IF5");
    }
    if (eii) {
      // EI
      await ztoolkit.ItemTree.register(
        "EI",
        "EI",
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var EI = ztoolkit.ExtraField.getExtraField(item, 'EI')
          return String(EI == undefined ? '' : EI);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("EI");
    }
    if (chjcscd) {
      // CSCD
      await ztoolkit.ItemTree.register(
        "CSCD",
        getString("CSCD"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var CSCD = ztoolkit.ExtraField.getExtraField(item, 'CSCD')
          return String(CSCD == undefined ? '' : CSCD);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CSCD");
    }
    if (pkucore) {

      // PKUCore
      await ztoolkit.ItemTree.register(
        "PKUCore",
        getString("PKUCore"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var PKUCore = ztoolkit.ExtraField.getExtraField(item, '中文核心期刊/北大核心')
          return String(PKUCore == undefined ? '' : PKUCore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("PKUCore");
    }
    if (njucore) {
      // CSSCI/南大核心
      await ztoolkit.ItemTree.register(
        "CSSCI",
        getString("CSSCI"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var NJUCore = ztoolkit.ExtraField.getExtraField(item, 'CSSCI/南大核心')
          return String(NJUCore == undefined ? '' : NJUCore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("CSSCI");
    }
    if (scicore) {
      // 科技核心
      await ztoolkit.ItemTree.register(
        "SCICore",
        getString("SCICore"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var SCICore = ztoolkit.ExtraField.getExtraField(item, '中国科技核心期刊')
          return String(SCICore == undefined ? '' : SCICore);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("SCICore");
    }
    if (compoundIFs) {
      // 复合影响因子
      await ztoolkit.ItemTree.register(
        "compoundIF",
        getString("compoundIF"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var compoundIF = ztoolkit.ExtraField.getExtraField(item, '复合影响因子')
          return String(compoundIF == undefined ? '' : compoundIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("compoundIF");
    }
    if (comprehensiveIFs) {
      // 综合影响因子
      await ztoolkit.ItemTree.register(
        "comprehensiveIF",
        getString("comprehensiveIF"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var comprehensiveIF = ztoolkit.ExtraField.getExtraField(item, '综合影响因子')
          return String(comprehensiveIF == undefined ? '' : comprehensiveIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("comprehensiveIF");
    }
    if (njauCoreShow) {
      // 南农核心期刊
      await ztoolkit.ItemTree.register(
        "njauCore",
        getString("njauCore"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var comprehensiveIF = ztoolkit.ExtraField.getExtraField(item, '综合影响因子')
          return String(comprehensiveIF == undefined ? '' : comprehensiveIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("njauCore");
    }
    if (njauJourShow) {
      // 南农高质量期刊
      await ztoolkit.ItemTree.register(
        "njauJour",
        getString("njauJour"),
        (
          field: string,
          unformatted: boolean,
          includeBaseMapped: boolean,
          item: Zotero.Item
        ) => {
          // return String(item.id);
          var comprehensiveIF = ztoolkit.ExtraField.getExtraField(item, '综合影响因子')
          return String(comprehensiveIF == undefined ? '' : comprehensiveIF);
        },
      );
    } else {
      await ztoolkit.ItemTree.unregister("njauJour");
    }
  }

  // @example
  // static async registerExtraColumnWithCustomCell() {
  //   await ztoolkit.ItemTree.register(
  //     // "test2",
  //     // "custom column",
  //     "JCR",
  //     "JCR",
  //     (
  //       field: string,
  //       unformatted: boolean,
  //       includeBaseMapped: boolean,
  //       item: Zotero.Item
  //     ) => {
  //       // return String(item.id);
  //       var jcr = ztoolkit.ExtraField.getExtraField(item, 'JCR分区')
  //       return String(jcr == undefined ? '' : jcr);
  //     },
  //     // {
  //     //   renderCellHook(index, data, column) {
  //     //     const span = document.createElementNS(
  //     //       "http://www.w3.org/1999/xhtml",
  //     //       "span"
  //     //     );
  //     //     span.style.background = "#0dd068";
  //     //     span.innerText = "⭐" + data;
  //     //     return span;
  //     //   },
  //     // }
  //   );
  // }

  @example
  static async registerCustomCellRenderer() {
    await ztoolkit.ItemTree.addRenderCellHook(
      "title",
      (index: number, data: string, column: any, original: Function) => {
        const span = original(index, data, column) as HTMLSpanElement;
        span.style.background = "rgb(30, 30, 30)";
        span.style.color = "rgb(156, 220, 240)";
        return span;
      }
    );
    // @ts-ignore
    // This is a private method. Make it public in toolkit.
    await ztoolkit.ItemTree.refresh();
  }

  @example
  static registerLibraryTabPanel() {
    const tabId = ztoolkit.LibraryTabPanel.register(
      getString("tabpanel.lib.tab.label"),
      (panel: XUL.Element, win: Window) => {
        const elem = ztoolkit.UI.createElement(win.document, "vbox", {
          children: [
            {
              tag: "h2",
              properties: {
                innerText: "Hello World!",
              },
            },
            {
              tag: "div",
              properties: {
                innerText: "This is a library tab.",
              },
            },
            {
              tag: "button",
              namespace: "html",
              properties: {
                innerText: "Unregister",
              },
              listeners: [
                {
                  type: "click",
                  listener: () => {
                    ztoolkit.LibraryTabPanel.unregister(tabId);
                  },
                },
              ],
            },
          ],
        });
        panel.append(elem);
      },
      {
        targetIndex: 1,
      }
    );
  }

  @example
  static async registerReaderTabPanel() {
    const tabId = await ztoolkit.ReaderTabPanel.register(
      getString("tabpanel.reader.tab.label"),
      (
        panel: XUL.TabPanel | undefined,
        deck: XUL.Deck,
        win: Window,
        reader: _ZoteroTypes.ReaderInstance
      ) => {
        if (!panel) {
          ztoolkit.log(
            "This reader do not have right-side bar. Adding reader tab skipped."
          );
          return;
        }
        ztoolkit.log(reader);
        const elem = ztoolkit.UI.createElement(win.document, "vbox", {
          id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`,
          // This is important! Don't create content for multiple times
          // ignoreIfExists: true,
          removeIfExists: true,
          children: [
            {
              tag: "h2",
              properties: {
                innerText: "Hello World!",
              },
            },
            {
              tag: "div",
              properties: {
                innerText: "This is a reader tab.",
              },
            },
            {
              tag: "div",
              properties: {
                innerText: `Reader: ${reader._title.slice(0, 20)}`,
              },
            },
            {
              tag: "div",
              properties: {
                innerText: `itemID: ${reader.itemID}.`,
              },
            },
            {
              tag: "button",
              namespace: "html",
              properties: {
                innerText: "Unregister",
              },
              listeners: [
                {
                  type: "click",
                  listener: () => {
                    ztoolkit.ReaderTabPanel.unregister(tabId);
                  },
                },
              ],
            },
          ],
        });
        panel.append(elem);
      },
      {
        targetIndex: 1,
      }
    );
  }
}

export class PromptExampleFactory {
  @example
  static registerAlertPromptExample() {
    ztoolkit.Prompt.register([
      {
        name: "Template Test",
        label: "Plugin Template",
        callback(prompt) {
          ztoolkit.getGlobal("alert")("Command triggered!");
        },
      },
    ]);
  }
}

export class HelperExampleFactory {

  // 生成空格，如果是中文是无空格，英文为空格
  static whiteSpace() {
    var lanUI = Zotero.Prefs.get('intl.locale.requested', true); // 得到当前Zotero界面语言
    var whiteSpace = ' ';
    if (lanUI == 'zh-CN') { whiteSpace = '' };
    return whiteSpace;
  };

  @example
  static async dialogExample() {
    const dialogData: { [key: string | number]: any } = {
      inputValue: "test",
      checkboxValue: true,
      loadCallback: () => {
        ztoolkit.log(dialogData, "Dialog Opened!");
      },
      unloadCallback: () => {
        ztoolkit.log(dialogData, "Dialog closed!");
      },
    };
    const dialogHelper = new ztoolkit.Dialog(10, 2)
      .addCell(0, 0, {
        tag: "h1",
        properties: { innerHTML: "Helper Examples" },
      })
      .addCell(1, 0, {
        tag: "h2",
        properties: { innerHTML: "Dialog Data Binding" },
      })
      .addCell(2, 0, {
        tag: "p",
        properties: {
          innerHTML:
            "Elements with attribute 'data-bind' are binded to the prop under 'dialogData' with the same name.",
        },
        styles: {
          width: "200px",
        },
      })
      .addCell(3, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox",
        },
        properties: { innerHTML: "bind:checkbox" },
      })
      .addCell(
        3,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-checkbox",
          attributes: {
            "data-bind": "checkboxValue",
            "data-prop": "checked",
            type: "checkbox",
          },
          properties: { label: "Cell 1,0" },
        },
        false
      )
      .addCell(4, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-input",
        },
        properties: { innerHTML: "bind:input" },
      })
      .addCell(
        4,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-input",
          attributes: {
            "data-bind": "inputValue",
            "data-prop": "value",
            type: "text",
          },
        },
        false
      )
      .addCell(5, 0, {
        tag: "h2",
        properties: { innerHTML: "Toolkit Helper Examples" },
      })
      .addCell(
        6,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("clipboardExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:clipboard",
              },
            },
          ],
        },
        false
      )
      .addCell(
        7,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("filePickerExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:filepicker",
              },
            },
          ],
        },
        false
      )
      .addCell(
        8,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("progressWindowExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:progressWindow",
              },
            },
          ],
        },
        false
      )
      .addCell(
        9,
        0,
        {
          tag: "button",
          namespace: "html",
          attributes: {
            type: "button",
          },
          listeners: [
            {
              type: "click",
              listener: (e: Event) => {
                addon.hooks.onDialogEvents("vtableExample");
              },
            },
          ],
          children: [
            {
              tag: "div",
              styles: {
                padding: "2.5px 15px",
              },
              properties: {
                innerHTML: "example:virtualized-table",
              },
            },
          ],
        },
        false
      )
      .addButton("Confirm", "confirm")
      .addButton("Cancel", "cancel")
      .addButton("Help", "help", {
        noClose: true,
        callback: (e) => {
          dialogHelper.window?.alert(
            "Help Clicked! Dialog will not be closed."
          );
        },
      })
      .setDialogData(dialogData)
      .open("Dialog Example");
    await dialogData.unloadLock.promise;
    ztoolkit.getGlobal("alert")(
      `Close dialog with ${dialogData._lastButtonId}.\nCheckbox: ${dialogData.checkboxValue}\nInput: ${dialogData.inputValue}.`
    );
    ztoolkit.log(dialogData);
  }

  @example
  // static async dialogExample() {
  static async dialogAuBoldStar() {
    const dialogData: { [key: string | number]: any } = {
      inputValue: "test",
      checkboxValue: true,
      // loadCallback: () => {
      //   ztoolkit.log(dialogData, "Dialog Opened!");
      // },
      // unloadCallback: () => {
      //   ztoolkit.log(dialogData, "Dialog closed!");
      // },
    };
    const dialog = new ztoolkit.Dialog(5, 2)
      .addCell(0, 0, {
        tag: "h1",
        properties: { innerHTML: "Helper Examples" },
      })
      .addCell(1, 0, {
        tag: "h2",
        properties: { innerHTML: "Dialog Data Binding" },
      })
      .addCell(2, 0, {
        tag: "p",
        properties: {
          innerHTML:
            "Elements with attribute 'data-bind' are binded to the prop under 'dialogData' with the same name.",
        },
        styles: {
          width: "200px",
        },
      })
      .addCell(3, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-checkbox",
        },
        properties: { innerHTML: "bind:checkbox" },
      })
      .addCell(
        3,
        1,
        {
          tag: "input",
          namespace: "html",
          id: "dialog-checkbox",
          attributes: {
            "data-bind": "checkboxValue",
            "data-prop": "checked",
            type: "checkbox",
          },
          properties: { label: "Cell 1,0" },
        },
        false
      )
      .addCell(4, 0, {
        tag: "label",
        namespace: "html",
        attributes: {
          for: "dialog-input",
        },
        properties: { innerHTML: "bind:input" },
      })
      .addCell(4, 1,
        {
          tag: "input",
          id: "dialog-input4",
          // attributes: {
          //   "data-bind": "inputValue",
          //   "data-prop": "value",
          //   type: "text",
          // },
        },
        false
      )
      .addButton("Replace", "replace", {
        noClose: true,
        callback: (e) => {
          var text = (dialog.window.document.getElementById('dialog-input4') as HTMLInputElement).value;
          new ztoolkit.ProgressWindow(config.addonName)
            .createLine({
              text: text,
              type: "success",
              progress: 100,
            })
            .show();

          // ztoolkit.getGlobal("alert")(
          //   text
          // );
        },
      })
      .addButton("Close", "confirm", {
        noClose: false,
        callback: (e) => {
          ztoolkit.getGlobal("alert")(
            `Close dialog with ${dialogData._lastButtonId}.\nCheckbox: ${dialogData.checkboxValue}\nInput: ${dialogData.inputValue}.`
          );
        },
      })
      // .addButton("Close", "confirm")
      // .addButton("Cancel", "cancel")
      // .addButton("Help", "help", {
      //   noClose: true,
      //   callback: (e) => {
      //     dialogHelper.window?.alert(
      //       "Help Clicked! Dialog will not be closed."
      //     );
      //   },
      // })
      .setDialogData(dialogData)
      .open("Dialog Example",
        {
          // width: 200,
          // height: 100,
          centerscreen: true,
          fitContent: true,
        }


      );
    // await dialogData.unloadLock.promise;
    // ztoolkit.getGlobal("alert")(
    //   `Close dialog with ${dialogData._lastButtonId}.\nCheckbox: ${dialogData.checkboxValue}\nInput: ${dialogData.inputValue}.`
    // );
    // ztoolkit.log(dialogData);
  }

  @example
  static clipboardExample() {
    new ztoolkit.Clibpoard()
      .addText(
        "![Plugin Template](https://github.com/windingwind/zotero-plugin-template)",
        "text/unicode"
      )
      .addText(
        '<a href="https://github.com/windingwind/zotero-plugin-template">Plugin Template</a>',
        "text/html"
      )
      .copy();
    ztoolkit.getGlobal("alert")("Copied!");
  }

  @example
  static async filePickerExample() {
    const path = await new ztoolkit.FilePicker(
      "Import File",
      "open",
      [
        ["PNG File(*.png)", "*.png"],
        ["Any", "*.*"],
      ],
      "image.png"
    ).open();
    ztoolkit.getGlobal("alert")(`Selected ${path}`);
  }

  //进度条
  @example
  static progressWindow(info: string, status: string) {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: info,
        type: status,
        progress: 100,
      })
      .show();
  }

  @example
  static progressWindowExample() {
    new ztoolkit.ProgressWindow(config.addonName)
      .createLine({
        text: "ProgressWindow Example!",
        type: "success",
        progress: 100,
      })
      .show();
  }

  @example
  static vtableExample() {
    ztoolkit.getGlobal("alert")("See src/modules/preferenceScript.ts");
  }
}
