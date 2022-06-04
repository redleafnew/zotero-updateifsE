
var res = {};
var items = ZoteroPane.getSelectedItems();
var paperName = getPaperName(items); // publications: tempID 和tempID：publications两个字典
ifs = await getIFs(paperName); //得到所有所选期刊信息
var ptID = paperName[1]; // publications: tempID 用于得到后面的tempID

for (i = 0; i < items.length; i++) {
    var tempID = ptID[items[i].getField('publicationTitle').toUpperCase()]  // 得到期刊题目的tempID
    var ifc = ifs.filter(e => e.tempID == tempID)[0]; //当前期刊的信息
    if (ifc !== undefined) {
        var sci = ifc['sci']; // JCR分区
        var sciUp = ifc['sciUp']; // 中科院分区升级版
        var sciBase = ifc['sciBase']; // 中科院分区基础版
        var sciif = ifc['sciif']; // 影响因子
        var eii = ifc['eii'];// EI收录
        var cssci = ifc['cssci']; // CSSCI南大核心
        var cscd = ifc['cscd']; // CSCD
        var pku = ifc['pku']; // 北大核心
        var zhongguokejihexin = ifc['zhongguokejihexin']; // 科技核心


    }

}


res['tempID'] = tempID;
res['ifs'] = ifs;

//return  JSON.stringify (ifs).indexOf('sci')


getIFs = async function (paperName) {

    var data = {};
    var optionCheckd = ['sci', 'sciif5','sciUp', 'sciBase', 'sciif', 'eii',   // 英文期刊：分区、中科院升级版、中科院基础版、IF、EI
        'cssci', 'cscd', 'pku', 'zhongguokejihexin']; // 中文期刊：南大核心、CSCD、北大核心、科技核心：
    data["requirePaperRank"] = optionCheckd;
    data["version"] = "5.6";
    data["website"] = "Zotero";
    data["papersName"] = paperName[0]; // [0] 为id：期刊
    // data["papersName"] =
    // {
    //     349: "NATURE",


    //     1807: "FOODS",
    //     1927: "SCIENCE"
    // };  // key为自己生成，value为刊物名称（需要大写）


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
}

updateJson["papersRank"].filter(e => e.tempID === "7960");
结果：
{
    "papersRank": [
        "0": {
            "tempID": 3928
            "sciif": "4.792"
            "sci": "Q2"
            "sciBase": "生物2区"
            "sciUp": "生物学2区"
            "eii": "EI"
        }
        "1": {
            "tempID": 4108
            "sciif": "16.389"
            "sci": "Q1"
            "sciBase": "工程技术1区"
            "sciUp": "计算机科学1区"
            "eii": "EI"
        }
    ]
}


//得到要查询的期刊题目,形成字典形式：{key：期刊题目},用于查询
getPaperName = function (items) {
    var papersName = {};
    var papersName0 = {};
    var papersName1 = {};
    var pt = getPublicationTitles(items);
    var keys = generateNKey(pt.length);
    for (i = 0; i < pt.length; i++) {
        papersName0[keys[i]] = pt[i];   //0为id：期刊
        papersName1[pt[i]] = keys[i];  //1为期刊：id
    }
    papersName[0] = papersName0;
    papersName[1] = papersName1;
    return papersName;
}
//得到要查询的期刊题目
getPublicationTitles = function (items) {

    var publicationTitles = {};

    for (i = 0; i < items.length; i++) {
        publicationTitles.push(items[i].getField('publicationTitle').toUpperCase());

    }
    publicationTitles = unique(publicationTitles); // 去除重复期刊题目
    return publicationTitles;
}

generateNKey = function (n) {
    var keys = [];
    var key = generate1Key();
    while (keys.length < n) {
        var key = generate1Key();
        keys.push(key);
        keys = unique(keys);
    }
    return keys;
}
// 生成4位有效数字 
// 代码源于：https://blog.csdn.net/hdq1745/article/details/88929612

generate1Key = function () {

    var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var lastarr = new Array();

    while (lastarr.length < 4) {
        var num = Math.floor(Math.random() * 10);
        if (lastarr.indexOf(arr[num]) === -1) {
            lastarr += arr[num];
        }
    }

    return lastarr;
}

// 删除数组重复数据
// https://blog.csdn.net/weixin_44849078/article/details/89840871
unique = function (arr) {
    let hash = [];
    for (let i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) === -1) {
            hash.push(arr[i]);
        }
    }
    return hash;
}


// 测试用
// 得到期刊信息
async function getIFs(paperName) {
    var data = {};
    var optionCheckd = ['sci', 'sciUp', 'sciBase', 'sciif', 'eii',   // 英文期刊：分区、中科院升级版、中科院基础版、IF、EI
        'cssci', 'cscd', 'pku', 'zhongguokejihexin']; // 中文期刊：南大核心、CSCD、北大核心、科技核心：
    data["requirePaperRank"] = optionCheckd;
    data["version"] = "5.6";
    data["website"] = "Zotero";
    data["papersName"] = paperName[0]; // [0] 为id：期刊
    // data["papersName"] =
    // {
    //     349: "NATURE",
    //     1807: "FOODS",
    //     1927: "SCIENCE"
    // };  // key为自己生成，value为刊物名称（需要大写）


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
}


//得到要查询的期刊题目,形成字典形式：{key：期刊题目},用于查询
function getPaperName(items) {
    var papersName = {};
    var papersName0 = {};
    var papersName1 = {};
    var pt = getPublicationTitles(items);
    var keys = generateNKey(pt.length);
    for (i = 0; i < pt.length; i++) {
        papersName0[keys[i]] = pt[i];
        papersName1[pt[i]] = keys[i];
    }
    papersName[0] = papersName0;
    papersName[1] = papersName1;
    return papersName;
}
//得到要查询的期刊题目
function getPublicationTitles(items) {

    var publicationTitles = [];

    for (i = 0; i < items.length; i++) {
        publicationTitles.push(items[i].getField('publicationTitle').toUpperCase());

    }
    publicationTitles = unique(publicationTitles); // 去除重复期刊题目
    return publicationTitles;
}

function generateNKey(n) {
    var keys = [];
    var key = generate1Key();
    while (keys.length < n) {
        var key = generate1Key();
        keys.push(key);
        keys = unique(keys);
    }
    return keys;
}
// 生成4位有效数字 
// 代码源于：https://blog.csdn.net/hdq1745/article/details/88929612

function generate1Key() {

    var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var lastarr = new Array();

    while (lastarr.length < 4) {
        var num = Math.floor(Math.random() * 10);
        if (lastarr.indexOf(arr[num]) === -1) {
            lastarr += arr[num];
        }
    }

    return lastarr;
}

// 删除数组重复数据
// https://blog.csdn.net/weixin_44849078/article/details/89840871
function unique(arr) {
    let hash = [];
    for (let i = 0; i < arr.length; i++) {
        if (hash.indexOf(arr[i]) === -1) {
            hash.push(arr[i]);
        }
    }
    return hash;
}