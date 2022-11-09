# Update IFs from easyScholar

感谢[easyScholar](https://easyscholar.cc)提供数据接口，[easyScholar](https://easyscholar.cc)是一个强大的浏览器插件，提供了很多有用期刊数据，详情访问：<https://easyscholar.cc>。感谢@dawnlh 提供期刊缩写数据，感谢@l0o0 提供的期刊缩写接口和中文期刊复合和综合影响子代码。

插件功能与[Zotero Update IFs](https://github.com/redleafnew/zotero-updateifs)相同，代码逻辑也一样，为了防止冲突，请不要同时安装这两个插件。~~[Zotero Update IFs](https://github.com/redleafnew/zotero-updateifs) 期刊缩写功能可见[Delete Item(s) With Attachment(s)](https://github.com/redleafnew/delitemwithatt)插件~~。

1. 插件安装后在分类及条目上右击会出现`从easyScholar更新期刊信息`，点击即可从[easyScholar](https://easyscholar.cc)获取`JCR分区`、`中科院分区`、`影响因子`和`5年影响因子`及中文期刊更新是否南`南农大核心期刊`、`南农大高质量期刊（仅含食品科学与工程）`、`CSCD收录`、`北大/南大核心`、`科技核心`、`EI`，`复合影响因子`，`综合影响因子`并分别写入到`档案`、`存档位置`、`馆藏目录`、`索书号`、`版权`、`系列`、`系列标题`、`系列文本`等字段（可通过`Tools`-`Update IFs preference...`设置是否显示和存贮位置）,也可以设置以上信息是否保存在`Extra`字段（默认为不保存），如果显示不正常请先清除`其它`（`Extra`）字段。具体哪个字段显示什么内容见<https://github.com/redleafnew/zotero-updateifsE/issues/10#issuecomment-1197487577>。点击从`从easyScholar更新期刊信息`后，插件会根据条目语言（语言字段包括`en`为英文条目，语言设置可以使用[Delitem插件](https://github.com/redleafnew/delitemwithatt)）使用期刊名称从[easyScholar](https://easyscholar.cc)更新期刊英文期刊的`JCR分区`、`中科院分区`、`影响因子`、`5年影响因子`和`EI`；对于中文期刊更新是否`EI`、`CSCD收录`、`中文核心期刊/北大核心`、`CSSCI/南大核心`、`中国科技核心期刊`；插件主体来源于`Zotero Scholar Citations`(<https://github.com/beloglazov/zotero-scholar-citations>)，
2. 清除`其它`字段内容（`工具`-`清除其它内容...`）。

3. 给作者加粗、加星、清除加粗、清除加星；将文献题目改为首字母大写；更改期刊题目；更改期刊题目大小写；作者姓名改为词首字母大写；交换作者姓和名；显示配置目录，显示数据目录等小工具（`工具`-`工具箱`）。

4. 更新期刊缩写，带点或不带点。目前期刊缩写数据库只有5000多条数据，可以设置如果英语或中文条目期刊缩写查询不到时是否用全称代替（会根据语言字段进行判断，英语为`en`或`English`，中文为`ch`、`zh`、`中文`或`CN`），语言设置可以使用[Delitem插件](https://github.com/redleafnew/delitemwithatt)）。

# 安装方法

从<https://github.com/redleafnew/zotero-updateifse/releases>下载xpi，然后在Zotero或JurisM中通过Tools-Addons-Install Add-on From File安装。



1. Update `JCR Quartile`, `CAS Quartile`, `impact factor`,  `5 year impact factor` and `EI` using name of the journal from [easyScholar](https://easyscholar.cc). The framework of the present plugin is from `Zotero Scholar Citations`(<https://github.com/beloglazov/zotero-scholar-citations>). A context menu `Update Journal Infomation from easyScholar` appears, the  `JCR Quartile`, `CAS Quartile`, `impact factor` and `5 year impact factor` will be fetched from [easyScholar](https://easyscholar.cc) and stored into the `Archive`, `Loc. in Archive`, `Library Catalog`, `Call Number`, `Rights` field (you can set show or not and the target field) if it doesn't work, the information abovementioned can be set to saved to `Extra` field(default false).


2. Remove `Extra` field content (`Tools`-`Clean Extra Field...`).

3. Bold, asterisk, remove bold, remove asterisk for author name; Change the item(s) title to sentence case; Change publication title; Change publication title case; Author name to title case; Swap author name first and last name; Show the profile and data directory (Use `Tools`-`Toolbox`).

4. Update journal abbreviation with or without dot.


# Installation
Download xpi from <https://github.com/redleafnew/zotero-updateifse/releases>, and click Tools-Addons-Install Add-on From File in Zotero or JurisM to install the extension. 

# License

Copyright (C) 2022 Minyi Han

Distributed under the Mozilla Public License (MPL).
