#!/bin/sh

# 文件来源于https://github.com/UB-Mannheim/zotero-ocr/blob/master/release.sh
# 和https://github.com/UB-Mannheim/zotero-ocr/blob/master/build.sh
read -p "Enter new version number: " version


##############
## Update install.rdf
##############

perl -pi -e "s/em:version=\"[^\"]*/em:version=\"$version/;" "install.rdf"
# rm "install.rdf.bak"
git add "install.rdf"


##############
## Update update.rdf
##############

perl -pi -e "s/<em:version>[^<]*/<em:version>$version/;" \
          -e "s/<em:updateLink>[^<]*/<em:updateLink>https:\/\/github.com\/redleafnew\/zotero-updateifse\/releases\/download\/$version\/zotero-updateifs.xpi/;" \
          -e "s/<em:updateInfoURL>[^<]*/<em:updateInfoURL>https:\/\/github.com\/redleafnew\/zotero-updateifse\/releases\/tag\/$version/;" \
    update.rdf
git add "update.rdf"
# rm "update.rdf.bak"

git commit -m "Release $version" 1>&2

##############
## 生成xpi
##############
#./build.sh "$version"

#version="$1"
#if [ -z "$version" ]; then
#	read -p "Enter new version number: " version
#fi

rm -f zotero-updateifs.xpi
zip -r zotero-updateifs.xpi chrome/* defaults/* chrome.manifest install.rdf

