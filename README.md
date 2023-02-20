# Green Frog

感谢[easyScholar](https://easyscholar.cc)提供数据接口，[easyScholar](https://easyscholar.cc)是一个强大的浏览器插件，提供了很多有用期刊数据，详情访问：<https://easyscholar.cc>。感谢@dawnlh 提供期刊缩写数据，感谢@l0o0 提供的期刊缩写接口和中文期刊复合和综合影响子代码。


1. 插件安装后在分类及条目上右击会出现`从easyScholar更新期刊信息`，点击将根据条目语言从[easyScholar](https://easyscholar.cc)获取`JCR分区`、`中科院分区基础版`、`中科院分区升级版`、`影响因子`和`5年影响因子`、`EI`及中文期刊更新是否南`南农大核心期刊`、`南农大高质量期刊（仅含食品科学与工程）`、`中国科技核心期刊`、`CSCD收录`、`北大/南大核心`、`科技核心`、`EI`，`复合影响因子`，`综合影响因子`并保存在`Extra`字段，如果显示不正常请先清除`其它`（`Extra`）字段。并可在`Edit`-`Preferences`-`Green Frog`中设置哪些字段在列中显示，然后在列上右击即可显示相应字段。

主要功能：

![右键](./img/contextmenu.png "右键菜单显示")

在`Edit`-`Preferences`-`Green Frog`中设置：

![设置](.\\img\\preferences.png "插件设置")

在列上右键设置显示的内容：

![列上显示](.\\img\\extracolumn.png "在列中显示")

2. 更新条目元数据。

3. 清除`其它`字段内容（`工具`-`清除其它内容...`）。

4. 给作者加粗、加星、清除加粗、清除加星；将文献题目改为首字母大写；更改期刊题目；更改期刊题目大小写；作者姓名改为词首字母大写；交换作者姓和名；显示配置目录，显示数据目录等小工具（`工具`-`工具箱`）。

在Tools-Toolbox显示：

![工具箱](.\\img\\toolbox.png "工具箱")

5. 更新期刊缩写，带点或不带点。目前期刊缩写数据库只有5000多条数据，可以设置如果英语或中文条目期刊缩写查询不到时是否用全称代替（会根据语言字段进行判断，英语为`en`或`English`，中文为`ch`、`zh`、`中文`或`CN`），语言设置可以使用[Delitem插件](https://github.com/redleafnew/delitemwithatt)）。

# 安装方法

从<https://github.com/redleafnew/zotero-updateifse/releases>下载xpi，然后在Zotero或JurisM中通过Tools-Addons-Install Add-on From File安装。

# 感谢

本插件基于@windingwind的[zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template)开发，在此表示感谢。

1. Update `JCR Quartile`, `CAS Quartile`, `impact factor`,  `5 year impact factor` and `EI` using name of the journal from [easyScholar](https://easyscholar.cc). A context menu `Update Journal Infomation from easyScholar` appears, the  `JCR Quartile`, `CAS Quartile`, `EI` `impact factor` and `5 year impact factor` will be fetched from [easyScholar](https://easyscholar.cc) and  saved to `Extra` field.


2. Update item Metadata.

3. Remove `Extra` field content (`Tools`-`Clean Extra Field...`).

4. Bold, asterisk, remove bold, remove asterisk for author name; Change the item(s) title to sentence case; Change publication title; Change publication title case; Author name to title case; Swap author name first and last name; Show the profile and data directory (Use `Tools`-`Toolbox`).

5. Update journal abbreviation with or without dot.


# Installation
Download xpi from <https://github.com/redleafnew/zotero-updateifse/releases>, and click Tools-Addons-Install Add-on From File in Zotero or JurisM to install the extension.

# Disclaimer

This plugin based on @windingwind's [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template)，many thanks for his team's hard working。

# License

Copyright (C) 2023 Minyi Han

Distributed under the Mozilla Public License (MPL).
