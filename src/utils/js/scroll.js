function getScrollTop() {
    var scrollTop = 0;
    if(document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
    } else if(document.body) {
        scrollTop = document.body.scrollTop
    }
    console.log(scrollTop)
    return scrollTop
}

function getClientHeight() {
    var clientHeight = 0;
    if(document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}

function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}

export default {
    "getScrollTop" : getScrollTop,
    "getClientHeight" : getClientHeight,
    "getScrollHeight" : getScrollHeight
}
