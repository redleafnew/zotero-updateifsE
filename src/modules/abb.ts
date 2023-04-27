// 得到自定义期刊缩写
export function getAbbEx(pubT: any) {
    var fullAbb: any = [
        {
            'full': 'Proceedings of the National Academy of Sciences',
            'abb_no_dot': 'Proc Natl Acad Sci',
            'abb_with_dot': 'Proc. Natl. Acad. Sci.',
            "record": 1
        },
        {
            'full': 'test',
            'abb_no_dot': 'tt',
            'abb_with_dot': 'test.',
            "record": 1
        }
    ]

    var record0 = {
        "record": 0
    }

    // var pubT: any = item.getField('publicationTitle');
    var jourAbbs = fullAbb.filter((x: any) => x.full === pubT);
    if (jourAbbs['0']) {
        return jourAbbs['0'];
    } else {
        return record0;
    }
};
