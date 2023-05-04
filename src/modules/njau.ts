// 南京农业大学核心期刊分类2010
export function njauCore(item: Zotero.Item): any {
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
    var pubT: any = item.getField('publicationTitle');

    if (classOne.includes(pubT)) {
        return '一类核心';
    } else if (classTwo.includes(pubT)) {
        return '二类核心';
    } else {
        return undefined
    }
};
// 南京农业大学高质量期刊
export function njauJournal(item: Zotero.Item): any {
    // 高质量论文一类
    var highQulityOne = ['中国农业科学', '农业工程学报', '南京农业大学学报', '核农学报', '园艺学报', '微生物学报',
        '生物工程学报'];
    // 高质量论文二类
    var highQulityTwo = ['食品与发酵工业', '微生物学通报', '中国粮油学报', '食品与生物技术学报'];

    // 高质量论文A类
    var highQulityA = ['Comprehensive Reviews in Food Science and Food Safety', 'Critical Reviews in Food Science and Nutrition',
        'Trends in Food Science and Technology',
        'ACS Nano', 'Metabolic Engineering', 'Postharvest Biology and Technology', 'Journal of Agricultural and Food Chemistry',
        'Food Hydrocolloids', 'Food Chemistry', 'Food Microbiology', 'Food Control', 'Food & Function', 'Microbiome', 'ISME Journal',
        'Ecotoxicology and Environmental Safety', 'Colloids and surfaces B-Biointerfaces', 'Food and Chemical Toxicology',
        'International Journal of Food Microbiology', 'Food Quality and Preference', 'Food Packaging and Shelf Life', 'Toxins',
        'Food Research International', 'Journal of Colloid and Intereace Science', 'Journal of Food Engineering',
        'Journal of Functional Foods', 'Meat Science',
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
    var highQulityC = ['European Journal of Lipid Science and Technology', 'CyTA-Journal of Food'];

    var pubT: any = item.getField('publicationTitle');

    if (highQulityOne.includes(pubT)) {
        var highQuality: any = '自然科学一类'; // 高质量论文一类
    } else if (highQulityTwo.includes(pubT)) {
        highQuality = '自然科学二类'; // 高质量论文二类
    } else if (highQulityA.includes(pubT)) {
        highQuality = '自然科学A';
    } else if (highQulityB.includes(pubT)) {
        highQuality = '自然科学B';
    } else if (highQulityC.includes(pubT)) {
        highQuality = '自然科学C';
    } else {
        highQuality = undefined
    }

    // 如果高质量期刊没有找到，尝试用&替换and
    if (highQuality == undefined) {
        pubT = pubT.replace('&', 'and');
        if (highQulityOne.includes(pubT)) {
            var highQuality: any = '自然科学一类'; // 高质量论文一类
        } else if (highQulityTwo.includes(pubT)) {
            highQuality = '自然科学二类'; // 高质量论文二类
        } else if (highQulityA.includes(pubT)) {
            highQuality = '自然科学A';
        } else if (highQulityB.includes(pubT)) {
            highQuality = '自然科学B';
        } else if (highQulityC.includes(pubT)) {
            highQuality = '自然科学C';
        } else {
            highQuality = undefined
        }
    }

    return highQuality;

}
