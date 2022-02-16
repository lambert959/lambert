function detectZoom() {
    var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();

    if (window.devicePixelRatio !== undefined) {
        // console.log('devicePixelRatio:' + window.devicePixelRatio)
        ratio = window.devicePixelRatio;
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            // console.log('screen.deviceXDPI:' + screen.deviceXDPI + ', logicalXDPI:' + screen.logicalXDPI)
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    return ratio;
}
$(function () { // A4： 794x1123 (210(297)/25.4*96)
    var ratio = detectZoom();
    // // console.log('raitio:' + detectZoom())
    var EditormdView = editormd.markdownToHTML("content", {
        path: "./assets/editor.md/lib/",
        htmlDecode: "style,script,iframe", // you can filter tags decode
        emoji: true,
        taskList: true,
        tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
    });

    function setPdfSplitStyle($parent, pageHInPixel, isSelf) {
        var childs = isSelf ? [$parent] : $parent.children();
        // console.log('parent============'+ pageHInPixel)
        var cLen = childs.length;
        for (var n = 0; n < cLen; n++) {
            var child = $(childs[n]);
            var childH = child.outerHeight();
            var childTop = child.position().top % pageHInPixel;
            var tagName = child.get(0).tagName.toLowerCase();
            // console.log('No.' + n + ' ' + tagName + ' Height:' + childH + ' Top:' + childTop)
            if (childH + childTop > pageHInPixel) { //需要跨页了
                if (tagName === 'blockquote' || tagName === 'center') {
                    child.children().each(function (index, item) {
                        // console.log($(item))
                        setPdfSplitStyle($(item), pageHInPixel, $(item).get(0).tagName !== tagName);
                    })
                    continue
                }
                var pageLeftH = pageHInPixel - childTop; /*  + 2 */ // 页面除去该元素剩余高度, 2为修正像素，保证元素跨页
                // console.log('pageLeftH: '+ pageLeftH)
                if (tagName !== 'p' &&
                    !(child.find('table').length > 0 || child.tagName === 'table') &&
                    !(tagName === 'pre' && child.hasClass('linenums') || tagName === 'ol' || tagName === 'ul')) {
                    if (childH <= pageHInPixel /* - 2 */) { // 元素高度小于页高，整个元素直接跨页    
                        child.before($('<div class="fornothing"></div>').outerHeight(pageLeftH));
                        childTop = child.position().top % pageHInPixel;
                    }
                } else { // childH > pageHInPixel + 2
                    var involvedPageNum = Math.ceil(childH / (pageHInPixel)); // 元素跨越的页面数
                    if (tagName === 'p') {
                        if (child.children('img').length === 0) { // 不包含图片
                            //pageLeftH = pageLeftH - 2 // 不做特殊处理
                            var node = child.get(0);
                            var nodeList = [node];
                            child.find('*').each(function (index, item) {
                                var computedStyle = window.getComputedStyle(item, null)
                                var display = computedStyle['display'];
                                (display === 'inline' || display === 'inline-block') && nodeList.push(item)
                            });
                            var maxLineHeight = 0;
                            nodeList.forEach(function (node) {
                                //// console.log(node)
                                var computedStyle = window.getComputedStyle(node, null);
                                var lineHeight = computedStyle['line-height'].slice(0, -2) * 1
                                var fontSize = computedStyle['font-size'].slice(0, -2) * 1
                                lineHeight = lineHeight > fontSize ? lineHeight : fontSize
                                maxLineHeight = lineHeight > maxLineHeight ? lineHeight : maxLineHeight
                            });
                            var computedStyle = window.getComputedStyle(node, null);
                            if (pageLeftH - computedStyle['padding-top'].slice(0, -2) * 1 - computedStyle['border-top-width'].slice(0, -2) * 1 < maxLineHeight) { // 高度不足一行
                                child.before($('<div class="fornothing"></div>').outerHeight(pageLeftH));
                                childTop = child.position().top % pageHInPixel;
                                pageLeftH = pageHInPixel - childTop;
                                involvedPageNum = Math.ceil(childH / pageHInPixel);
                            }
                            var lefth = 0;
                            var domHeight = 0;
                            var leftHeight = childH;
                            var prevObj = child;
                            /* if(child.parent().get(0).tagName.toLowerCase() === 'blockquote') {
                                // console.log('blockquote p=======================', involvedPageNum, childTop) // blockquote p childTop算的不对！！！！！！！！！！！！！！！！！！
                            } */
                            // console.log('maxLineHeight: ' + maxLineHeight)
                            for (var i = 0; i < involvedPageNum; i++) {
                                // console.log('第' + i + '======================================')
                                if (i === 0) {
                                    domHeight = pageLeftH;
                                } else if (i > 0 && (i < involvedPageNum - 2)) {
                                    domHeight = pageHInPixel;
                                } else {
                                    domHeight = leftHeight;
                                }
                                if (domHeight > (pageHInPixel)) { // 文档高度超过页高
                                    involvedPageNum++;
                                    domHeight = pageHInPixel;
                                }
                                lefth = domHeight % maxLineHeight;
                                // console.log('lefth: ' +  lefth)
                                domHeight = domHeight - lefth;
                                // console.log('page domHeight: ' + domHeight) // 为啥domHeight不太对
                                if (i === 0) {
                                    child.outerHeight(domHeight).css({
                                        'overflow-y': 'hidden',
                                        'margin-bottom': (lefth) + 'px',
                                        /* 'background': 'red' */
                                    });
                                } else {
                                    var copyElement = child.clone();
                                    prevObj.after(copyElement);
                                    // console.log('scrollTop: ' + (childH - leftHeight))
                                    copyElement.css({
                                        'overflow-y': 'auto'
                                    }).outerHeight(domHeight).scrollTop(childH - leftHeight).css({
                                        'overflow-y': 'hidden'
                                    });
                                    prevObj = copyElement;
                                    if (i === involvedPageNum - 2) { // 最后一个
                                        copyElement.css({
                                            'margin-bottom': '16px'
                                        });
                                    }
                                }
                                leftHeight = leftHeight - domHeight;
                            }
                        } else { // 如果包含图片
                            if (childH <= pageHInPixel) { // 图片高度比页高小
                                child.before($('<div class="fornothing"></div>').outerHeight(pageLeftH));
                            }
                        }
                    } else if (tagName === 'pre' && child.hasClass('linenums') || tagName === 'ol' || tagName === 'ul') {
                        // console.log('li========================')
                        var liList = child.find('li');
                        var liLen = liList.length;
                        for (var i = 0; i < liLen; i++) {
                            var li = $(liList[i]);
                            var liH = li.outerHeight();
                            var liTop = li.position().top % pageHInPixel;
                            if (liH + liTop > pageHInPixel) {
                                pageLeftH = pageHInPixel - liTop;
                                if (pageLeftH > 0) {
                                    li.before($('<li class="fornothing"></li>').outerHeight(pageLeftH));
                                }
                            }
                        }
                    } else if (child.find('table').length > 0 || child.tagName === 'table') { // 表格
                        // console.log('tr========================')
                        var trList = child.find('tr');
                        var trLen = trList.length;
                        for (var i = 0; i < trLen; i++) {
                            var tr = $(trList[i]);
                            var trH = tr.outerHeight();
                            var trTop = tr.position().top % pageHInPixel;
                            if (trH + trTop > pageHInPixel) {
                                pageLeftH = pageHInPixel - trTop;
                                if (pageLeftH > 0) {
                                    tr.before($('<tr style="height: ' + pageLeftH + 'px"></tr>').outerHeight(pageLeftH));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function deal_with_content() {
        var that = this;
        setMdClass($('#content'));
        // 当表格列数过长时将自动出现滚动条
        $.each($('#content table'), function () {
            $(this).prop(
                'outerHTML',
                '<div style="width: 100%;">' +
                $(this).prop('outerHTML') +
                '</div>'
            );
        });

        // 默认超链接都在新窗口打开。但如果是本项目的页面链接，则在本窗口打开。
        $('#content a[href^="http"]').click(function () {
            var url = $(this).attr('href');
            var obj = that.parseURL(url);
            if (
                window.location.hostname == obj.hostname &&
                window.location.pathname == obj.pathname
            ) {
                window.location.href = url;
                if (obj.hash) {
                    window.location.reload();
                }
            } else {
                window.open(url);
            }
            return false;
        })

        // 对表格进行一些改造
        $('#content table tbody tr').each(function () {
            var tr_this = $(this);
            var td1 = tr_this
                .find('td')
                .eq(1)
                .html();
            var td2 = tr_this
                .find('td')
                .eq(2)
                .html();
            if (
                td1 == 'object' ||
                td1 == 'array[object]' ||
                td2 == 'object' ||
                td2 == 'array[object]'
            ) {
                tr_this.css({
                    'background-color': '#F8F8F8'
                });
            } else {
                tr_this.css('background-color', '#fff');
            }
            // 设置表格hover
            tr_this.hover(
                function () {
                    tr_this.css('background-color', '#F8F8F8');
                },
                function () {
                    if (
                        td1 == 'object' ||
                        td1 == 'array[object]' ||
                        td2 == 'object' ||
                        td2 == 'array[object]'
                    ) {
                        tr_this.css({
                            'background-color': '#F8F8F8'
                        });
                    } else {
                        tr_this.css('background-color', '#fff');
                    }
                }
            )
        })

        // 图片点击放大
        $('#content img').click(function () {
            var img_url = $(this).attr('src');
            that.showImg = true; // 获取当前图片地址
            that.imgSrc = img_url;
        }).load(function () {
            // console.log('img H:' + this.height)
        })

        // 表格头颜色
        $('#content table thead').css('display', 'table-row-group');
        $('#content table thead tr').css('background-color', '#eee');
        $('#content table thead tr').css('color', '#1d1d1d');

        // 代码块美化
        $('#content .linenums').css('padding-left', '5px');
        // $("#"+this.id+" .linenums li").css("list-style-type","none") ; //这句代码的副作用是把代码块里的换行符也去掉了
        // 为了弥补上面那句代码失去换行符的漏洞，所以用这个补丁代替
        $('#content .linenums li code').each(function () {
            if (
                $(this)
                    .find('span')
                    .text()
            ) {
                // 假如子元素非空，那就不是换行，从而设置style none。这样就不会误伤把换行符所在的li也设置none了。
                $(this)
                    .parent()
                    .css('list-style-type', 'none');
            }
        })

        $('#content .linenums li').css('background-color', '#fcfcfc');
        $('#content pre').css('background-color', '#fcfcfc');
        $('#content pre').css('border', '1px solid #e1e1e8');

        setTimeout(function () {
            //var totalHeight = 0
            var pageHInPixel = Math.ceil((297 - 10) / 25.4 * 96); // 单个页面高度
            // console.log('page height:' + pageHInPixel)
            // // console.log('Body width:' + $('body').width())
            // // console.log('Body outer width:' + $('body').outerWidth())
            // // console.log('content width:' + $('#content').width())
            // // console.log('content height:' + $('#content').height())
            // // console.log('content outerHeight:' + $('#content').outerHeight())
            // // console.log('content outer all Height :' + $('#content').outerHeight(true))
            // // console.log('content scroll Height :' + $('#content')[0].scrollHeight)
            // // console.log('content client Height :' + $('#content')[0].clientHeight)
            setPdfSplitStyle($('#content'), pageHInPixel);
        }, 500)
    };

    function setMdClass(edDOM) {
        const h1Len = edDOM.find('h1').length;
        if (h1Len) {
            edDOM.removeClass('h2 h3 h4 h5 h6').addClass('h1');
            return;
        }
        const h2Len = edDOM.find('h2').length;
        if (h2Len) {
            edDOM.removeClass('h1 h3 h4 h5 h6').addClass('h2');
            return;
        }
        const h3Len = edDOM.find('h3').length;
        if (h3Len) {
            edDOM.removeClass('h1 h2 h4 h5 h6').addClass('h3');
            return;
        }
        const h4Len = edDOM.find('h4').length;
        if (h4Len) {
            edDOM.removeClass('h1 h2 h3 h5 h6').addClass('h4');
            return;
        }
        const h5Len = edDOM.find('h5').length;
        if (h5Len) {
            edDOM.removeClass('h1 h2 h3 h4 h6').addClass('h5');
            return;
        }
        const h6Len = edDOM.find('h6').length;
        if (h6Len) {
            edDOM.removeClass('h1 h2 h3 h4 h5').addClass('h6');
            return;
        }
    }
    deal_with_content();
});