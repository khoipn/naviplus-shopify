var naviman_domain = 'https://naviman.shopifas.com/';
var naviman_css = 'https://cdn.jsdelivr.net/gh/khoipn/naviplus-shopify@latest/v1/uigen-min.css';
var UIGEN_ENV = "DEPLOYMENT";



var naviman_json_cdn = "https://naviplus.b-cdn.net/naviplus/data/json";
var naviman_json_files = "https://naviplus.b-cdn.net/naviplus/data/";
var naviman_cache_miniseconds = 3600000; // 10 minutes

if (typeof naviman === 'undefined') {
    if (!window.isWelcomeLogged) {
        console.log("%cNavi+ is Menu Builder for Mobile + Desktop: Sticky Navbar, Tab bar, Mega Menu, Slide Menu & Grid Menu.. | Website: https://apps.shopify.com/pronavi-navigation-design", "color:green; font-size: 16px");
        window.isWelcomeLogged = true;
    }
}

/**********************************************************************************************************************
 Functions.
 **********************************************************************************************************************/
var naviman = (function(){

    var VERTICAL_CHILDREN_WIDTH = 200;
    var DESKTOP_MAX_WIDTH = 400;
    var SCROLL_TO_HIDE = 58;
    var BOX_SHADOW = 'box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10);';
    var shop = '';
    var embed_id = '';
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var cartCount = 0;

    var BADGE_HIDE = 0;
    var BADGE_DOT = 1;
    var BADGE_ISCART_WITHCOUNT = 2;
    // Gom toàn bộ những SF-1234567 data vào 1 biến để dùng
    var navimanData = [];

    /** Khởi tạo các biến dùng chung **************************/
    /** uigen/init.js ****************************************/
if (typeof NAVIGLOBAL === 'undefined') {
    NAVIGLOBAL = [];
    NAVIGLOBAL['ITEM_KINDS'] = [];
    NAVIGLOBAL['MENU_KINDS'] = [];

    NAVIGLOBAL['ITEM_KINDS'] = {
        ICON_IMAGE_TEXT: 1,
        GROUP_TITLE: 2,
        BLANK_SPACE: 3,
        BIG_IMAGE_TEXT: 4,
        CUSTOM_HTML: 5,
        BUTTON: 6

    };

    // TODO
    NAVIGLOBAL['ITEM_DISPLAY_LAYOUT'] = {
        TOP_DOWN: 1,
        LEFT_RIGHT: 2,
        ICON_IMAGE_ONLY: 3,
        TEXT_ONLY: 4,
        EMPTY: 5,
    };

    NAVIGLOBAL['MENU_KINDS'] = {
        STICKY_MOBILE_TABBAR: 1,
        STICKY_MOBILE_HEADER: 2,
        STICKY_FAB_SUPPORT: 11,
        SECTION_MOBILE_HEADER: 20,
        SECTION_MOBILE_MEGAMENU: 31,
        SECTION_MOBILE_GRID: 41,
        SECTION_MOBILE_BANNER: 42,
        /*******************************/
        SECTION_MEGAMENU: 131,
        /*******************************/
        STICKY_HAMBURGER: 141,
        CONTEXT_DROPDOWN: 151
    }

    NAVIGLOBAL['MOBILE_POSITION'] = {
        BOTTOM: 1,
        TOP: 2,
        RIGHT_CENTER: 3,
        LEFT_CENTER: 4,
        RIGHT_BOTTOM: 5,
        LEFT_BOTTOM: 6
    }

    NAVIGLOBAL['DESKTOP_POSITION'] = {
        BOTTOM_CENTER_FLOAT: 0,
        BOTTOM_CENTER: 1,
        BOTTOM_RIGHT: 2,
        BOTTOM_LEFT: 3,
        BOTTOM_FULL: 4,
        RIGHT_TOP: 5,
        LEFT_TOP: 6,
        LEFT_FULL_TOP: 7,
        LEFT_FULL_CENTER: 8,
        RIGHT_FULL_TOP: 9,
        RIGHT_FULL_CENTER: 10,
        TOP_FULL: 11
    }

    NAVIGLOBAL['LAYOUT'] = {
        DEFAULT: 1,
        HIGHLIGHT: 2,
        FLOATING: 3,
        FAB: 4
    }
}
/** uigen/init.js END ****************************************/


    /** Khởi tạo các hàm dùng chung **************************/
    /** uigen/libs.js ****************************************/

var clearCSS_JS =  function (css) {
    if (typeof css == 'undefined')
        return "";
    css = css.trim();
    css = css.strReplace('<script>', '');
    css = css.strReplace('</script>', '');
    css = css.strReplace('<style>', '');
    css = css.strReplace('</style>', '');
    return css;
};

var addStyleToHeader = function(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName("head")[0].appendChild(css);
}

var isHadValue = function(checkVar) {
    if (typeof (checkVar) == 'undefined')
        return false;

    if (checkVar.toString().trim() == "")
        return false;

    return true;
};

var defaultValue = function( str, defaultValue ) {
    if (typeof str == 'undefined')
        return defaultValue;
    if( str.toString().trim() == "" )
        return defaultValue;
    return platformValue(str);
};

var isElitePlan = function( naviman_shopinfo ) {
    if (typeof naviman_shopinfo != 'undefined') {
        if (typeof naviman_shopinfo["plan"] != "undefined") {
            if( naviman_shopinfo['plan'] == 'Elite' )
                return true;
        }
    }
    return false;
};

var standardizeCSS = function(rules, className){
    if( rules == "" ) return rules;


    rules = rules.replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove extra whitespace, newlines, tabs, and spaces
    rules = rules.replace(/\s{2,}/g, ' '); // Collapses multiple spaces into one
    rules = rules.replace(/\s*({|}|,|;|:)\s*/g, '$1'); // Remove spaces around special characters

    // Remove non-breaking spaces (&nbsp;)
    rules = rules.replace(/&nbsp;/g, ' ');

    // Optionally trim leading and trailing whitespace
    rules = rules.trim();


    if( rules.length >= className.length + 1 )
        if( rules.substring(0, className.length + 1) == '.' + className )
            return rules;

    var classLen = className.length,
        char, nextChar, isAt, isIn;

    // makes sure the className will not concatenate the selector
    className = ' #' + className + ' ';

    // removes comments
    rules = rules.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );

    // makes sure nextChar will not target a space
    rules = rules.replace( /}(\s*)@/g, '}@' );
    rules = rules.replace( /}(\s*)}/g, '}}' );

    for (var i = 0; i < rules.length-2; i++) {
        char = rules[i];
        nextChar = rules[i+1];

        if (char === '@' && nextChar !== 'f') isAt = true;
        if (!isAt && char === '{') isIn = true;
        if (isIn && char === '}') isIn = false;

        if (
            !isIn &&
            nextChar !== '@' &&
            nextChar !== '}' &&
            (
                char === '}' ||
                char === ',' ||
                ((char === '{' || char === ';') && isAt)
            )
        ) {
            rules = rules.slice(0, i+1) + className + rules.slice(i+1);
            i += classLen;
            isAt = false;
        }

    };

    // prefix the first select if it is not `@media` and if it is not yet prefixed
    if (rules.indexOf(className) !== 0 && rules.indexOf('@') !== 0) rules = ' ' + className+rules;


    return rules;
};

var isMobileMode = function () {
    if (windowWidth <= 768)
        return true;
    return false;
};

var getCurrentTemplate = function () {
    let path = window.location.pathname.toUpperCase().trim();
    if (path == '/' || path == '')
        return "index";
    if (path.includes('PRODUCTS'))
        return "products";
    if (path.includes('COLLECTIONS'))
        return "collections";
    if (path.includes('PAGES'))
        return "pages";
    if (path.includes('BLOGS'))
        return "blogs";

    return "others";
};


var jsonp = function(uri) {
    return new Promise(function(resolve, reject) {
        var id = '_' + Math.round(10000 * Math.random());
        var callbackName = 'jsonp_callback_' + id;
        window[callbackName] = function(data) {
            delete window[callbackName];
            var ele = document.getElementById(id);
            ele.parentNode.removeChild(ele);
            resolve(data);
        }

        var src = uri + '&callback=' + callbackName;
        var script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.addEventListener('error', reject);
        (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
    });
};

var displayElement = function( el, display, displayKind = "block" ) {

    if( isNull(el)) return;
    if( isNull(el.style)) return;

    if( display )
        el.style.display = displayKind;
    else
        el.style.display = "none";
};

var isNull = function( object ) {

    if ( object == null ) return true;
    if ( typeof object == "undefined" ) return true;

    return false;
};

String.prototype.strReplace = function(strR, strWith) {
    var esc = strR.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

var debugConsole = function ( object ) {
    if( UIGEN_ENV == "DEVELOPMENT" )
        console.log( object );
};


// Kiểm tra xem nếu là icon thì trả về icon, nếu có ảnh thì chỉ hiện thị ảnh thôi
var itemMedia =  function(icon, image, naviman_domain, style='', iconboxpadding, /*iconBoxPaddingTop = 0, */itemExtIconSize = '', itemExtAlign = '', seoUrl = '')
{
    let isHadImage = true;

    if (typeof (image) === 'undefined')
        isHadImage = false;
    else if (image.trim() == "")
        isHadImage = false;

    var iconStyle = "";
    /*if( iconBoxPaddingTop != 0 ) {
        iconStyle += 'margin-bottom:' + ( iconBoxPaddingTop - 2 ) + 'px; padding-top: ' + iconBoxPaddingTop + 'px;';
    }*/

    /* Chỗ này kiểm tra xem nếu có colorbox thì: 1. đặt span.icon là height:fitcontent và i.ri là display;inline-block,
    điều này làm chiều cao của span.icon bằng với chiều cao của cả cụm icon. */
    if( iconboxpadding != "" && iconboxpadding != "0" ) {
        iconStyle += ' height: fit-content; ';
    }

    var styleImageHeight = '';
    if( itemExtIconSize != '' )
        styleImageHeight += ' style="height:'+ itemExtIconSize +'px" ';

    if (!isHadImage) {
        var output = '<span class="icon" style="'+ iconStyle +'" >' + '<i class="' + icon + '" '+ style +'></i>' + '</span>';
        if( seoUrl != '' ) output = seoUrl + output + '</a>';
        return output;
    } else {
        var output = '<div class="image-border" ' + itemExtAlign + ' ><span class="image-box" ' + style + '><span class="image">' + '<img ' + styleImageHeight + ' src="' + naviman_json_files + image + '">' + '</span></span></div>';
        if (seoUrl != '') output = seoUrl + output + '</a>';
        return output;
    }
};

var defaultMarginPadding = function( marginPadding ) {
    if( marginPadding == null ) marginPadding = {
        'top' : 0, 'right' : 0, 'bottom' : 0, 'left' : 0
    };

    marginPadding['top'] = platformValue( marginPadding['top'] );
    marginPadding['right'] = platformValue( marginPadding['right'] );
    marginPadding['bottom'] = platformValue( marginPadding['bottom'] );
    marginPadding['left'] = platformValue( marginPadding['left'] );

    if(marginPadding['top'] == '') marginPadding['top'] = 0;
    if(marginPadding['right'] == '') marginPadding['right'] = 0;
    if(marginPadding['bottom'] == '') marginPadding['bottom'] = 0;
    if(marginPadding['left'] == '') marginPadding['left'] = 0;

    return marginPadding;
};


function encodeBody( url ) {
    var output = url;
    const words = output.split('body=');
    if( words.length == 2 ) {
        //console.log( words );
        var body = encodeURIComponent(words[1]);
        output = words[0] + 'body=' + body;
    }
    return output;
}

function isUrlContain(keywordsSetting) {
    var url = window.location.pathname + window.location.search; //window.location.href.toLowerCase();
    url = url.toLowerCase()
    var keywords = keywordsSetting.split(',');
    for (let i = 0; i < keywords.length; i++) {
        keywords[i] = keywords[i].trim().toLowerCase();
        if( keywords[i] != '' ) {
            if( url.includes( keywords[i] ) )
                return true;
        }
    }
    return false;
}

function isUserLoggedIn() {
    try {
        if (window.ShopifyAnalytics.meta.page.customerId == null)
            return false;
    }catch({ name, message }) {
        return false;
    }
    return true;
}

var hexToRgba = function(hex, alpha = 1) {
    // Remove the leading #
    hex = hex.replace('#', '');

    // Parse the red, green, and blue values
    let red = parseInt(hex.substring(0, 2), 16);
    let green = parseInt(hex.substring(2, 4), 16);
    let blue = parseInt(hex.substring(4, 6), 16);

    // Return the rgba string
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

var isSettingBeTrue = function( checkVar, defaultValue = false ) {
    if (isHadValue(checkVar))
        if( checkVar == true || checkVar == "true" )
            return true;
        else
            return false;
    return defaultValue;
}

var removeExtraSpaces = function(str) {
    // Sử dụng biểu thức chính quy để thay thế nhiều khoảng trắng bằng một khoảng trắng duy nhất
    return str.replace(/\s+/g, ' ').trim();
}

var menuPositionClass = function ( data ) {
    var menuPosition = '';

    switch (parseInt(data["setting"]["mobilePosition"])) {
        case NAVIGLOBAL['MOBILE_POSITION']['BOTTOM']:
            menuPosition += " mobile-" + "bottom ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['TOP']:
            menuPosition += " mobile-" + "top ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER']:
            menuPosition += " mobile-" + "right-center ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']:
            menuPosition += " mobile-" + "left-center ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM']:
            menuPosition += " mobile-" + "right-bottom ";
            break;
        case NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']:
            menuPosition += " mobile-" + "left-button ";
            break;
    }

    switch (parseInt(data["setting"]["desktopPosition"])) {
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER_FLOAT']:
            menuPosition += " desktop-" + "bottom-center-float ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER']:
            menuPosition += " desktop-" + "bottom-center ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT']:
            menuPosition += " desktop-" + "bottom-right ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT']:
            menuPosition += " desktop-" + "bottom-right ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_LEFT']:
            menuPosition += " desktop-" + "bottom-left ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_FULL']:
            menuPosition += " desktop-" + "bottom-full ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP']:
            menuPosition += " desktop-" + "right-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']:
            menuPosition += " desktop-" + "left-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']:
            menuPosition += " desktop-" + "left-full-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']:
            menuPosition += " desktop-" + "left-full-center ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']:
            menuPosition += " desktop-" + "right-full-top ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']:
            menuPosition += " desktop-" + "right-full-center ";
            break;
        case NAVIGLOBAL['DESKTOP_POSITION']['TOP_FULL']:
            menuPosition += " desktop-" + "top-full ";
            break;
    }

    return menuPosition;
}

var showNaviOverlay = function () {
    if( document.getElementsByClassName("naviman_app_overlay") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay")[0].style.display = 'block';

/*    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
*/
}

var hideNaviOverlay = function () {
    if( document.getElementsByClassName("naviman_app_overlay") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay")[0].style.display = 'none';
}

var showNaviOverlayGlobal = function () {
    if( document.getElementsByClassName("naviman_app_overlay_global") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay_global")[0].style.display = 'block';
    document.body.style.overflow = "hidden";
}

var hideNaviOverlayGlobal = function () {
    if( document.getElementsByClassName("naviman_app_overlay_global") == null )
        return;
    if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
        return;
    document.getElementsByClassName("naviman_app_overlay_global")[0].style.display = 'none';
    document.body.style.overflow = "initial";
}

var isBackendMode = function () {
    if (typeof DEPLOY_ENVIROIMENT != 'undefined')
        if (DEPLOY_ENVIROIMENT == "DESIGNING") {
            return true;
        }
    return false;
}

var getSEOUrl = function ( itemUrl ) {
    var currentDomain = window.location.origin;
    itemUrl = itemUrl.trim();
    if( itemUrl == "" )
        return currentDomain;
    if( itemUrl == "#" )
        return itemUrl;
    if( itemUrl.includes("html") )
        return  itemUrl;
    if( itemUrl.includes("open:") )
        return "";
    if( itemUrl.includes("scroll:") )
        return "";
    if( itemUrl.includes("javascript:") )
        return "";
    if( itemUrl.includes("tel:") )
        return "";
    if( itemUrl.includes("sms:") )
        return "";
    if( itemUrl.includes("mailto:") )
        return "";
    if( itemUrl.includes("share:") )
        return "";
    return currentDomain + "/" + itemUrl;
}

var getMenuKind = function( naviman_shopinfo, embed_id ) {

    if( isBackendMode() ) {
        if( typeof fakeMenuKind != "undefined" )
            return fakeMenuKind;
        return "1";
    }

    if( typeof naviman_shopinfo != "undefined" ) {
        if (typeof naviman_shopinfo["bottombars"] != "undefined") {
            if (typeof naviman_shopinfo["bottombars"][embed_id] != "undefined") {
                return naviman_shopinfo["bottombars"][embed_id];
            }
        }
    }
    return -1;
}

var getClassOfMenuKind = function( naviman_shopinfo, embed_id ) {
    var menuKind = getMenuKind( naviman_shopinfo, embed_id);
    switch (menuKind) {
        case NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_TABBAR']:
            return "STICKY_MOBILE_TABBAR";
        case NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_HEADER']:
            return "STICKY_MOBILE_HEADER";
        case NAVIGLOBAL['MENU_KINDS']['STICKY_FAB_SUPPORT']:
            return "STICKY_FAB_SUPPORT";
        case NAVIGLOBAL['MENU_KINDS']['STICKY_MOBILE_TABBAR']:
            return "STICKY_MOBILE_TABBAR";
        case NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_HEADER']:
            return "SECTION_MOBILE_HEADER";
        case NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_MEGAMENU']:
            return "SECTION_MOBILE_MEGAMENU";
        case NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_GRID']:
            return "SECTION_MOBILE_GRID";
        case NAVIGLOBAL['MENU_KINDS']['SECTION_MOBILE_BANNER']:
            return "SECTION_MOBILE_BANNER";

        case NAVIGLOBAL['MENU_KINDS']['SECTION_MEGAMENU']:
            return "SECTION_MEGAMENU";
        case NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER']:
            return "STICKY_HAMBURGER";
        case NAVIGLOBAL['MENU_KINDS']['CONTEXT_DROPDOWN']:
            return "CONTEXT_DROPDOWN";

    }
}

function stringToArray(inputString) {
    return inputString
        .split(/[,;]/)         // Tách chuỗi theo dấu , hoặc ;
        .map(item => item.trim()) // Loại bỏ khoảng trắng thừa ở đầu và cuối mỗi item
        .filter(item => item !== ""); // Loại bỏ các item rỗng
}

function removeAllEventListeners(element) {
    const newElement = element.cloneNode(true); // Tạo bản sao
    element.parentNode.replaceChild(newElement, element); // Thay thế phần tử gốc bằng bản sao
    return newElement; // Trả về phần tử mới
}

function encodeQuery(query) {
    let encoded = btoa(query); // Encode to Base64
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return encoded;
}

function decodeQuery(encoded) {
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return atob(encoded); // Decode from Base64
}

function parseAttributes(input) {
    // Split by ; and , delimiters
    let parts = input.split(/[,;]+/);

    // Filter and clean valid attributes (attr=value)
    let validAttributes = parts
        .map(part => part.trim()) // Trim spaces around
        .filter(part => {
            // Only keep parts that have an = sign and no space in the attribute name
            return /^[a-zA-Z0-9_-]+\s*=\s*[^\s]+/.test(part);
        });

    return validAttributes;
}

function formatAttributes(attrArray) {
    return attrArray.map(attrPair => {
        let [attribute, value] = attrPair.split('=');

        // Replace spaces in the attribute name with hyphens
        attribute = attribute.trim().replace(/\s+/g, '-');

        // Return the formatted string with value in double quotes
        return `${attribute}="${value.trim()}"`;
    }).join(' ');
}

function standardizeFunctionString(funcString) {
    // Regular Expression để bắt các hàm dạng 'function tenHam(...) {...}'
    const functionDeclarationPattern = /function\s+([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)\s*\{/g;

    // Regular Expression để bắt các hàm dạng 'var tenHam = function(...) {...}'
    const functionExpressionPattern = /var\s+([a-zA-Z_$][\w$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{/g;

    // Thay thế các hàm dạng 'function tenHam(...) {...}' thành 'Navi.tenHam = function(...) {...}'
    var output = funcString.replace(functionDeclarationPattern, 'Navi.$1 = function($2) {');

    // Thay thế các hàm dạng 'var tenHam = function(...) {...}' thành 'Navi.tenHam = function(...) {...}'
    output = output.replace(functionExpressionPattern, 'Navi.$1 = function($2) {');

    return output;
}

var platformValue = function( val ) {
    if( val != "" )
    {
        if( typeof val !== 'string' )
            return val;

        // Bước 0: Cắt bỏ ký tự '|' ở đầu và cuối nếu có
        if (val.startsWith('|')) val = val.slice(1);
        if (val.endsWith('|')) val = val.slice(0, -1);

        // Bước 1: Kiểm tra nếu không chứa ký tự '|', trả về chính nó
        if (!val.includes('|')) return val;

        // Bước 2: Split thành array
        const parts = val.split('|');

        // Kiểm tra kích thước và lấy phần tử tương ứng
        if (window.innerWidth <= 768) {
            return parts[0] !== '' ? parts[0].trim() : parts[1].trim() || '';
        } else {
            return parts[1] !== '' ? parts[1].trim() : parts[0].trim() || '';
        }
    }
    return val;
}

/** uigen/libs.js END ****************************************/

    var generateCSS_init = function ( setting ) {
    //debugConsole("1.generateCSS_init");

    setting['submenuWidth'] = defaultValue(setting['submenuWidth'], 200);
    setting['textSize'] = defaultValue( setting['textSize'], 10);
    setting['spaceTextIcon'] = defaultValue(setting['spaceTextIcon'], 2);
    setting['iconSize'] = defaultValue(setting['iconSize'], 22);
    setting['height'] = defaultValue(setting['height'], 54);
    setting['borderRadius'] = defaultValue(setting['borderRadius'], 0);
    setting['opacity'] = defaultValue(setting['opacity'], 100);
    setting['bottomMargin'] = defaultValue(setting['bottomMargin'], "");
    setting['settingMargin'] = defaultMarginPadding( setting['settingMargin'] );
    setting['settingPadding'] = defaultMarginPadding( setting['settingPadding'] );

};

var generateCSS_paddingMargin = function ( setting, cssNaviPrefix, section_setting ) {
    //debugConsole("4.generateCSS_paddingMargin");

    var addHtml = "";
    addHtml += cssNaviPrefix + ' { margin: ' +
        setting['settingMargin']['top'] + 'px ' +
        setting['settingMargin']['right'] + 'px ' +
        setting['settingMargin']['bottom'] + 'px ' +
        setting['settingMargin']['left'] + 'px ' +
        ' } ';
    addHtml += cssNaviPrefix + ' { padding: ' +
        setting['settingPadding']['top'] + 'px ' +
        setting['settingPadding']['right'] + 'px ' +
        setting['settingPadding']['bottom'] + 'px ' +
        setting['settingPadding']['left'] + 'px ' +
        ' } ';
    return addHtml;
};

var generateCSS_UI_Level1_Menuitems = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting ) {
    //debugConsole("2.generateCSS_UI_Level1_Menuitems");

    var addHtml = "";

    if (isHadValue(setting['textColor'])) {
        addHtml += cssNaviPrefix + ' ul li.item .name { color: ' + setting['textColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li.item .description { color: ' + setting['textColor'] + '; } ';
    }

    // TODO: Cho chọn không chọn font và một font tự chọn tên.
    if (isHadValue(setting['fontFamily'])) {
        let fontFamily_css = '<style> @import url("https://fonts.googleapis.com/css2?family=' + setting['fontFamily'] + '&display=swap"); </style>';
        naviman_appItem.insertAdjacentHTML('beforebegin', fontFamily_css);

        addHtml += cssNaviPrefix + ' {font-family: "' + setting['fontFamily'].strReplace('+', ' ') + '", "Roboto"} ';
    }

    if (isHadValue(setting['textSize'])) {
        addHtml += cssNaviPrefix + ' ul li.item > .inner .name { font-size: ' + setting['textSize'] + 'px; } ';
        addHtml += cssNaviPrefix + ' ul li.item > .inner .name > { font-size: ' + setting['textSize'] + 'px; } '; // Sửa chỗ này để overwrite các ông khác.
    }

/*    if (isHadValue(setting['spaceTextIcon']))*/
/*        addHtml += cssNaviPrefix + ' ul li.item .icon, ' + cssNaviPrefix + ' ul li.item .image { height: ' + (21 + (setting['spaceTextIcon'] - 2)) + 'px; } ';*/

    if (isHadValue(setting['dividerColor']))
        addHtml += cssNaviPrefix + ' ul li.item_divider { border-color: ' + setting['dividerColor'] + '; } ';

    if (isHadValue(setting['badgeColor']))
        addHtml += cssNaviPrefix + 'ul li.item_badge .inner .icon::before, ' + cssNaviPrefix + ' ul li.item_badge .inner .image::before { color: ' + setting['badgeColor'] + '; } ';

    if (isHadValue(setting['iconColor']))
        addHtml += cssNaviPrefix + 'ul li.item .icon i { color: ' + setting['iconColor'] + '; } ';

    if (isHadValue(setting['iconSize'])) {
        /*
        Login của đoạn này như sau (Chỉ áp dụng cho icon/Small image):
        1. Nếu setting chung icon size thì áp dụng cho cả icon và image
        2. Đối với level 2: Thì đặt chiều cao của icon và image bằng nhau và bằng iconSize + 4
         */
        addHtml += cssNaviPrefix + 'ul li.item .icon i { font-size: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .icon i { font-size: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .icon { height: ' + ( parseInt(setting['iconSize']) + 4) + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .info { width: calc(100% -   ' + parseInt(setting['iconSize']) + 'px); } ';

        addHtml += cssNaviPrefix + 'ul li.item .image img { height: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .image img { height: ' + setting['iconSize'] + 'px; } ';
        addHtml += cssNaviPrefix + 'ul li.item ul li.child .image { height: ' + ( parseInt(setting['iconSize']) + 4) + 'px; } ';

        if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
            addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { left: calc(50% - 26px); position: absolute; padding-top: ' + (16 - (setting['iconSize'] - 12) / 2) + 'px; } ';
    }

    // Don't display text ---------------------------------------------------------
    if (setting['textHide'] == "true" || setting['textHide'] == true) {
        addHtml += cssNaviPrefix + ' ul li.item > .inner .name { display:none; } ';
        addHtml += cssNaviPrefix + ' ul li.item > .inner .description { display:none; } ';
        /* if (setting['layout'] !=  NAVIGLOBAL['LAYOUT']['FAB'])
            addHtml += cssNaviPrefix + 'ul li.item .inner { padding-top: ' + ((setting['height'] - 50) / 2 + 8 + (setting['textSize'] / 2)) + 'px } ';

         */

        if (setting['layout'] != NAVIGLOBAL['LAYOUT']['FAB']) {
            let isVertical = false;
            if (isMobileMode())
                if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER']
                    || setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']
                    || setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM']
                    || setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']
                )
                    isVertical = true;

            if (!isMobileMode()) // Desktop mode
                if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP']
                    || setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']
                    || setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']
                    || setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']
                )
                    isVertical = true;

            if (isVertical) {
                let itemHeight = (parseInt(setting['height']) - setting['textSize']);

                /* TODO: Cần chỉnh chỗ này, nếu như có padding thì phải phình to ra chứ? */

                addHtml += cssNaviPrefix + ' ul li.item { height: ' + itemHeight + 'px } ';
                addHtml += cssNaviPrefix + '{ height: ' + itemHeight * dragdrop.length + 'px } ';

            }
        }
    }


    return addHtml;
}


var generateCSS_UI_Level1_Background = function ( setting, cssNaviPrefix, section_setting ) {
    //debugConsole("3.generateCSS_UI_Level1_Background");

    var addHtml = "";

    // Background ---------------------------------------------------------------
    if (isSettingBeTrue(setting['level1BackgroundHide'])) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + '{ background: initial; } ';
        addHtml += cssNaviPrefix + '{ box-shadow: none !important; } ';
    }else {
        if (isHadValue(setting['backgroundImage'])) {
            if (setting['backgroundImage'].includes("?")) {
                // Xử lý duy nhất trường hợp có opacity cho background Image
                var bg = setting['backgroundImage'].split("?");
                var bgImage = bg[0];
                var bgOpacity = parseInt(bg[1]);
                if (bgOpacity != 0) {
                    addHtml += cssNaviPrefix + '{ background-image: url("' + bgImage + '"); background-size: cover; } ';
                    addHtml += cssNaviPrefix + '{ background-color: ' + hexToRgba(setting['backgroundColor'], 1 - (bgOpacity / 100)) + '; background-blend-mode: hue; } ';
                } else {
                    addHtml += cssNaviPrefix + '{ background: ' + setting['backgroundColor'] + ' } ';
                    addHtml += cssNaviPrefix + '{ background-image: url("' + bgImage + '"); background-size: cover; } ';
                }
            } else {
                addHtml += cssNaviPrefix + '{ background: ' + setting['backgroundColor'] + ' } ';
            }
        } else { // Nếu ko có background thì dùng màu bình thường.
            if (isHadValue(setting['backgroundColor']))
                addHtml += cssNaviPrefix + '{ background: ' + setting['backgroundColor'] + ' } ';
        }
    }

    if (! isSettingBeTrue(setting['level1Dropshadow'], true)) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' { box-shadow: none !important; } ';
    }

    // Height
    addHtml += cssNaviPrefix + 'ul li.item { height: ' + setting['height'] + 'px } ';

    // Curve (Border-radius)
    if (isHadValue(setting['layout'])) {
        if (setting['layout'] == NAVIGLOBAL['LAYOUT']['DEFAULT'] || setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) {
            addHtml += cssNaviPrefix + '{ border-radius: ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px 0px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { border-radius: ' + setting['borderRadius'] + 'px; } ';
        }
        else
            addHtml += cssNaviPrefix + '{ border-radius: ' + setting['borderRadius'] + 'px } ';

        if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING'])
                addHtml += cssNaviPrefix + ' ul li ul.children { border-radius: ' + setting['borderRadius'] + 'px; } ';

        if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FAB']) {
            addHtml += cssNaviPrefix + ' ul li.item { border-radius: ' + setting['borderRadius'] + 'px; } ';
            // Nếu là float button thì level có border-radius: 1/2
            addHtml += cssNaviPrefix + ' ul li ul.children { border-radius: ' + (setting['borderRadius'] / 2) + 'px;} ';
        }

    }

    if (isHadValue(setting['opacity']))
        addHtml += cssNaviPrefix + '{ opacity: ' + (setting['opacity'] / 100) + ' } ';

    return addHtml;
};

var generateCSS_UI_Level2 = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting ) {
    //debugConsole("5.generateCSS_UI_Level2");

    var addHtml = "";

    if (isHadValue(setting['submenuTextColor'])) {
        addHtml += cssNaviPrefix + ' ul li.item ul li.child .name { color: ' + setting['submenuTextColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li.item a { color: ' + setting['submenuTextColor'] + '; } ';
        addHtml += cssNaviPrefix + ' ul li.item ul li.child .description { color: ' + setting['submenuTextColor'] + '; } ';
    }

    if (isHadValue(setting['submenuIconColor']))
        addHtml += cssNaviPrefix + ' ul li.item ul li.child .icon i { color: ' + setting['submenuIconColor'] + '; } ';

    if (isSettingBeTrue(setting['level2BackgroundHide'])) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' ul li ul.children { background: initial; } ';
        addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: none !important; } ';
    }else {
        if (isHadValue(setting['submenuBackgroundColor']))
            addHtml += cssNaviPrefix + ' ul li ul.children { background: ' + setting['submenuBackgroundColor'] + ' } ';
    }

    if (! isSettingBeTrue(setting['level2Dropshadow'], true)) { // Nếu không có nền thì bỏ nền và bỏ bóng.
        addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: none !important; } ';
    }

    if (isHadValue(setting['submenuDividerColor']))
        addHtml += cssNaviPrefix + ' ul li.child_divider { border-color: ' + setting['submenuDividerColor'] + '; } ';

    return addHtml;
};

var generateCSS_Publish = function (setting, cssNaviPrefix, section_setting) {
    //debugConsole("7.generateCSS_Publish");

    var addHtml = "";

    addHtml += ' @media only screen and (max-width: 768px) { ';
        if (setting['mobileDisplay'] == "false" || setting['mobileDisplay'] == false)
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
        if( !isMobileMode() )
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
    addHtml += ' } ';

    addHtml += ' @media only screen and (min-width: 769px) { ';
        if (setting['desktopDisplay'] == "false" || setting['desktopDisplay'] == false) {
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
        }
        if( isMobileMode() )
            addHtml += cssNaviPrefix + ' { display: none !important; } ';
    addHtml += ' } ';

    return addHtml;
};

var generateCSS_Position = function (setting, cssNaviPrefix, section_setting) {
    //debugConsole("8.generateCSS_Position");

    var addHtml = "";

    addHtml += ' @media only screen and (max-width: 768px) {';

    if (setting['mobileAutoHide'] == "true" || setting['mobileAutoHide'] == true) {
        if (setting['mobileDisplay'] == "true" || setting['mobileDisplay'] == true)
            scrollToHide("mobile", cssNaviPrefix);
    }
    addHtml += '} ';

    addHtml += ' @media only screen and (min-width: 769px) {';

    if (setting['desktopAutoHide'] == "true" || setting['desktopAutoHide'] == true) {
        if( setting['desktopDisplay'] == "true" || setting['desktopDisplay'] == true )
            if (setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']
                && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']
                && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']
                && setting['desktopPosition'] != NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']
            )
                scrollToHide("desktop", cssNaviPrefix);
    }

    addHtml += '} ';

    return addHtml;
};

var generateCSS_Advance = function (setting, cssNaviPrefix, naviman_appItem, embed_id, section_setting) {
    //debugConsole("9.generateCSS_Advance");

    var addHtml = "";

    // Global JS / jQuery ---------------------------------------------------------
    var jsScript = document.createElement('script');
    jsScript.textContent = clearCSS_JS(setting['jsCode']);
    document.body.appendChild(jsScript);

    var jsNaviScript = document.createElement('script');
    jsNaviScript.textContent = standardizeFunctionString( clearCSS_JS(setting['jsNaviCode']) );
    document.body.appendChild(jsNaviScript);

    // CSS ---------------------------------------------------------
    naviman_appItem.insertAdjacentHTML('beforebegin', '<style>' + standardizeCSS(clearCSS_JS(setting['cssCode']), embed_id) + '</style>');
    naviman_appItem.insertAdjacentHTML('beforebegin', '<style>' + clearCSS_JS(setting['cssCodeGlobal']) + '</style>');

    // zIndex  ------------------------------------------------------
    if (isHadValue(setting['zIndex']))
        addHtml += cssNaviPrefix + ' { z-index: '+ setting['zIndex'] +'; } ';

    return addHtml;
};

var generateCSS_FixByLayout = function (setting, cssNaviPrefix, dragdrop, section_setting) {
    //debugConsole("6.generateCSS_FixByLayout");

    var addHtml = "";

    if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) {

        if (setting['highlightColor'].trim() != "")
            addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { background: ' + setting['highlightColor'] + '; } ';
        if (setting['highlightIconColor'].trim() != "")
            addHtml += cssNaviPrefix + ' ul li.item_primary > .inner i { color: ' + setting['highlightIconColor'] + '; } ';
    }

    if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
        if (setting['bottomMargin'] != "") {
            addHtml += cssNaviPrefix + ' { bottom: ' + setting['bottomMargin'] + 'px; } ';
        }
    }

    if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FAB']) {
        addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 16px; height: ' + parseInt(setting['height']) + 'px; width: ' + (parseInt(setting['height']) * dragdrop.length) + 'px; } ';

        //addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';
        //addHtml += cssNaviPrefix + 'ul li.item .inner { padding-top: ' + ((setting['height'] - 50) / 2 + 8 + (setting['textSize'] / 2)) + 'px } ';

        addHtml += cssNaviPrefix + ' ul li ul.children { left: initial; right: 0px; bottom: 4px; width: ' + setting['submenuWidth'] + 'px; } ';
        addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ';} ';


        if (setting['bottomMargin'] != "")
            addHtml += cssNaviPrefix + ' { bottom: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
    }

    return addHtml;
}

var generateCSS_UI_Common = function ( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting ) {
    var addHtml = "";

    // Logic: Nếu set height và kiểu left-right thì sẽ đặt một cái padding-top để nó căn vào giữa cho nó đẹp.
    //addHtml += cssNaviPrefix + ' ul > li.item .inner { padding-top: ' + ((setting['height'] - 50) / 2 + 7) + 'px } ';
    //addHtml += cssNaviPrefix + ' ul > li.left-right .inner { padding-top: 0px } ';


    // TODO: Chỗ này chưa ngon do nếu gap < 0 thì chỉ sống với top-down
    if (isHadValue(setting['spaceTextIcon'])) {
        if( setting['spaceTextIcon'] < 0 ) {
            addHtml += cssNaviPrefix + ' ul li.item .inner { gap: 0px }';
            addHtml += cssNaviPrefix + ' ul li.item .inner .info { margin-top: '+ setting['spaceTextIcon'] +'px }';
        }else
            addHtml += cssNaviPrefix + ' ul li.item .inner { gap: '+ setting['spaceTextIcon'] +'px }';
    }

    if( isUserLoggedIn() ) {
        addHtml += cssNaviPrefix + ' ul li.publish-show-logined { display: initial }';
        addHtml += cssNaviPrefix + ' ul li.publish-hide-logined { display: none }';
    }else {
        addHtml += cssNaviPrefix + ' ul li.publish-show-logined { display: none }';
        addHtml += cssNaviPrefix + ' ul li.publish-hide-logined { display: initial }';
    }


    return addHtml;
}

var getItemValue = function( item, keyName, defaultVal ) {
    if( item[keyName] != null )
        return item[keyName];
    return defaultVal;
}

var generateCSS_Level1_Width = function (setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting) {
    var addHtml = "";

    var fixPx = 0;
    var fixPercent = 0;
    var automationCount = 0;
    var maxAutomationCount = 0;

    dragdrop.forEach((item) => {
        var itemIsPublished = getItemValue(item, "ispublished", 1);
        var itemHideWhenLogined = getItemValue(item, "hidewhenlogined", 0);
        var itemShowWhenLogined = getItemValue(item, "showwhenlogined", 0);
        var itemWidthLayout = getItemValue(item, "widthlayout", 1);

        if( itemIsPublished == 0 )
            return;
        if( itemHideWhenLogined == 1 ) {
            if( isUserLoggedIn() )
                return;
        }

        if( itemShowWhenLogined == 1 ) {
            if( !(isUserLoggedIn()) )
                return;
        }

        if( itemWidthLayout == 14 )
            fixPx += parseInt( item["widthfix"] );

        if( itemWidthLayout == 2 ) fixPercent += 8.3333333333;
        if( itemWidthLayout == 3 ) fixPercent += 16.6666666666;
        if( itemWidthLayout == 4 ) fixPercent += 25;
        if( itemWidthLayout == 5 ) fixPercent += 33.3333333333;
        if( itemWidthLayout == 6 ) fixPercent += 41.6666666666;
        if( itemWidthLayout == 7 ) fixPercent += 50;
        if( itemWidthLayout == 8 ) fixPercent += 58.3333333333;
        if( itemWidthLayout == 9 ) fixPercent += 66.6666666666;
        if( itemWidthLayout == 10 ) fixPercent += 75;
        if( itemWidthLayout == 11 ) fixPercent += 83.3333333333;
        if( itemWidthLayout == 12 ) fixPercent += 91.6666666666;
        if( itemWidthLayout == 13 ) fixPercent += 100;

        if( itemWidthLayout == 15 ) fixPercent += 10;
        if( itemWidthLayout == 16 ) fixPercent += 20;
        if( itemWidthLayout == 17 ) fixPercent += 50;
        if( itemWidthLayout == 18 ) fixPercent += 100;

        if( itemWidthLayout == 20 ) {
            // Do nothing
        }

        if( itemWidthLayout == 1 )
            automationCount ++;

        if( fixPercent == 100 ) { // Nếu gặp một item tràn màn hình thì ngắt, lấy max để làm lưới cơ sở.
            if( automationCount > maxAutomationCount) {
                maxAutomationCount = automationCount;
                automationCount = 0;
            }
        }
    });

    if( automationCount == 0 && maxAutomationCount == 0 ) return "";
    if( maxAutomationCount > 0 ) automationCount = maxAutomationCount;

    if( fixPercent >= 100 ) fixPercent = 0;
    addHtml += cssNaviPrefix + ' ul li.item { width: calc( calc( '+ (100 - fixPercent ) +'% - '+ fixPx +'px) / '+ automationCount +') } ';
    return addHtml;
}

var generateCSS = function(naviman_appItem, embed_id, setting, dragdrop, isNaviSection, section_setting) {

    generateCSS_init(setting);

    let html = '<style>';
    let cssNaviPrefix = ' .' + embed_id + ' ';
    let idCssNaviPrefix = ' #' + embed_id + ' ';
    html += generateCSS_UI_Common( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );
    html += generateCSS_UI_Level1_Menuitems( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );
    html += generateCSS_UI_Level1_Background( setting, cssNaviPrefix, section_setting );
    html += generateCSS_paddingMargin( setting, cssNaviPrefix, section_setting );

    html += generateCSS_UI_Level2( setting, cssNaviPrefix, section_setting );
    html += generateCSS_FixByLayout( setting, cssNaviPrefix, dragdrop, section_setting );

    // Default is 100/item numbers
    //html += cssNaviPrefix + ' ul li.item { width: ' + (100 / dragdrop.length) + '%; } ';
    html += generateCSS_Level1_Width( setting, cssNaviPrefix, naviman_appItem, dragdrop, section_setting );

    html += generateCSS_Publish( setting, cssNaviPrefix, section_setting );
    html += generateCSS_Position( setting, cssNaviPrefix, section_setting );
    html += generateCSS_Advance( setting, cssNaviPrefix, naviman_appItem, embed_id, section_setting );

    if (setting['mobileDisplay'] == "true" || setting['mobileDisplay'] == true)
        html += generateCSS_FixForMobile(cssNaviPrefix, setting, dragdrop, section_setting);

    if (setting['desktopDisplay'] == "true" || setting['desktopDisplay'] == true)
        html += generateCSS_FixForDesktop(cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting);

    html += generateCSS_FixForHambuger(idCssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, embed_id, naviman_appItem);

    html += '</style>';

    naviman_appItem.insertAdjacentHTML('beforebegin', html);

    /*debugConsole("R:Setting ----------------------------");
    debugConsole(setting);*/
};
    var generateCSS_FixForMobile = function(cssNaviPrefix, setting, dragdrop, section_setting) {
    if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FAB'])
        return "";
    if (!isMobileMode())
        return "";

    var fixPositionBottom = function (setting, cssNaviPrefix, dragdrop, section_setting) {
        var addHtml = "";
        if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['BOTTOM']) { // Thêm footer padding-bottom

            // Fix: Thêm một khoảng trống ở dưới body, (nhưng nếu auto hide thì bỏ qua)
            if (setting['mobileAutoHide'] != "true" && setting['mobileAutoHide'] != true) {
                addHtml += ' body { padding-bottom: ' + (parseInt(setting['height']) + 0) + 'px; }';
            }
            // Fix: Hất bóng shadow lên.
            addHtml += cssNaviPrefix + ' { box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.05); } ';

            // Fix: Nếu padding-left, right được set, thì sub menu (level 2) vẫn phải full screen
            if( parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right']) > 0 ) {
                addHtml += cssNaviPrefix + 'ul li ul.children { width: calc( 100% + ' + (parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right'])) + 'px ); } ';
                if (parseInt(setting['settingPadding']['left']) > 0)
                    addHtml += cssNaviPrefix + 'ul li ul.children { left: -' + parseInt(setting['settingPadding']['left']) + 'px; } ';
            }

            // Fix: Nếu margin-left, right được set, set width của menu để không bị tràn
            if (setting['settingMargin']['left'] != 0 || setting['settingMargin']['right'] != 0) {
                addHtml += cssNaviPrefix + ' { width: calc( 100% - ' + (parseInt(setting['settingMargin']['left']) + parseInt(setting['settingMargin']['right'])) + 'px) }; ';
            }
        }
        return addHtml;
    };

    var fixPositionTop = function (setting, cssNaviPrefix, dragdrop, section_setting) {
        var addHtml = "";
        if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['TOP']) {
            addHtml += cssNaviPrefix + ' { bottom: initial; top:0px; } ';

            if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) // Nếu là loại sticky thì mới + thêm padding-top cho boddy
                addHtml += ' body {padding-top: ' + setting['height'] + 'px;} ';
            addHtml += cssNaviPrefix + ' ul li ul.children { bottom: initial; top: ' + (parseInt(setting['height']) + 0) + 'px; ' + BOX_SHADOW + ' } ';
            addHtml += cssNaviPrefix + ' { border-radius: 0px 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px } ';
            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px } ';

            // Fix: Float là loại thứ 3, ko phải FAB
            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != 0) {
                    addHtml += cssNaviPrefix + ' { bottom: initial; top: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                    addHtml += ' body {padding-top: ' + (parseInt(setting['height']) + parseInt(setting['bottomMargin']) + 8) + 'px} ';
                }
            }

            // Thêm cái line ở giữa level 1 và 2
            addHtml += cssNaviPrefix + ' ul li ul.children { border-top: solid 1px rgba(0,0,0,0.05); border-bottom:0px; } ';

            // Fix: Nếu padding-left, right được set, thì sub menu (level 2) vẫn phải full screen
            if( parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right']) > 0 ) {
                addHtml += cssNaviPrefix + 'ul li ul.children { width: calc( 100% + ' + (parseInt(setting['settingPadding']['left']) + parseInt(setting['settingPadding']['right'])) + 'px ); } ';
                if (parseInt(setting['settingPadding']['left']) > 0)
                    addHtml += cssNaviPrefix + 'ul li ul.children { left: -' + parseInt(setting['settingPadding']['left']) + 'px; } ';
            }

            // Fix: Nếu margin-left, right được set, set width của menu để không bị tràn
            if (setting['settingMargin']['left'] != 0 || setting['settingMargin']['right'] != 0) {
                addHtml += cssNaviPrefix + ' { width: calc( 100% - ' + (parseInt(setting['settingMargin']['left']) + parseInt(setting['settingMargin']['right'])) + 'px) }; ';
            }
        }
        return addHtml;
    };


    var fixPositionRightCenter = function (setting, cssNaviPrefix, dragdrop, section_setting) {
        var addHtml = "";
        if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER']) {
            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
            addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: -201px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: -8px } ';

            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != "") {
                    addHtml += cssNaviPrefix + ' { right: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                }
            }

            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {left: ' + (-(setting['submenuWidth']) - 1) + 'px; } ';

            /*if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';*/
        }
        return addHtml;
    };


    var fixPositionRightBottom = function (setting, cssNaviPrefix, dragdrop, section_setting) {
        var addHtml = "";
        if ( setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM'] )
        {
            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
            addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: -201px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: -8px } ';

            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != "") {
                    addHtml += cssNaviPrefix + ' { right: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                }
            }

            addHtml += cssNaviPrefix + ' { top: initial; bottom: 24px; } ';

            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {left: ' + (-(setting['submenuWidth']) - 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { margin-top: initial; bottom: 0px; top: initial; } ';

            /*if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';*/


        }
        return addHtml;
    };


    var fixPositionLeftCenter = function (setting, cssNaviPrefix, dragdrop, section_setting) {
        var addHtml = "";
        if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER']) {
            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
            addHtml += cssNaviPrefix + ' { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: 1px } ';

            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != "") {
                    addHtml += cssNaviPrefix + ' { left: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                }
            }

            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

            /*if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item .inner { padding: 8px 0px 0px 0px; } ';*/
        }
        return addHtml;
    };


    var fixPositionLeftBottom = function (setting, cssNaviPrefix, dragdrop, section_setting) {
        var addHtml = "";
        if (setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']) {
            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
            addHtml += cssNaviPrefix + ' { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.10); } ';
            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: 1px } ';

            if (setting['layout'] ==  NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != "") {
                    addHtml += cssNaviPrefix + ' { left: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                }
            }

            addHtml += cssNaviPrefix + ' { top: initial; bottom: 24px; } ';

            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

            addHtml += cssNaviPrefix + ' ul li.item { position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { margin-top: initial; bottom: 0px; top: initial; } ';

        }
        return addHtml;
    };

    let html = ' @media only screen and (max-width: 768px) {';
        html += fixPositionBottom(setting, cssNaviPrefix, dragdrop, section_setting);
        html += fixPositionTop(setting, cssNaviPrefix, dragdrop, section_setting);
        html += fixPositionRightCenter(setting, cssNaviPrefix, dragdrop, section_setting);
        html += fixPositionRightBottom(setting, cssNaviPrefix, dragdrop, section_setting);
        html += fixPositionLeftCenter(setting, cssNaviPrefix, dragdrop, section_setting);
        html += fixPositionLeftBottom(setting, cssNaviPrefix, dragdrop, section_setting);
    html += '}';
    return html;
};
    var generateCSS_FixForDesktop = function (cssNaviPrefix, setting, dragdrop, isNaviSection, section_setting) {
    if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FAB'])
        return "";
    if (isMobileMode())
        return "";

    var fixPositionBottomCenterFloat = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER_FLOAT']) {
            addHtml += cssNaviPrefix + ' { width: ' + (DESKTOP_MAX_WIDTH * 1.3) + 'px; } ';
            addHtml += cssNaviPrefix + ' { left: 50%; transform: translate(-50%, 0); } ';

            addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
            addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
        }
        return addHtml;
    };

    var fixPositionBottomCenter = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER']) {
            addHtml += cssNaviPrefix + ' { width: ' + (DESKTOP_MAX_WIDTH * 1.3) + 'px; } ';
            addHtml += cssNaviPrefix + ' { left: 50%; transform: translate(-50%, 0); } ';

            addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
        }
        return addHtml;
    };

    var fixPositionBottomRight = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT']) {
            addHtml += cssNaviPrefix + ' { width: ' + DESKTOP_MAX_WIDTH + 'px; left: initial; right: 16px; } ';

            addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
        }
        return addHtml;
    };

    var fixPositionBottomLeft = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_LEFT']) {
            addHtml += cssNaviPrefix + ' { width: ' + DESKTOP_MAX_WIDTH + 'px; left: 16px; } ';

            addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
        }
        return addHtml;
    };

    var fixPositionTopFull = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['TOP_FULL']) {
            addHtml += cssNaviPrefix + ' .navigation { width: ' + (DESKTOP_MAX_WIDTH * 2) + 'px; } ';
            addHtml += cssNaviPrefix + ' .navigation { left: initial; } ';

            addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; top: ' + (parseInt(setting['height']) + 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

            addHtml += ' body { padding-top: ' + (parseInt(setting['height']) + 0) + 'px; }';
        }

        return addHtml;
    };

    var fixPositionBottomFull = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_FULL']) {
            addHtml += cssNaviPrefix + ' .navigation { width: ' + (DESKTOP_MAX_WIDTH * 2) + 'px; } ';
            addHtml += cssNaviPrefix + ' .navigation { left: initial; } ';

            addHtml += cssNaviPrefix + ' ul li.item{ position: relative; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children{ left: initial; right: 0px; bottom: ' + (parseInt(setting['height']) + 1) + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';
        }

        return addHtml;
    };

    var fixWindowResize = function (setting, cssNaviPrefix, dragdrop, isNaviSection) {
        if (!isNaviSection) {
            window.addEventListener('resize', function (event) {
            });
        }
    }


    var fixPositionRightTop = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";

        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP']) {
            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; left: initial; right: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
            addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px 0px 0px ' + setting['borderRadius'] + 'px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: -201px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';
            if (setting['layout'] == NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: -8px } ';

            if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != "") {
                    addHtml += cssNaviPrefix + ' { right: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                }
            }

            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
                addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

            let submenuWidth = (-setting['submenuWidth'] - 1);
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';
        }
        return addHtml;
    };


    var fixPositionLeftTop = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']) {
            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; height: ' + ((parseInt(setting['height']) + 8) * dragdrop.length) + 'px } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { top: ' + ((windowHeight - ((parseInt(setting['height']) + 8) * dragdrop.length)) / 2) + 'px; }';
            addHtml += cssNaviPrefix + ' { border-radius: 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px 0px } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';
            if (setting['layout'] == NAVIGLOBAL['LAYOUT']['HIGHLIGHT'])
                addHtml += cssNaviPrefix + ' ul li.item_primary > .inner { margin-top: 0px; margin-left: 1px } ';

            if (setting['layout'] == NAVIGLOBAL['LAYOUT']['FLOATING']) {
                if (setting['bottomMargin'] != "") {
                    addHtml += cssNaviPrefix + ' { left: ' + (parseInt(setting['bottomMargin'])) + 'px; } ';
                    addHtml += cssNaviPrefix + ' { border-radius: ' + setting['borderRadius'] + 'px } ';
                }
            }

            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
                addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

            let submenuWidth = (-setting['submenuWidth'] - 1);
            submenuWidth = (parseInt(setting['height']) + 1);
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';
        }
        return addHtml;
    };


    var fixPositionLeftFullTop = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP']) {
            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
                addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

            let submenuWidth = (-setting['submenuWidth'] - 1);
            //if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP']) submenuWidth = (parseInt(setting['height']) + 1);
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';


            addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-left: ' + setting['height'] + 'px; } ';

            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; top: 0px; height: 100vh; padding-top: 16px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';

            addHtml += cssNaviPrefix + ' { padding-top: 16px; } ';

            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục
        }
        return addHtml;
    };


    var fixPositionLeftFullCenter = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']) {
            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
                addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

            let submenuWidth = (-setting['submenuWidth'] - 1);
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';

            addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-left: ' + setting['height'] + 'px; } ';

            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: initial; left: 0px; top: 0px; height: 100vh; padding-top: 16px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { left: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';


            let bodyPaddingTop = (window.innerHeight - (parseInt(setting['height']) + 8) * dragdrop.length) / 2;
            addHtml += cssNaviPrefix + ' { padding-top: ' + bodyPaddingTop + 'px; } ';


            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục

        }
        return addHtml;
    };


    var fixPositionRightFullTop = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP']) {
            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
                addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

            let submenuWidth = (-setting['submenuWidth'] - 1);
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';

            addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-right: ' + setting['height'] + 'px; } ';

            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: 0; left: initial; top: 0px; height: 100vh; padding-top: 16px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { right: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';

            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';

            addHtml += cssNaviPrefix + ' { padding-top: 16px; } ';

            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục

        }
        return addHtml;
    };


    var fixPositionRightFullCenter = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']) {
            if (isHadValue(setting['dividerColor']))
                addHtml += cssNaviPrefix + ' ul li.item_divider { border-right: 0px; margin-right: 0px; border-bottom: solid 1px ' + setting['dividerColor'] + '; margin-bottom: -1px; } ';

            if (setting['layout'] != NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) // Nếu là layout 2 thì ko làm việc này.
                addHtml += cssNaviPrefix + ' ul li.item .inner {width: initial; } ';

            let submenuWidth = (-setting['submenuWidth'] - 1);
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; } ';


            addHtml += ' body {width: calc(100% - ' + setting['height'] + 'px); margin-right: ' + setting['height'] + 'px; } ';

            addHtml += cssNaviPrefix + ' { width: ' + setting['height'] + 'px; right: 0; left: initial; top: 0px; height: 100vh; padding-top: 16px; } ';
            addHtml += cssNaviPrefix + ' ul li.item { width: ' + setting['height'] + 'px; height: ' + (parseInt(setting['height']) + 8) + 'px; } ';
            addHtml += cssNaviPrefix + ' { border-radius: 0px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { right: ' + (parseInt(setting['height']) + 1) + 'px; bottom: initial; margin-top: -' + (parseInt(setting['height']) + 8) + 'px; width: ' + VERTICAL_CHILDREN_WIDTH + 'px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children { ' + BOX_SHADOW + ' } ';

            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; left: ' + submenuWidth + 'px; } ';

            if (setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'])
                addHtml += cssNaviPrefix + ' { padding-top: 16px; } ';
            else if (setting['desktopPosition'] == 10) {
                let bodyPaddingTop = (window.innerHeight - (parseInt(setting['height']) + 8) * dragdrop.length) / 2;
                addHtml += cssNaviPrefix + ' { padding-top: ' + bodyPaddingTop + 'px; } ';
            }

            addHtml += cssNaviPrefix + ' ul li.item { width: 100%; min-width: 24px; } '; // Fix lỗi nếu padding quá lớn thì bị dồn cục

        }
        return addHtml;
    };

    var fixPositionNaviSection = function (setting, cssNaviPrefix, dragdrop) {
        var addHtml = "";
        if (true) {
            addHtml += cssNaviPrefix + ' { bottom: initial; top:0px; } ';

            //if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) // Nếu là loại sticky thì mới + thêm padding-top cho boddy
            //    addHtml += ' body {padding-top: ' + setting['height'] + 'px;} ';
            addHtml += cssNaviPrefix + ' ul li ul.children { bottom: initial; top: ' + (parseInt(setting['height']) + 0) + 'px; ' + BOX_SHADOW + ' } ';
            //addHtml += cssNaviPrefix + ' { border-radius: 0px 0px ' + setting['borderRadius'] + 'px ' + setting['borderRadius'] + 'px } ';

            // Thêm cái line ở giữa level 1 và 2
            addHtml += cssNaviPrefix + ' ul li ul.children { border-top: solid 1px rgba(0,0,0,0.05); border-bottom:0px; } ';
            addHtml += cssNaviPrefix + ' ul li ul.children {width: ' + setting['submenuWidth'] + 'px; } ';

        }
        return addHtml;
    };

    let html = ' @media only screen and (min-width: 769px) {';
    //--------------------------------------------------------

    if (!isNaviSection) {
        html += fixPositionBottomCenterFloat(setting, cssNaviPrefix, dragdrop);
        html += fixPositionBottomCenter(setting, cssNaviPrefix, dragdrop);
        html += fixPositionBottomRight(setting, cssNaviPrefix, dragdrop);
        html += fixPositionBottomLeft(setting, cssNaviPrefix, dragdrop);
        html += fixPositionBottomFull(setting, cssNaviPrefix, dragdrop);
        html += fixPositionRightTop(setting, cssNaviPrefix, dragdrop);
        html += fixPositionLeftTop(setting, cssNaviPrefix, dragdrop);
        html += fixPositionLeftFullTop(setting, cssNaviPrefix, dragdrop);
        html += fixPositionLeftFullCenter(setting, cssNaviPrefix, dragdrop);
        html += fixPositionRightFullTop(setting, cssNaviPrefix, dragdrop);
        html += fixPositionRightFullCenter(setting, cssNaviPrefix, dragdrop);
        html += fixPositionTopFull(setting, cssNaviPrefix, dragdrop);
    } else
        html += fixPositionNaviSection(setting, cssNaviPrefix, dragdrop);

    html += fixWindowResize(setting, cssNaviPrefix, dragdrop, isNaviSection);

    //--------------------------------------------------------
    html += '}';
    return html;
};
    var generateCSS_FixForHambuger = function (idCssNaviPrefix, setting, dragdrop, isNaviSection, section_setting, embed_id, naviman_appItem) {
    var addHtml = " ";
    if( getMenuKind(window.naviman_shopinfo, embed_id) != NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER'] )
        return;

    if (isHadValue(setting['submenuBackgroundColor']))
        addHtml += idCssNaviPrefix + ' ul.children { background: ' + setting['submenuBackgroundColor'] + '; } ';

    if (isHadValue(setting['submenuDividerColor']))
        addHtml += idCssNaviPrefix + ' ul.children ul.children { border-color: ' + setting['submenuDividerColor'] + '; } ';

    // Fix arrow icons to center of menu item (dynamic -> fixing)
    setTimeout(function(){
        const div = document.querySelector(idCssNaviPrefix + ' ul > li.is-parent-top');
        if( div != null ) {
            var html = '<style>';
            html += idCssNaviPrefix + ' ul > li.is-parent-top::after { top: '+ (div.clientHeight/2 - 10) +'px; } ';
            html += '</style>';

            naviman_appItem.insertAdjacentHTML('beforebegin', html);
        }
    }, 2000);

    return addHtml;
};

    var init = function () {
        // debugConsole(NAVIGLOBAL);
    };

    

var fixNotStickyMenu = function (naviman_appItem, shop, embed_id, section_setting) {

    if(section_setting.length === 0 ) return;
    if(section_setting['embed_id'] == '') return;
    if(section_setting['not_sticky'] == false || section_setting['not_sticky'] == "false" ) return;

    let html = '<style>';

    html += '#'+ embed_id +' { bottom: initial; top: initial;}';

    html += '</style>';
    naviman_appItem.insertAdjacentHTML('beforebegin', html);
}

var fixMegaMenu = function (naviman_appItem, shop, embed_id, section_setting) {

    /* Fix cho phần header trên desktop *****/
    if( getMenuKind(window.naviman_shopinfo, embed_id) != NAVIGLOBAL['MENU_KINDS']['SECTION_MEGAMENU'] )
        return;

    let html = '<style>';

    html += '#'+ embed_id + ' ul li ul.children { max-height: initial;  } ';
    html += '</style>';

    naviman_appItem.insertAdjacentHTML('beforebegin', html);
};

var fixNotStickyParents = function (naviman_app, naviItem, embed_id, section_setting) {

    var getSessionParent = function(session_parent) {
        var limitCount = 0;
        while( true ) {
            limitCount ++;
            if( limitCount >= 30 ) return null;
            if( session_parent.nodeName == "SECTION" )
                return session_parent;

            if( session_parent.nodeName == "MAIN" )
                return null;

            if( session_parent == document.body)
                return null;

            session_parent = session_parent.parentElement;
        }
    }

    var getBlockParent = function(session_parent) {
        var limitCount = 0;
        while( true ) {
            limitCount ++;
            if( limitCount >= 30 ) return null;
            if( session_parent.className.includes("shopify-block") )
                return session_parent;

            if( session_parent.nodeName == "MAIN" )
                return null;

            if( session_parent == document.body)
                return null;

            session_parent = session_parent.parentElement;
        }
    }

    var getPageWidthParent = function(session_parent) {
        var limitCount = 0;
        while( true ) {
            limitCount ++;
            if( limitCount >= 30 ) return null;
            if( session_parent.className.includes("page-width") )
                return session_parent;

            if( session_parent.nodeName == "MAIN" )
                return null;

            if( session_parent == document.body)
                return null;

            session_parent = session_parent.parentElement;
        }
    }

    var setting = naviItem["data"]["setting"];

    var session = getSessionParent(naviman_app);
    if( session != null ) {
        session.style.position = "relative";

        menuKind = getMenuKind(window.naviman_shopinfo, embed_id);

        /* Fix cho phần header trên desktop *****/
        if( menuKind == NAVIGLOBAL['MENU_KINDS']['SECTION_MEGAMENU'] ) {
            session.style.backgroundColor = setting['backgroundColor'];

            if( setting['level1BackgroundHide'] == false ) {
                session.style.boxShadow = "0px 4px 8px 0px rgba(0, 0, 0, 0.05)";
                document.getElementById(embed_id).style.boxShadow = "initial";
            }


        }

        /* Fix việc không bị đè các item này lên item khác *****/
        var zIndex = (50 - 1);
        if (isHadValue(setting['zIndex'])) zIndex = setting['zIndex'] - 1;
        session.style.zIndex = zIndex;

        if( setting['fixedTopScrolling'] == true || setting['fixedTopScrolling'] == "true" ) {
            session.style.position = "sticky";
            session.style.top = 0;

            if( setting["level1Dropshadow"] == false || setting["level1Dropshadow"] == 'false' ) {
                var stickyPageYOffset = session.offsetTop;
                window.onscroll = function () {
                    if (window.pageYOffset > stickyPageYOffset) {
                        session.style.boxShadow = "0px 4px 8px 0px rgba(0, 0, 0, 0.05)";
                    } else {
                        session.style.boxShadow = "initial";
                    }
                };
            }
        }
    }

    var shopify_block = getBlockParent(naviman_app);
    if( shopify_block != null ) {
        shopify_block.style.display = "flex";
    }

    // Nếu full width thì bỏ padding 2 bên đi
    if( section_setting['embed_is_full'] == true || section_setting['embed_is_full'] == "true" ) {
        var page_width = getPageWidthParent(naviman_app);
        if (page_width != null) {
            page_width.style.padding = "0px";
        }
    }
}

    var drawBottomNav = function (response, naviman_domain, var_shop, var_embed_id, section_setting = []) {

        var shop = var_shop;
        var embed_id = var_embed_id;

        var naviman_app = document.getElementById("naviman_app");
        if( embed_id != "" && (section_setting['not_sticky'] == true || section_setting['not_sticky'] == "true" ) ) {
            naviman_app = document.getElementById(embed_id + "-container");
        }


        var generateMenu_Children = function(children, naviItem, data, extSubmenu, isNaviSection, section_setting) {
    var index = 0;

    var html = '<ul class="'+ collectClasses( [' children ', getSubmenuClasses(extSubmenu)] )  +' " '+ getSubmenuStyles(extSubmenu, data) +'>';

    var desktopHover = isSettingBeTrue(naviItem["data"]["setting"]['desktopHover']);
    if (window.innerWidth <= 768) desktopHover = false;

    children.forEach((child) => {
        index++;

        var childKind = getItemKind(child);
        var childIsParent = getItemIsParent( child );
        var childDivider = getItemDivider( child );

        var childDividerStyle = getDividerStyles( 2, childDivider, {
            "dividercolor": getExtVariable(child, "dividercolor", ""),
            "dividersize": getExtVariable(child, "dividersize", ""),
            "dividertype": getExtVariable(child, "dividertype", "")
        }, data["setting"] );

        var childShowBadgeMode = getItemShowBadgeMode(child);

        var childClass = "child ";
        if (childDivider == 1) childClass += "child_divider ";
        childClass += getChildExClassOfBadge( child );

        var childUrl = naviLanguage.stringByLanguage(child["url"]);
        var isTel = isItemTel( childUrl );
        var isSMS = isItemSMS(childUrl);

        /*** Một số cái sẽ dùng chung cho tất cả các menu item *************************************/
        var childExtTextColor = getExtVariable(child, "textcolor", "");
        var childExtTextSize = getExtVariable(child, "textsize", "");
        var childExtIconColor = getExtVariable(child, "iconcolor", "");
        var childExtIconSize = getExtVariable(child, "iconsize", "");
        var childExtBackgroundColor = getExtVariable(child, "backgroundcolor", "");
        var childExtBackgroundImage = getExtVariable(child, "backgroundimage", "");

        var childExtWidth = getExtWidth(child);
        var childExtPosition = getExtPosition(child);

        var childExtAlign = getExtVariable(child, "align", "inherit");
        var childExtClassname = getExtVariable(child, "classname", "");
        var childExtAnimation = getExtVariable(child, "animation", "");
        var childExtDisplayLayout = getExtVariable(child, "displaylayout", "");
        if( childExtDisplayLayout == "" )
            childExtDisplayLayout = "layout-automatic";
        if( child["icon"] == "" && child["image"] == "" ) {
            childExtDisplayLayout = "text-only";
        }
        if( child["name"] == "" ) {
            if( child["icon"] == "" && child["image"] == "" )
                childExtDisplayLayout = "empty";
            else
                childExtDisplayLayout = "icon-image-only";
        }

        var childExtAttr = getExtVariable(child, "attr", "");

        /**** Dành riêng cho child ***********/
        // Nếu layout == automatic thì sẽ đổi thành left-right
        if( childExtDisplayLayout == "" ) childExtDisplayLayout = "left-right";
        /*************************************/

        var childExtIsPublished = getExtVariable(child, "ispublished", 1);
        var childExtHideWhenLogined = getExtVariable(child, "hidewhenlogined", 0);
        var childExtShowWhenLogined = getExtVariable(child, "showwhenlogined", 0);

        // Search: update 4 - Apply
        var childExtPadding = getPadding(parsePaddingMargin(getExtVariable(child, "padding", "")));
        var childExtMargin = getMargin(parsePaddingMargin(getExtVariable(child, "margin", "")));

        var childExtHeightFix = getExtHeight(getExtVariable(child, "heightfix", ""));

        var childExtIconboxStyle = getIconboxStyle(
            getExtVariable(child, "iconboxcolor", ""),
            getExtVariable(child, "iconboxpadding", ""),
            getExtVariable(child, "iconboxradius", "")
        );

        var childExtCSS = getExtVariable(child, "css", "");

        /*** Bắt đầu đoạn mã để draw code tất tất cả kind of menu **********************************/

        if( isOpenInbox( childUrl ) ) openInbox_loopHideFAB();

        var onclickFunc = 'return naviman.gotoUrl(event, this, ' + childIsParent + ', \'' + childUrl + '\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
        var onhoverFunc = 'return naviman.gotoUrl(event, this, ' + childIsParent + ', \'#\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
        var childOnClick = 'onclick="'+ onclickFunc +'" ';
        if( desktopHover )
            if( childIsParent ) {
                if( !(childExtClassname.includes('navi-nohover') || childExtClassname.includes('navi-hover') ) ) {
                    childOnClick += ' onMouseEnter="' + onhoverFunc + '" ';
                    //childOnClick += ' onMouseLeave="' + onhoverFunc + '" ';
                }
            }
        if (isTel || isSMS) childOnClick = "";

        var childStylePositive = "";
        if( isTel || isSMS ) childStylePositive = ' style="position:relative" ';

        var isParent = "";
        if( childIsParent )
            isParent = " is-parent ";

        var seoUrl = '';
        if(isElitePlan(window.naviman_shopinfo))
            seoUrl = '<a href="'+ getSEOUrl( childUrl ) +'" onclick="return false;">';

        html += '<li ' +
            collectStyles([
                getStyleExtBackground(childExtBackgroundColor, childExtBackgroundImage, data, 2),
                getStyleExtAlign(childExtAlign),
                childExtWidth['style'],
                childExtPosition,
                childStylePositive,
                childExtPadding,
                childExtCSS,
                childDividerStyle,
                childExtHeightFix
            ]) +
            getAttr( childExtAttr ) +
            ' linkto="' + childUrl + '" class="' +
            collectClasses([childClass,
                childExtClassname,
                childExtDisplayLayout,
                getItemExClassOfKind( childKind ),
                getPublishClassed(childExtIsPublished, childExtHideWhenLogined, childExtShowWhenLogined),
                childExtWidth['class'],
                getClassesExtAlign( childExtAlign),
                isParent
            ])
            + '" ' + childOnClick + ' data-name="' + child["name"] + '" data-kind="' + childKind + '">';
        html += '<div class="inner ' + getAnimationClass(childExtAnimation) + '"' + collectStyles([childExtMargin]) + '>';
        html += '<span class="arrow"></span>';

        if( childShowBadgeMode == BADGE_ISCART_WITHCOUNT )
            html += '<span class="cart_count">'+ cartCount +'</span>';

        //html += itemMedia(child['icon'], child['image'], naviman_domain, getStyleExtIcon(childExtIconColor, childExtIconSize));

        html += itemMedia(
            child['icon'],
            child['image'],
            naviman_domain,
            getStyleExtIcon(childExtIconColor, childExtIconSize, childExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(child, "iconboxpadding", "") )),
            getIconBoxPaddingTop( getExtVariable(child, "iconboxpadding", "") ),
            childExtIconSize,
            getStyleExtAlign(childExtAlign),
            seoUrl
        );

        var divInfo = '<div class="info">';
        if( childExtDisplayLayout == "text-only" )
            divInfo = '<div class="info" '+ collectStyles(childExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(child, "iconboxpadding", "") )), +'>';

        html += divInfo;
        html += '<div class="flexcol">';

        if( seoUrl != '' ) html += seoUrl;
        html += '<span class="name"' + getStyleExtText(childExtTextColor, childExtTextSize) + '>' + naviLanguage.stringByLanguage(child["name"]) + '</span>';
        if( seoUrl != '' ) html += '</a>';

        if (child["description"] != "")
            html += '<div class="description"'+ getStyleExtText(childExtTextColor, "") +'>' + naviLanguage.stringByLanguage(child["description"]) + '</div>';
        html += '</div>'; // flexcol        

        html += '</div>'; // info

        html += getItemClickTelSMS(isTel, isSMS, childUrl);

        html += '</div>'; // inner

        if (childIsParent) html += generateMenu_Children(child["children"], naviItem, data, {
            "Animation": getExtVariable(child, "submenuanimation", ""),
            "Background": getExtVariable(child, "submenubackgroundcolor", ""),
            "BackgroundImage": getExtVariable(child, "submenubackgroundimage", ""),
        }, isNaviSection, section_setting
        );

        html += '</li>';
        /*** ENDOF: Đoạn mã để draw code tất tất cả kind of menu **********************************/

    });
    html += '</ul>';

    return html;
}

var generateMenu = function( data, naviItem, isNaviSection, section_setting ){
    var index = 0;
    var highLightItem = getItemHighlight(data);

    var sectionTitle = '';
    if( section_setting['embed_title'] != "")
        sectionTitle += '<h2>'+ section_setting['embed_title'] +'</h2>';

    var desktopHover = isSettingBeTrue(naviItem["data"]["setting"]['desktopHover']);
    if (window.innerWidth <= 768) desktopHover = false;

    var hamburgerClose = '<span class="hamburger_close" style="display: none"><i class="ri-close-line"></i></span>';

    var html = sectionTitle + hamburgerClose + '<ul class="navigation">';
    data["dragdrop"].forEach((item) => {
        index++;

        var itemKind = getItemKind(item);
        var itemIsParent = getItemIsParent( item );
        var itemDivider = getItemDivider( item );
        var itemDividerStyle = getDividerStyles( 1, itemDivider, {
            "dividercolor": getExtVariable(item, "dividercolor", ""),
            "dividersize": getExtVariable(item, "dividersize", ""),
            "dividertype": getExtVariable(item, "dividertype", "")
        }, data["setting"] );

        var itemShowBadgeMode = getItemShowBadgeMode(item);

        var isParent = "";
        if( itemIsParent )
            isParent = " is-parent-top ";

        var itemClass = "item ";
        if (itemDivider == 1) itemClass += "item_divider ";

        if (highLightItem == index) itemClass += "item_primary ";
        itemClass += getItemExClassOfBadge( item );

        var itemUrl = naviLanguage.stringByLanguage(item["url"]);
        var isTel = isItemTel( itemUrl );
        var isSMS = isItemSMS( itemUrl );

        /*** Một số cái sẽ dùng chung cho tất cả các menu item *************************************/
        var itemExtTextColor = getExtVariable(item, "textcolor", "");
        var itemExtTextSize = getExtVariable(item, "textsize", "");
        var itemExtIconColor = getExtVariable(item, "iconcolor", "");
        var itemExtIconSize = getExtVariable(item, "iconsize", "");
        var itemExtBackgroundColor = getExtVariable(item, "backgroundcolor", "");
        var itemExtBackgroundImage = getExtVariable(item, "backgroundimage", "");

        var itemExtWidth = getExtWidth(item);
        var itemExtPosition = getExtPosition(item);

        var itemExtAlign = getExtVariable(item, "align", "inherit");
        var itemExtClassname = getExtVariable(item, "classname", "");
        var itemExtAnimation = getExtVariable(item, "animation", "");
        var itemExtDisplayLayout = getExtVariable(item, "displaylayout", "");
        if( itemExtDisplayLayout == "" )
            itemExtDisplayLayout = "layout-automatic";
        if( item["icon"] == "" && item["image"] == "" ) {
            itemExtDisplayLayout = "text-only";
        }
        if( item["name"] == "" ) {
            if( item["icon"] == "" && item["image"] == "" )
                itemExtDisplayLayout = "empty";
            else
                itemExtDisplayLayout = "icon-image-only";
        }

        var itemExtAttr = getExtVariable(item, "attr", "");

        var itemExtIsPublished = getExtVariable(item, "ispublished", 1);
        var itemExtHideWhenLogined = getExtVariable(item, "hidewhenlogined", 0);
        var itemExtShowWhenLogined = getExtVariable(item, "showwhenlogined", 0);


        var itemExtHeightFix = getExtHeight(getExtVariable(item, "heightfix", ""));

        //console.log( item );
        var itemExtCSS = getExtVariable(item, "css", "");

        // Search: update 4 - Apply
        var itemExtPadding = getPadding(parsePaddingMargin(getExtVariable(item, "padding", "")));
        var itemExtMargin = getMargin(parsePaddingMargin(getExtVariable(item, "margin", "")));

        var itemExtIconboxStyle = getIconboxStyle(
            getExtVariable(item, "iconboxcolor", ""),
            getExtVariable(item, "iconboxpadding", ""),
            getExtVariable(item, "iconboxradius", "")
        );

        /*** Bắt đầu đoạn mã để draw code tất tất cả kind of menu **********************************/

        if (isOpenInbox(itemUrl)) openInbox_loopHideFAB();

        var onclickFunc = 'return naviman.gotoUrl(event, this, ' + itemIsParent + ', \'' + itemUrl + '\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
        var onhoverFunc = 'return naviman.gotoUrl(event, this, ' + itemIsParent + ', \'#\', \'' + naviItem["embed_id"] + '\', '+ isNaviSection +')';
        var itemOnClick = 'onclick="'+ onclickFunc +'" ';
        if( desktopHover )
            if( itemIsParent ) {
                if( !(itemExtClassname.includes('navi-nohover') || itemExtClassname.includes('navi-hover') ) ) {
                    itemOnClick += 'onMouseEnter="' + onhoverFunc + '" ';
                    itemOnClick += 'onMouseLeave="' + onhoverFunc + '" ';
                }
            }
        if (isTel || isSMS) itemOnClick = "";

        var itemStylePositive = "";
        if (isTel || isSMS) itemStylePositive = ' style="position:relative" ';

        var seoUrl = '';
        if(isElitePlan(window.naviman_shopinfo))
            seoUrl = '<a href="'+ getSEOUrl( itemUrl ) +'" onclick="return false;">';


        html += '<li ' +
            collectStyles([
                getStyleExtBackground(itemExtBackgroundColor, itemExtBackgroundImage, data, 1),
                getStyleExtAlign(itemExtAlign),
                itemExtWidth['style'],
                itemExtPosition,
                itemStylePositive,
                itemExtPadding,
                itemExtCSS,
                itemDividerStyle,
                itemExtHeightFix
            ]) +
            getAttr( itemExtAttr ) +
            ' linkto="' + itemUrl + '" class="' +
            collectClasses([itemClass,
                itemExtClassname,
                itemExtDisplayLayout,
                getItemExClassOfKind( itemKind ),
                getPublishClassed(itemExtIsPublished, itemExtHideWhenLogined, itemExtShowWhenLogined),
                itemExtWidth['class'],
                getClassesExtAlign( itemExtAlign ),
                isParent
            ])
            + '" ' + itemOnClick + ' data-name="' + item["name"] + '" data-kind="' + itemKind + '">';


        html += '<div class="inner ' + getAnimationClass(itemExtAnimation) + '"' + collectStyles([itemExtMargin]) + '>';
        html += '<span class="arrow"></span>';


        if (itemShowBadgeMode == BADGE_ISCART_WITHCOUNT)
            html += '<span class="cart_count">' + cartCount + '</span>';

        html += itemMedia(
            item['icon'],
            item['image'],
            naviman_domain,
            getStyleExtIcon(itemExtIconColor, itemExtIconSize, itemExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(item, "iconboxpadding", "") )),
            //getIconBoxPaddingTop( getExtVariable(item, "iconboxpadding", "") ),
            getExtVariable(item, "iconboxpadding", ""),
            itemExtIconSize,
            getStyleExtAlign(itemExtAlign),
            seoUrl
        );

        var divInfo = '<div class="info">';
        if( itemExtDisplayLayout == "text-only" )
            divInfo = '<div class="info" '+ collectStyles(itemExtIconboxStyle, getIconBoxPaddingTop( getExtVariable(item, "iconboxpadding", "") )), +'>';

        html += divInfo;
        html += '<div class="flexcol">';
        if( seoUrl != '' ) html += seoUrl;
        html += '<span class="name"' + getStyleExtText(itemExtTextColor, itemExtTextSize) + '>' + naviLanguage.stringByLanguage(item["name"]) + '</span>';
        if( seoUrl != '' ) html += '</a>';

        if (item["description"] != "")
            html += '<div class="description" '+ getStyleExtText(itemExtTextColor, "") +'>' + naviLanguage.stringByLanguage(item["description"]) + '</div>';
        html += '</div>'; // flexcol        
        html += '</div>'; // info

        html += getItemClickTelSMS(isTel, isSMS, itemUrl);

        html += '</div>'; // inner


        if (itemIsParent) html += generateMenu_Children(item["children"], naviItem, data, {
            "Animation": getExtVariable(item, "submenuanimation", ""),
            "Background": getExtVariable(item, "submenubackgroundcolor", ""),
            "BackgroundImage": getExtVariable(item, "submenubackgroundimage", ""),
        }, isNaviSection, section_setting
        );

        html += '</li>';
        /*** ENDOF: Đoạn mã để draw code tất tất cả kind of menu **********************************/

    });
    html += '</ul>';
    return html;
}

/******************************************************************************************************************/
var getAttr = function ( attr ) {
    if( attr == "" )
        return "";
    var attrArray = parseAttributes(decodeQuery( attr ));
    if( attrArray.length == 0 )
        return "";

    return formatAttributes( attrArray );
}

var getExtHeight = function ( heightfix ) {
    if( heightfix == "" )
        return "";
    return ' height: ' + String(heightfix).strReplace("px", " ").strReplace("pt", " ") + 'px; ';
}

var getDividerStyles = function ( level = 1, itemDivider, itemExtDiver, setting ) {
    if (itemDivider != 1)
        return "";
    var styles = ' style="';

    var dividerDirection = "right-";
    if( level == 1 ) { // Nếu là level 1 thì chia một số trường hợp
        if (isMobileMode()) {
            //console.log("Mobile mode");
            if (
                setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_CENTER'] ||
                setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_CENTER'] ||
                setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['RIGHT_BOTTOM'] ||
                setting['mobilePosition'] == NAVIGLOBAL['MOBILE_POSITION']['LEFT_BOTTOM']
            ) dividerDirection = "bottom-";
        }
        else {
            if (
                setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP'] ||
                setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP'] ||
                setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP'] ||
                setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER'] ||
                setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'] ||
                setting['desktopPosition'] == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']
            ) dividerDirection = "bottom-";
        }
    } else // Nếu là level 2,3 thì chỉ có một trường hợp ngang thôi.
        dividerDirection = "bottom-";

    if( itemExtDiver["dividercolor"] != "" )
        styles += 'border-'+ dividerDirection +'color:' + itemExtDiver["dividercolor"] + ';';
    if( itemExtDiver["dividersize"] != "" )
        styles += 'border-'+ dividerDirection +'width:' + String(itemExtDiver["dividersize"]).strReplace("px", "").strReplace("pt", "") + 'px;';
    if( itemExtDiver["dividertype"] != "" )
        styles += 'border-'+ dividerDirection +'style:' + itemExtDiver["dividertype"] + ';';

    styles += '"';
    return styles;
}

var getSubmenuClasses = function (itemExtSubmenu) {
    if( itemExtSubmenu["Animation"] != "" )
        return getAnimationClass( itemExtSubmenu["Animation"] );
    return "";
}

var getSubmenuStyles = function (itemExtSubmenu, data) {
    /*var styles = ' style="';
    if( itemExtSubmenu["Background"] != "" )
        styles += 'background-color:' + itemExtSubmenu["Background"] + ';';
    if( itemExtSubmenu["BackgroundImage"] != "" )
        styles += ' background-image: url('+ itemExtSubmenu["BackgroundImage"] +'); background-size: cover;';
    styles += '"';
    return styles;*/
    return getStyleExtBackground(itemExtSubmenu["Background"], itemExtSubmenu["BackgroundImage"], data, 2);
}

var getIconBoxPaddingTop = function (iconBoxPadding) {
    var itemExtIconBox = parsePaddingMargin(iconBoxPadding);
    return itemExtIconBox.top;
}

var getIconboxStyle = function ( color, padding, radius ) {
    if( color == "" )
        return "";
    var styleCSS = "";
    styleCSS += 'background-color:' + color + ';';
    if( padding != "") {
        styleCSS += getPadding(parsePaddingMargin(padding));
        styleCSS += ' display: inline-block; ';
    }
    if( radius != "")
        styleCSS += 'border-radius:' + String(radius).strReplace("px", "").strReplace("pt", "") + 'px';
    return styleCSS;
}

var getPadding = function( padding ) {
    if( padding.top == 0 & padding.right == 0 & padding.bottom == 0 & padding.left == 0 )
        return "";
    return ' padding: '+ padding.top +'px '+ padding.right +'px '+ padding.bottom +'px '+ padding.left +'px; '
}

var getMargin = function( margin ) {
    if( margin.top == 0 & margin.right == 0 & margin.bottom == 0 & margin.left == 0 )
        return "";
    return ' margin: '+ margin.top +'px '+ margin.right +'px '+ margin.bottom +'px '+ margin.left +'px; '
}


var parsePaddingMargin = function ( paddingVars ) {
    var padding = {
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0,
    };
    /*console.log( paddingVars );
    if( paddingVars == null )
        return padding;*/
    if( paddingVars == "" )
        return padding;

    paddingVars = String(paddingVars).strReplace("px", " ").strReplace("pt", " ").strReplace(",", " ").strReplace("|", " ").strReplace(";", " ");

    // Tách chuỗi padding thành mảng các giá trị
    var values = paddingVars.split(' ').map(Number);

    // Gán giá trị vào các thuộc tính của đối tượng padding
    switch (values.length) {
        case 1:
            padding.top = values[0];
            padding.right = values[0];
            padding.bottom = values[0];
            padding.left = values[0];
            break;
        case 2:
            padding.top = values[0];
            padding.right = values[1];
            padding.bottom = values[0];
            padding.left = values[1];
            break;
        case 3:
            padding.top = values[0];
            padding.right = values[1];
            padding.bottom = values[2];
            padding.left = values[1];
            break;
        case 4:
            padding.top = values[0];
            padding.right = values[1];
            padding.bottom = values[2];
            padding.left = values[3];
            break;
    }
    return padding;
}

var getItemExClassOfKind = function ( itemKind ) {
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['ICON_IMAGE_TEXT'] )
        return " kind-icon-image-text ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['GROUP_TITLE'] )
        return " kind-group-title ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['BLANK_SPACE'] )
        return " kind-blank-space ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['BIG_IMAGE_TEXT'] )
        return " kind-big-image-text ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['CUSTOM_HTML'] )
        return " kind-custom-html ";
    if( itemKind == NAVIGLOBAL['ITEM_KINDS']['BUTTON'] )
        return " kind-button ";
}

var getPublishClassed = function ( itemExtIsPublished, itemExtHideWhenLogined, itemExtShowWhenLogined ) {
    var combinedClass = " ";
    if( itemExtIsPublished != 1 )
        combinedClass += "publish-hide ";
    if( itemExtHideWhenLogined == 1 )
        combinedClass += "publish-hide-logined ";
    if( itemExtShowWhenLogined == 1 )
        combinedClass += "publish-show-logined ";

    if( combinedClass.trim() == "" )
        return "";
    return combinedClass;
}

var getAnimationClass = function ( itemExtAnimation ) {
    if( itemExtAnimation != "" )
        return " animate__animated " + itemExtAnimation;
    return "";
}

var collectStyles = function ( styleArray ) {
    let combinedStyle = ' style="';

    for(var i = 0; i < styleArray.length; i ++ ) {
        let styles = styleArray[i].replace(/style="|"/g, '');
        combinedStyle += styles;
    }

    combinedStyle += '"';
    return removeExtraSpaces(combinedStyle);
}

var collectClasses = function ( classesArray ) {
    let combinedClasses = '';

    for(var i = 0; i < classesArray.length; i ++ ) {
        combinedClasses += classesArray[i] + ' ';
    }
    return removeExtraSpaces(combinedClasses);
}

var getStyleExtAlign = function (itemExtAlign) {
    var style = ' style="';
    if( itemExtAlign != "inherit") style += ' text-align: '+ itemExtAlign +'; ';
    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getClassesExtAlign = function (itemExtAlign) {
    var style = ' ';
    if( itemExtAlign != "inherit") style += ' align-' + itemExtAlign + ' ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getStyleExtBackground = function (itemExtBackgroundColor, itemExtBackgroundImage, data, menuLevel = 1) {
    var style = ' style="';

    if (itemExtBackgroundImage != "") {
        if( itemExtBackgroundImage.includes("?") ) {
            // Xử lý duy nhất trường hợp có opacity cho background Image
            var bg = itemExtBackgroundImage.split("?");
            var bgImage = bg[0];
            var bgOpacity = parseInt( bg[1] );

            if( bgOpacity != 0 ) {
                if( itemExtBackgroundColor == "") {
                    if(menuLevel == 1)
                        itemExtBackgroundColor = data["setting"]['backgroundColor'];
                    else
                        itemExtBackgroundColor = data["setting"]['submenuBackgroundColor'];
                }
                style += ' background-image: url(\'' + bgImage + '\'); background-size: cover; ';
                style += ' background-color: ' + hexToRgba(itemExtBackgroundColor, 1 - (bgOpacity / 100)) + '; background-blend-mode: hue; ';
            }else {
                style += ' background-color: '+ itemExtBackgroundColor +'; ';
            }
        }else {
            style += ' background-color: '+ itemExtBackgroundColor +'; ';
            style += ' background-image: url('+ itemExtBackgroundImage +'); background-size: cover;';
        }
    }else
    { // Nếu ko có background thì dùng màu bình thường.
        if (itemExtBackgroundColor != "")
            style += ' background-color: '+ itemExtBackgroundColor +'; ';
    }


/*
    if( itemExtBackgroundColor != "") style += ' background-color: '+ itemExtBackgroundColor +'; ';
    if( itemExtBackgroundImage != "") style += ' background-image: url('+ itemExtBackgroundImage +'); background-size: cover;';

*/


    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getStyleExtText = function (itemExtTextColor, itemExtTextSize) {
    var style = ' style="';
    if( itemExtTextColor != "") style += ' color: '+ itemExtTextColor +'; ';
    if( itemExtTextSize != "") style += ' font-size: '+ itemExtTextSize +'px; ';
    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getStyleExtIcon = function (itemExtIconColor, itemExtIconSize, itemExtIconboxStyle = "", itemExtIconBoxPaddingTop = 0) {
    var style = ' style="';
    if( itemExtIconColor != "") style += ' color: '+ itemExtIconColor +'; ';
    if( itemExtIconSize != "") {
        style += ' font-size: ' + itemExtIconSize + 'px;';

        // Logic: Nếu có iconBox thì sẽ ko fix cái chiều cao của icon
        if( itemExtIconBoxPaddingTop == 0 )
            style += ' height: ' + itemExtIconSize + 'px; ';
        /*if( itemExtIconBoxPaddingTop != 0 )
            style += ' z-index:10; ';*/
    }

    if( itemExtIconboxStyle != "" ) style += itemExtIconboxStyle;
    style += '" ';
    if( style.trim() == 'style=""' )
        return '';
    return style;
}

var getExtPosition = function (item) {
    var position = getExtVariable(item, "position", 1);
    var style = ' style="';

    if (position == 2)
        style += "position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center;z-index: 0; ";
    if (position == 3)
        style += "position: absolute; right: 0; text-align: right; ";
    if (position == 4)
        style += "position: absolute; left: 0; text-align: left; ";

    style += '" ';
    if (style.trim() == 'style=""')
        return '';
    return style;
}

var getExtWidth = function( item ) {
    var widthLayout = getExtVariable(item, "widthlayout", 1);
    var itemExtWidth = "";

    if( widthLayout == 1 ) itemExtWidth = "";
    if( widthLayout == 2 ) itemExtWidth = "8.3333333333%";
    if( widthLayout == 3 ) itemExtWidth = "16.6666666666%";
    if( widthLayout == 4 ) itemExtWidth = "25%";
    if( widthLayout == 5 ) itemExtWidth = "33.3333333333%";
    if( widthLayout == 6 ) itemExtWidth = "41.6666666666%";
    if( widthLayout == 7 ) itemExtWidth = "50%";
    if( widthLayout == 8 ) itemExtWidth = "58.3333333333%";
    if( widthLayout == 9 ) itemExtWidth = "66.6666666666%";
    if( widthLayout == 10 ) itemExtWidth = "75%";
    if( widthLayout == 11 ) itemExtWidth = "83.3333333333%";
    if( widthLayout == 12 ) itemExtWidth = "91.6666666666%";
    if( widthLayout == 13 ) itemExtWidth = "100%";

    if( widthLayout == 15 ) itemExtWidth = "10%";
    if( widthLayout == 16 ) itemExtWidth = "20%";
    if( widthLayout == 17 ) itemExtWidth = "50%";
    if( widthLayout == 18 ) itemExtWidth = "100%";


    if( widthLayout == 14 ) {
        var widthfix = getExtVariable(item, "widthfix", "");
        if (widthfix != "")
            itemExtWidth = String(widthfix).replace("pt", "").replace("px", "") + "px";
    }

    if( widthLayout == 20 ) itemExtWidth = "auto";

    var itemExtWidthStyle = "";
    var itemExtWidthClass = "";
    if( itemExtWidth != "" ) {
        itemExtWidthStyle = ' width: ' + itemExtWidth + ';';
        itemExtWidthClass = ' widthfix ';
    }

    return {
        'width': itemExtWidth,
        'style' : itemExtWidthStyle,
        'class' : itemExtWidthClass
    };

}

function isString(value) {
    return typeof value === 'string' || value instanceof String
}

var getExtVariable = function( item, varName, defaultValue  ) {
    if( item[varName] != null ) {
        var val = item[varName];
        if( isString(val) )
            val = val.trim();

        val = platformValue( val );

        return val;
    }
    return defaultValue;
}

var getItemHighlight = function(data) { // Chỉ phục vụ cho loại highlight
    var highLightItem = 0;

    if (data["setting"]['layout'] == NAVIGLOBAL['LAYOUT']['HIGHLIGHT']) {
        if (data["dragdrop"].length == 7 || data["dragdrop"].length == 5 || data["dragdrop"].length == 3)
            highLightItem = (data["dragdrop"].length + 1) / 2;
    }
    return highLightItem;
}

var getItemKind = function (item) {
    var itemKind = 1;
    if(  item["kind"] != null )
        itemKind = item["kind"];
    return itemKind;
}

var getItemDivider = function (item) {
    var divider = 0;
    if(  item["divider"] != null )
        divider = item["divider"];
    return divider;
}

var getItemIsParent = function( item ) {
    var itemIsParent = false;
    if (typeof (item["children"]) !== 'undefined')
        if (item["children"].length > 0)
            itemIsParent = true;
    return itemIsParent;
}

var getItemShowBadgeMode = function (item) {
    var itemShowBadgeMode = BADGE_HIDE;
    if (item["badge"] == 1) {
        if( isHadValue (item["badgeiscart"]) ) {
            if (item["badgeiscart"] == 0)
                itemShowBadgeMode = BADGE_HIDE;
            else {
                itemShowBadgeMode = BADGE_ISCART_WITHCOUNT;
            }
        }else
            itemShowBadgeMode = BADGE_DOT;
    }
    return itemShowBadgeMode;
}

var getItemClickTelSMS = function (isTel, isSMS, item_url) {
    var html = " ";
    if( isTel || isSMS ) {
        html += '<a href="' + encodeBody(item_url.strReplace('[url]', window.location.href)) + '">';
        html += '<span class="telsms-click-spaces"></span>'
        html += '</a>';
    }
    return html;
}

var getItemExClassOfBadge = function (item) {
    var item_css = " ";
    if (item["badge"] == 1) {
        item_css += " item_badge";
        if( isHadValue (item["badgeiscart"]) ) {
            if (item["badgeiscart"] == 1) {
                item_css += " item_badge_withcount ";
                if (item["badgecartcount"] == 1)
                    item_css += "";
                else
                    item_css += " item_badge_withcount item_badge_withcount_hide";
            }
        }
    }
    else
        item_css += ""; // Do nothing
    return item_css;
};

var getChildExClassOfBadge = function (child) {
    var child_css = " ";
    if (child["badge"] == 1) {
        child_css += " child_badge";
        if( isHadValue (child["badgeiscart"]) ) {
            if (child["badgeiscart"] == 1) {
                child_css += " child_badge_withcount ";
                if (child["badgecartcount"] == 1)
                    child_css += "";
                else
                    child_css += " child_badge_withcount child_badge_withcount_hide";
            }
        }
    }
    else
        child_css += ""; // Do nothing
    return child_css;
};

var isOpenInbox = function ( item_url ) {
    if( item_url.length == 10 ) // open:Inbox
        if( item_url.substring(0, 10).toLowerCase() == "open:inbox" )
            return true;
    return false;
};

var isItemTel = function ( item_url ) {
    if( item_url.length >= 4 ) // tel
        if( item_url.substring(0, 4).toLowerCase() == "tel:" )
            return true;
    return false;
};

var isItemSMS = function ( item_url ) {
    if( item_url.length >= 4 ) // sms
        if( item_url.substring(0, 4).toLowerCase() == "sms:" )
            return true;
    return  false;
}

        var isNaviSection = (embed_id != '' )
        response.forEach((naviItem) => {

            navimanData.push( naviItem );

            var isDisplayed = true;

                if (!isBackendMode())
                if (naviItem["data"]["setting"]["displayGlobal"] == null || naviItem["data"]["setting"]["displayGlobal"] == "0") {
                    // Logic: Nếu nhưng ko bật nhưng là block thì vẫn hiển thị bình thường.
                    isDisplayed = false;
                    if( isNaviSection ) isDisplayed = true;
                }else {
                    let displayGlobalPages = naviItem["data"]["setting"]["displayGlobalPages"];
                    let currentTemplate = getCurrentTemplate();
                    if (!displayGlobalPages.includes(currentTemplate))
                        isDisplayed = false;
                }

            // Publish contain/ Don't contain Keyword  ------------------------------------------------------
            if (isHadValue(naviItem["data"]["setting"]['publishContainKeyword'])) {
                if( isUrlContain( naviItem["data"]["setting"]['publishContainKeyword'] ) )
                    isDisplayed = true;
                else
                    isDisplayed = false;
            }
            if (isHadValue(naviItem["data"]["setting"]['publishDontContainKeyword'])) {
                if( isUrlContain( naviItem["data"]["setting"]['publishDontContainKeyword'] ) )
                    isDisplayed = false;
                else
                    isDisplayed = true;
            }

            if (isHadValue(naviItem["data"]["setting"]['publishTriggerIDClass'])) {

                var elsArray = stringToArray( naviItem["data"]["setting"]['publishTriggerIDClass'] );
                elsArray.forEach(function(elsIdClass, index) {
                    console.log("Add trigger event to: " + elsIdClass);
                    var els = document.querySelectorAll(elsIdClass);
                    els.forEach(function(el) {
                        const newEl = removeAllEventListeners(el);
                        newEl.addEventListener("click", function() {
                            openNaviMenu(naviItem["embed_id"]);
                        }, false);
                    });
                });
            }

            if( isMobileMode() )
                if( naviItem["data"]["setting"]["mobileDisplay"] == false || naviItem["data"]["setting"]["mobileDisplay"] == 'false' )
                    isDisplayed = false;
            if( !isMobileMode() )
                if( naviItem["data"]["setting"]["desktopDisplay"] == false || naviItem["data"]["setting"]["desktopDisplay"] == 'false' )
                    isDisplayed = false;

            // console.log( naviItem["embed_id"] + " is displayed: " + isDisplayed );

            if (isDisplayed) {

                let data = naviItem["data"];

                if( document.getElementsByClassName("naviman_app_overlay").length == 0 )
                    naviman_app.insertAdjacentHTML('afterend', '<div class="naviman_app_overlay"> </div>');
                if( document.getElementsByClassName("naviman_app_overlay_global").length == 0 )
                    document.body.insertAdjacentHTML('afterend', '<div class="naviman_app_overlay_global"> </div>');

                var embedMarginStyle = "";

                if( section_setting["embed_margin"] != '0 0 0 0' && section_setting["embed_margin"].trim() != '' ) {
                    var margin = parsePaddingMargin(section_setting["embed_margin"]);
                    embedMarginStyle += ' margin: '
                        + margin.top + 'px '
                        + margin.right + 'px '
                        + margin.bottom + 'px '
                        + margin.left + 'px '
                    ;
                    //console.log(embedMarginStyle);
                }

                var attribute = "";
                if( naviItem["data"]["setting"]["attribute"] != null )
                    attribute = formatAttributes(parseAttributes( naviItem["data"]["setting"]["attribute"] ));

                var divNaviItem = '<div style="visibility: hidden;'+ embedMarginStyle +'" '+ attribute +' name="' + naviItem["name"] + '" id="'+ naviItem["embed_id"] +
                    '" class="naviItem ' + naviItem["embed_id"] + menuPositionClass( data ) + ' ' + getClassOfMenuKind(window.naviman_shopinfo, naviItem["embed_id"])  + '"></div>';
                naviman_app.insertAdjacentHTML('beforeend', divNaviItem);

                var naviman_appItem = document.getElementById(naviItem["embed_id"]);

                naviman_appItem.classList.add('naviman_layout' + data["setting"]['layout']);
                generateCSS(naviman_appItem, naviItem["embed_id"], data["setting"], data["dragdrop"], isNaviSection, section_setting);

                // Add visit call to server by increasing the file count
                if (!isBackendMode())
                    jsonp(naviman_domain + 'ajax-main.php?action=updateVisit' + '&shop=' + shop).then(function(data){});

                    naviman_appItem.insertAdjacentHTML('beforeend',
                    generateMenu(data, naviItem, isNaviSection, section_setting)
                );


                if( embed_id != "" && (section_setting['not_sticky'] == true || section_setting['not_sticky'] == "true" ) ) {
                    fixNotStickyMenu( naviman_appItem, shop, naviItem["embed_id"], section_setting );
                    fixMegaMenu( naviman_appItem, shop, naviItem["embed_id"], section_setting );

                    // Logic: Tìm đến section class gần nhất trên Shopify để đổi style -> Có thể có rủi ro nếu ko tìm thấy
                    fixNotStickyParents( naviman_app, response[0], embed_id, section_setting );
                }

                /* Chậm lại để cho CSS ổn định rồi thì mới hiện ra */
                setTimeout(() => {
                    var isStartVisibility = true;
                    if( isDisplayTrigger(naviItem) ) {
                        // console.log("This is only displayed when trigger : " + naviItem["embed_id"] );
                        isStartVisibility = false;
                    }

                    if( isBackendMode() )
                        isStartVisibility = true;

                    if( isStartVisibility )
                        addStyleToHeader( '#' + naviItem["embed_id"] + ' { visibility: visible !important }');
                }, 250);

                callbackPublicFunc_delay(drawBottomNav, naviItem["embed_id"]);

            } // isDisplayed
        });
    };

    var saveLog = function(logShop, logToUrl, logFromUrl, logItemName, logEmbedId, logPlatform ) {

    let tranferData = {
        shop: logShop,
        to_url: logToUrl,
        from_url: logFromUrl,
        item_name: logItemName,
        embed_id: logEmbedId,
        platform: logPlatform
    };

    const params = new URLSearchParams(tranferData);

    jsonp(naviman_domain + 'ajax-main.php?action=saveLog' + '&' + params.toString()).then(function(data){
    });
};
    var standalizeFuncWillVar = function (str) {

    str = str.strReplace('"', '');
    str = str.strReplace("'", "");

    // 1. Add "" for var
    let result = '';
    let parenthesesStack = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(' && (i === 0 || str[i - 1] !== '"')) {
            result += str[i] + '"';
            parenthesesStack.push('(');
        } else if (str[i] === ')' && (i === str.length - 1 || str[i + 1] !== '"')) {
            result += '"' + str[i];
            if (parenthesesStack.length > 0 && parenthesesStack[parenthesesStack.length - 1] === '(') {
                parenthesesStack.pop();
            } else {
                // Unbalanced parentheses
                return null;
            }
        } else {
            result += str[i];
        }
    }

    // Check for unbalanced parentheses
    if (parenthesesStack.length > 0) {
        return null;
    }

    return result;
}

var gotoUrl = function (event, item, is_parent, url, embed_id, isNaviSection) {

    var menuKind = getMenuKind(window.naviman_shopinfo, embed_id);

    if (!is_parent) {
        if (isBackendMode()) {
            if (url != "")
                showSnackbar("Link to: <u>" + url + "</u>");
            return false;
        }

        let logShop = naviman_shopinfo["shop"];
        let logFromUrl = window.location.href;
        let logItemName = item.dataset.name;
        let logEmbedId = embed_id; // Lỗi ở đây rồi
        let logPlatform = "M";
        if (window.innerWidth > 768)
            logPlatform = "D";
        let openNewTab = false;

        if (url.toLowerCase().includes("@new")) {
            openNewTab = true;
            url = url.replace(/@new/gi, '');
        }

        if (url.substring(0, 13).toLowerCase() == "https://m.me/")
            openNewTab = true;
        if (url.substring(0, 14).toLowerCase() == "https://wa.me/")
            openNewTab = true;

        let logDomain = "https://" + window.location.hostname;

        url = url.trim();

        if (url == "") { // Home page
            saveLog(logShop, logDomain, logFromUrl, logItemName, logEmbedId, logPlatform);
            if (openNewTab)
                window.open(logDomain);
            else
                window.location.href = logDomain;
        }

        if (url == "#") { // Do nothing
            saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);
            return false;
        }

        if (url.length > 1) {
            if (url.charAt(0) == "#") { // #gotoAnchor
                let logTo = logFromUrl + url;
                saveLog(logShop, logTo, logFromUrl, logItemName, logEmbedId, logPlatform);
                window.location.href = logTo;
            }

            if (url.length >= 4) // tel
                if (url.substring(0, 4).toLowerCase() == "tel:") {
                    //window.open( url );
                    //window.location.href = url;
                    return false;
                }

            if (url.length >= 4) // sms
                if (url.substring(0, 4).toLowerCase() == "sms:") {
                    //window.open( url );
                    //window.location.href = url;
                    return false;
                }

            if (url.length >= 5) // open
                if (url.substring(0, 5).toLowerCase() == "open:") {

                    jsFunction = url.strReplace(':', '');
                    saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);

                    // Open NaviMenu
                    if (url.length >= 13)
                        if (url.substring(0, 13).toLowerCase() == "open:navimenu") {
                            const func = splitTriggerFunction(jsFunction);
                            eval('naviman.' + func["functionName"] + '("' + func["variableName"] + '")');
                            return false;
                        }

                    // Open other functions such as: openMobileMenu
                    eval("naviman." + jsFunction)();
                    return false;
                }

            if (url.length >= 6) // share
                if (url.substring(0, 6).toLowerCase() == "share:") {
                    jsFunction = url.strReplace(':', '');
                    saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);
                    eval("naviman." + jsFunction)();
                    return false;
                }

            if (url.length >= 7) // scroll
                if (url.substring(0, 7).toLowerCase() == "scroll:") {
                    jsFunction = url.strReplace(':', '');

                    var isScrollOnPage = true;
                    if (url.length >= 10) if (url.substring(0, 10).toLowerCase() == "scroll:top")
                        isScrollOnPage = false;
                    if (url.length >= 13) if (url.substring(0, 13).toLowerCase() == "scroll:bottom")
                        isScrollOnPage = false;

                    if (isScrollOnPage)
                        jsFunction = standalizeFuncWillVar(jsFunction);

                    saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);

                    if (jsFunction.includes('(')) // Có biến
                        eval("naviman." + jsFunction);
                    else
                        eval("naviman." + jsFunction)();

                    return false;
                }

            if (url.length >= 7) // mailto
                if (url.substring(0, 7).toLowerCase() == "mailto:") {
                    window.open(url);
                    return false;
                }

            if (url.length >= 11) // javascript
                if (url.substring(0, 11).toLowerCase() == "javascript:") {
                    let jsFunction = url.substring(11, url.length);
                    jsFunction = jsFunction.strReplace('(', '').strReplace(')', '');

                    saveLog(logShop, 'js/' + jsFunction, logFromUrl, logItemName, logEmbedId, logPlatform);
                    console.log("Call function: " + jsFunction);

                    eval(jsFunction)();

                    event.preventDefault(); // Ko có tác dụng mấy
                    return false;
                }

            let isHadDomain = false;
            if (url.length >= 4)
                if (url.substring(0, 4).toLowerCase() == "http")
                    isHadDomain = true;

            if (!isHadDomain) {
                if (url.charAt(0) != "/")
                    url = "/" + url;
                url = logDomain + url;
            }

            saveLog(logShop, url, logFromUrl, logItemName, logEmbedId, logPlatform);
            if (openNewTab) {
                if (url.substring(0, 14).toLowerCase() == "https://wa.me/") {
                    // TODO: Need to optimize
                    console.log("Fixed for Whats App");
                    window.open(url, "WhatsApp", "width=200,height=100");
                } else
                    window.open(url);
            } else
                // Todo 19/6: Chỗ này cần kiểm tra xem với loại goto onpage thì sao.
            {
                window.location.href = url;
                if (url.includes('#')) {
                    setTimeout(function () {
                        location.reload();
                    }, 500);
                }
            }
        }
    } else {
        if (item.classList.contains("child"))
            showLevel3Items(item, isNaviSection, menuKind);
        else
            showLevel2Items(item, menuKind);
    }

    // Tránh việc gọi ông con thì lại gọi thêm ông bố
    event.stopPropagation();
};

var hideAllLevel3Items = function () {
    document.querySelectorAll('.naviman_app ul.children ul.children').forEach((item) => {
        item.style.display = "none";
    });
    document.querySelectorAll('.naviman_app ul.children ul.children').forEach((item) => {
        item.style.display = "none";
    });
};

var findIDofMenuItem = function (menuItem) {
    if (menuItem == null)
        return null;
    if (menuItem.parentElement == null)
        return null;
    if (menuItem.classList.contains("naviItem"))
        return menuItem.id;
    return findIDofMenuItem(menuItem.parentElement);
}

var showLevel3Items = function (menuItem, isNaviSection, menuKind) {

    var isMobileMode = (window.innerWidth <= 768);

    // Hide menu level 3 ======================
    if (!isMobileMode) {
        var is_showing = true;
        if (menuItem != null)
            is_showing = (menuItem.querySelector('ul.children').style.display === "block");
        if (is_showing) {
            menuItem.querySelector('ul.children').style.display = "none";
            return;
        }
    }
    // Hide menu level 3 ======================

    // Fix cho việc expand nội bộ từ level 3
    var isInnerExpand = false;
    if (isMobileMode)
        isInnerExpand = true;

    if (menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER'] || menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_DROPDOWN'])
        isInnerExpand = false;

    var ulParent = menuItem.parentElement;
    let ulChildrent = menuItem.querySelector('ul.children');

    // Nếu trên mobile thì sẽ có 1 cái overlay màu xám
    if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER'] || menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_DROPDOWN']))
        if (isInnerExpand) {
            var liTitle = document.createElement("li");
            liTitle.setAttribute("class", "overlay-container");
            liTitle.innerHTML = '<span class="overlay" onclick="return naviman.backToLevel1(event, this)"></span>';
            ulParent.appendChild(liTitle);
        }


    if (ulChildrent.style.display == "none" || ulChildrent.style.display == "" || ulChildrent.style.display == "initial") {
        hideAllLevel3Items();
        if (menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER'] || menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_DROPDOWN'])
            displayElement(ulChildrent, true, "inline-block");
        else
            displayElement(ulChildrent, true, "block");
        menuItem.classList.add("menu-expand");
        menuItem.classList.add("menu-expand-level2");
    } else {
        hideAllLevel3Items();
        menuItem.classList.remove("menu-expand");
        menuItem.classList.remove("menu-expand-level2");
        ulChildrent.style.display = "none";
    }

    if (isInnerExpand) {

        /*
        Phương án giải quyết: Tính một lần chiều cao của ulLength và lưu vào attribute.
         */
        var ulLength = 0;
        if (ulChildrent.getAttribute('ulLength'))
            ulLength = ulChildrent.getAttribute('ulLength');
        else {
            ulLength = 8;
            let liChildrent = ulChildrent.querySelectorAll("li.child");
            for (i = 0; i < liChildrent.length; i++)
                ulLength += liChildrent[i].offsetHeight;
            ulChildrent.setAttribute('ulLength', ulLength);
        }


        // Expand menu height
        menuItem.parentElement.style.height = ulLength + "px"; //(8 + ulChildrent.querySelector( 'li.child' ).offsetHeight * ulChildrent.querySelectorAll("li.child").length) + "px";
        menuItem.parentElement.scrollTop = 0;
        menuItem.parentElement.style.overflow = "hidden";

        if (!isFromNotSkickyMenu(menuItem))
            showNaviOverlay();


        // 1. Cập nhật chiều cao của level 3 bằng level 2
        ulChildrent.style.height = ulLength + "px";

        /*
        Phương án giải quyết: Nếu chưa fix chiều cao của ulChildrentTopFixed để sao cho top của level 3 bằng
        top của level 2 thì tính toán và lưu vào attribute.
         */
        if (ulChildrent.getAttribute('ulChildrentTopFixed'))
            ulChildrentTopFixed = ulChildrent.getAttribute('ulChildrentTopFixed');
        else {
            // 2. Cập nhật top của level 3 bằng 0/level 2
            ulChildrentTopFixed = ulChildrent.getBoundingClientRect().top - ulChildrent.parentElement.parentElement.getBoundingClientRect().top;
            ulChildrent.setAttribute('ulChildrentTopFixed', ulChildrentTopFixed);
        }

        // TODO IMPORTANT: Việc này xoá đi không biết có đúng không vì test lại thì thế này mới đúng.
        /*if (isNaviSection == true || isNaviSection == "true")
            ulChildrentTopFixed = 0;*/
        if (isNaviSection == true || isNaviSection == "true")
            ulChildrentTopFixed = ulChildrentTopFixed - 10;

        ulChildrent.style.top = (-ulChildrentTopFixed) + "px";

        // 3. Đánh dấu là đã cập nhật rồi, ko cần update lại
        ulChildrent.style.zIndex = 3;

        // 4. Đôi khi ulChildrent.style.left cần update lại vì parent của nó có thể ở giữa màn hình.
        if (isMobileMode) { // Việc này chỉ xảy ra trên mobile mà thôi.    
            ulChildrent.style.left = (48 - ulChildrent.parentElement.getBoundingClientRect().left) + "px";
        }

    }

    // Nếu trên desktop thì sẽ expand ra và set width con=bố
    if (!isMobileMode) {

        var navimanId = findIDofMenuItem(menuItem);
        var navimanObj = null;
        for (var i = 0; i < navimanData.length; i++)
            if (navimanData[i]["embed_id"] == navimanId) {
                navimanObj = navimanData[i];
                break;
            }
        var setting = navimanObj["data"]["setting"];

        ulChildrent.parentElement.parentElement.style.overflow = "visible";

        if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER'] || menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_DROPDOWN']))
            ulChildrent.style.width = ulChildrent.parentElement.parentElement.offsetWidth + "px";

        // ở dưới
        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_RIGHT'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_LEFT'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_FULL'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['TOP_FULL'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['BOTTOM_CENTER_FLOAT']) {
            if (setting.subDirection == false || setting.subDirection == "false")
                ulChildrent.style.left = "-" + ulChildrent.parentElement.parentElement.offsetWidth + "px";
            else
                ulChildrent.style.left = ulChildrent.parentElement.parentElement.offsetWidth + "px";
            ulChildrent.style.overflow = "visible";
            ulChildrent.style.height = "fit-content";
            ulChildrent.style.top = "initial";
            ulChildrent.style.bottom = "0px";

            if (isNaviSection) {
                ulChildrent.style.top = "0px";
                ulChildrent.style.bottom = "initial";
            }
        }

        // bên phải
        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['RIGHT_FULL_CENTER']) {
            ulChildrent.style.left = "-" + ulChildrent.parentElement.parentElement.offsetWidth + "px";
        }

        // bên trái
        if (setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_TOP'] || setting.desktopPosition == NAVIGLOBAL['DESKTOP_POSITION']['LEFT_FULL_CENTER']) {
            ulChildrent.style.left = (ulChildrent.parentElement.parentElement.offsetWidth + 2) + "px";
        }

    }

}

var backToLevel1 = function (event, item) {

    // Hide all level 2
    var level1Childrens = item.parentElement.parentElement.getElementsByClassName("children");
    for (var i = 0; i < level1Childrens.length; i++) {
        displayElement(level1Childrens[i], false);
    }

    var parrent = item.parentElement.parentElement;
    parrent.style.height = "initial";
    parrent.style.overflow = "auto";

    // Remove overlay
    var overlay = item.parentElement;
    overlay.remove();
    event.stopPropagation();
}

var resetAllItems = function () {
    document.querySelectorAll('.naviman_app ul.children').forEach((item) => {
        item.style.display = "none";
    });
    document.querySelectorAll('.naviman_app span.arrow').forEach((item) => {
        item.style.display = "none";
    });

    document.querySelectorAll('.naviman_app ul.children').forEach((item) => {
        item.style.height = "initial";
    });

    document.querySelectorAll('.naviman_app li.overlay-container').forEach((item) => {
        item.remove();
    });

    hideNaviOverlay();

}

var isFromNotSkickyMenu = function (menuItem) {
    var limitCount = 0;
    while (true) {
        limitCount++;
        if (limitCount >= 30) return false;

        if (menuItem.className.includes("section_naviman_app"))
            return true;

        if (menuItem == document.body)
            return false;

        menuItem = menuItem.parentElement;
    }
}

var showLevel2Items = function (menuItem, menuKind) {

    // 1. Kiểm tra xem có những menu item nào đang được hiện không
    var is_showing = true;
    if (menuItem != null)
        is_showing = (menuItem.querySelector('ul.children').style.display === "block");

    // 2. Xoá sạch trạng thái hiện tại đi
    if (!(menuKind == NAVIGLOBAL['MENU_KINDS']['STICKY_HAMBURGER'] || menuKind == NAVIGLOBAL['MENU_KINDS']['CONTEXT_DROPDOWN']))
        resetAllItems();

    // 3. Kiểm tra nếu chưa hiện thì hiện các ông con
    if (menuItem != null) {
        if (!is_showing) {
            displayElement(menuItem.querySelector('ul.children'), true);
            displayElement(menuItem.querySelector('span.arrow'), true);
            menuItem.querySelector('ul.children').style.overflow = "auto";
            menuItem.classList.add("menu-expand");
            menuItem.classList.add("menu-expand-level1");

            if (!isFromNotSkickyMenu(menuItem))
                showNaviOverlay();

        } else {
            displayElement(menuItem.querySelector('ul.children'), false);
            displayElement(menuItem.querySelector('span.arrow'), false);
            menuItem.classList.remove("menu-expand");
            menuItem.classList.remove("menu-expand-level1");
        }
    }
};


    var openMobileMenu = function() {
    const divMenu = document.querySelector('.header__icon--menu');

    callbackPublicFunc_delay(openMobileMenu);

    divMenu.addEventListener('click', () => {}); // Xem lai cho false nay
    divMenu.click();
};

var openCart = function() {
    const divMenu = document.querySelector('.header__icon--cart');

    callbackPublicFunc_delay(openCart);

    divMenu.addEventListener('click', () => {});
    divMenu.click();
};

var openSearch = function() {
    var isDawnFamily = true;
    if(document.querySelector('details-modal.header__search') == null)
        isDawnFamily = false;
    if(document.querySelector('details-modal.header__search').querySelector("details") == null)
        isDawnFamily = false;

    callbackPublicFunc_delay(openSearch);

    // Dawn & Craft
    if( isDawnFamily ) {
        const divMenuAll = document.querySelectorAll('details-modal.header__search details');
        divMenuAll.forEach((divMenu) => {
            // console.log(divMenu);
            divMenu.setAttribute("open", "true");
            divMenu.querySelector("input").focus();
        });
    }else {
        const divMenu = document.querySelector('.header__icon--search');
        divMenu.addEventListener('click', () => {});
        divMenu.click();
    }
};

var clickToElement = function ( cssClass ) {
    if( document.querySelector(cssClass) != null ) {
        setTimeout(() => {
            document.querySelector(cssClass).click();
            return false;
        }, "200");
    }else
        console.log("This theme is invalid. Can find: " + cssClass);
    return false;
};

var focusToElement = function ( cssClass ) {
    if( document.querySelector(cssClass) != null ) {
        setTimeout(() => {
            document.querySelector(cssClass).focus();
            return false;
        }, "200");
    }else
        console.log("This theme is invalid. Can find: " + cssClass);
    return false;
};

/***** Scroll to Up/OnPage ******************************************************************/

var scrollTop = function (topMargin = 0) {
    callbackPublicFunc_delay(scrollTop);
    window.scrollTo({ top: topMargin, behavior: "smooth" });
    return false;
};

var scrollOnPage = function ( cssOrID ) {
    var element = document.querySelector( cssOrID );
    if( element != null )
        element.scrollIntoView( {behavior: "smooth"});
    callbackPublicFunc_delay(scrollOnPage);
};

var scrollBottom = function (bottomMargin = 0) {
    callbackPublicFunc_delay(scrollBottom);
    window.scrollTo({ top: (document.body.scrollHeight - screen.height - bottomMargin), behavior: "smooth" });
    return false;
};

/***** Share/copy url ******************************************************************/
var shareCopyUrl = function () {
    navigator.clipboard.writeText(window.location.href);
    callbackPublicFunc_delay(shareCopyUrl);
    return false;
};

var shareFacebook = function () {
    var url = window.location.href;
    callbackPublicFunc_delay(shareFacebook);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
    return false;
};

var shareTweet = function () {
    var url = window.location.href;
    callbackPublicFunc_delay(shareTweet);
    window.open('https://twitter.com/share?url=' + url, '_blank');
    return false;
};


/***** Theme: Tailor https://themes.shopify.com/themes/tailor/styles/cotton ******************/
var openMenu_Tailor = function() {
    callbackPublicFunc_delay(openMenu_Tailor);
    return clickToElement('.header__controls .header__menu-button');
};
var openSearch_Tailor = function() {
    callbackPublicFunc_delay(openSearch_Tailor);
    return clickToElement('.header__controls .header__search-button');
};
var openCart_Tailor = function() {
    callbackPublicFunc_delay(openCart_Tailor);
    return clickToElement('.header__controls .header__cart-button');
};

/***** Theme: Symmetry https://themes.shopify.com/themes/symmetry/styles/beatnik ******************/
var openMenu_Symmetry = function() {
    callbackPublicFunc_delay(openMenu_Symmetry);
    return clickToElement(".mobile-nav-toggle");
};
var openSearch_Symmetry = function() {
    callbackPublicFunc_delay(openSearch_Symmetry);
    return clickToElement(".show-search-link");
};
var openCart_Symmetry = function() {
    callbackPublicFunc_delay(openCart_Symmetry);
    return clickToElement(".cart-link");
};

/***** Theme: Pipeline https://themes.shopify.com/themes/pipeline/styles/bright ******************/
var openMenu_Pipeline = function() {
    callbackPublicFunc_delay(openMenu_Pipeline);
    return clickToElement('[data-drawer-toggle="hamburger"]');
};
var openCart_Pipeline = function() {
    callbackPublicFunc_delay(openCart_Pipeline);
    return clickToElement('[data-drawer-toggle="drawer-cart"]');
};
var openSearch_Pipeline = function() {
    openMenu_Pipeline();
    setTimeout(() => {
        focusToElement('[type="search"]');
    }, "300");
    callbackPublicFunc_delay(openSearch_Pipeline);
    return;
};

/***** Theme: Empire https://themes.shopify.com/themes/empire/styles/supply ******************/
var openMenu_Empire = function() {
    callbackPublicFunc_delay(openMenu_Empire);
    return clickToElement('.site-header-menu-toggle--button');
};
var openSearch_Empire = function() {
    callbackPublicFunc_delay(openSearch_Empire);
    return clickToElement('.site-header-mobile-search-button--button');
};

/***** Theme: Impulse https://themes.shopify.com/themes/impulse/styles/modern ******************/
var openMenu_Impulse = function() {
    if(!document.documentElement.classList.contains("js-drawer-open")) {
        setTimeout(() => {
            document.querySelector('.js-drawer-open-nav').click();
        }, "200");
        callbackPublicFunc_delay(openMenu_Impulse);
    }
    return false;
};
var openSearch_Impulse = function() {
    callbackPublicFunc_delay(openSearch_Impulse);
    return clickToElement('.js-search-header');
};
var openCart_Impulse = function() {
    if(!document.documentElement.classList.contains("js-drawer-open")) {
        setTimeout(() => {
            document.querySelector('.js-drawer-open-cart').click();
        }, "200");

        callbackPublicFunc_delay(openCart_Impulse);
    }
    return false;
};

/***** Theme: Enterprise https://themes.shopify.com/themes/enterprise/styles/active ******************/
var openMenu_Enterprise = function() {
    callbackPublicFunc_delay(openMenu_Enterprise);
    return clickToElement('.main-menu__toggle');
};
var openCart_Enterprise = function() {
    callbackPublicFunc_delay(openCart_Enterprise);
    return clickToElement('#cart-icon');
};

/***** Theme: Warehouse https://themes.shopify.com/themes/warehouse/styles/metal ******************/
var openMenu_Warehouse = function() {
    callbackPublicFunc_delay(openMenu_Warehouse);
    return clickToElement('[data-action="toggle-menu"]');
};
var openCart_Warehouse = function() {
    callbackPublicFunc_delay(openCart_Warehouse);
    return clickToElement('[data-action="toggle-mini-cart"]');
};
var openSearch_Warehouse = function() {
    callbackPublicFunc_delay(openSearch_Warehouse);
    return clickToElement('[data-action="toggle-search"]');
};

/***** Theme: Focal https://themes.shopify.com/themes/focal/styles/carbon ******************/
var openMenu_Focal = function() {
    callbackPublicFunc_delay(openMenu_Focal);
    return clickToElement('[aria-controls="mobile-menu-drawer"]');
};
var openCart_Focal = function() {
    callbackPublicFunc_delay(openCart_Focal);
    return clickToElement('[aria-controls="mini-cart"]');
};
var openSearch_Focal = function() {
    callbackPublicFunc_delay(openSearch_Focal);
    return clickToElement('[aria-controls="search-drawer"]');
};

/***** Theme: Xclusive https://themes.shopify.com/themes/xclusive/styles/shoes ******************/
var openMenu_Xclusive = function() {
    callbackPublicFunc_delay(openMenu_Xclusive);
    return clickToElement('[aria-controls="nav"]');
};
var openCart_Xclusive = function() {
    callbackPublicFunc_delay(openCart_Xclusive);
    return clickToElement('[aria-controls="cart"]');
};
var openSearch_Xclusive = function() {
    callbackPublicFunc_delay(openSearch_Xclusive);
    return clickToElement('.search-compact');
};

/***** Theme: Palo Alto https://themes.shopify.com/themes/palo-alto/styles/vibrant ******************/
var openMenu_PaloAlto = function() {
    callbackPublicFunc_delay(openMenu_PaloAlto);
    return clickToElement('[aria-controls="nav-drawer"]');
};
var openCart_PaloAlto = function() {
    callbackPublicFunc_delay(openCart_PaloAlto);
    return clickToElement('[aria-controls="cart-drawer"]');
};
var openSearch_PaloAlto = function() {
    callbackPublicFunc_delay(openSearch_PaloAlto);
    return clickToElement('.mobile-menu .search-popdown__toggle');
};

/***** Theme: Borders https://themes.shopify.com/themes/borders/styles/raw ******************/
var openMenu_Borders = function() {
    callbackPublicFunc_delay(openMenu_Borders);
    return clickToElement( ".mobile-menu-button" );
};
var openCart_Borders = function() {
    callbackPublicFunc_delay(openCart_Borders);
    return clickToElement('[aria-controls="site-cart-sidebar"]');
};
var openSearch_Borders = function() {
    callbackPublicFunc_delay(openSearch_Borders);
    return clickToElement('[aria-controls="site-search-sidebar"]');
};

/***** Theme: Impact https://themes.shopify.com/themes/impact/styles/sound ******************/
var openMenu_Impact = function() {
    callbackPublicFunc_delay(openMenu_Impact);
    clickToElement('[aria-controls="header-sidebar-menu"]');
};
var openCart_Impact = function() {
    callbackPublicFunc_delay(openCart_Impact);
    clickToElement('[aria-controls="cart-drawer"]');
};
var openSearch_Impact = function() {
    callbackPublicFunc_delay(openSearch_Impact);
    clickToElement('[aria-controls="search-drawer"]');
};

/***** Theme: Broadcast https://themes.shopify.com/themes/broadcast/styles/clean ******************/
var openMenu_Broadcast = function() {
    callbackPublicFunc_delay(openMenu_Broadcast);
    return clickToElement('.header__mobile__hamburger');
};
var openCart_Broadcast = function() {
    callbackPublicFunc_delay(openCart_Broadcast);
    return clickToElement('.navlink--cart');
};
var openSearch_Broadcast = function() {
    callbackPublicFunc_delay(openSearch_Broadcast);
    return clickToElement('.navlink--search');
};

/***** Theme: Expanse https://themes.shopify.com/themes/expanse/styles/classic ******************/
var openMenu_Expanse = function() {
    callbackPublicFunc_delay(openMenu_Expanse);
    return clickToElement('.mobile-nav-trigger');
};
var openCart_Expanse = function() {
    callbackPublicFunc_delay(openCart_Expanse);
    return clickToElement('#HeaderCartTrigger');
};
var openSearch_Expanse = function() {
    callbackPublicFunc_delay(openSearch_Expanse);
    return clickToElement('.js-search-header');
};

/***** Theme: ShowTime https://themes.shopify.com/themes/showtime/styles/cooktime ******************/
var openMenu_ShowTime = function() {
    callbackPublicFunc_delay(openMenu_ShowTime);
    return clickToElement('[class="#main-navigation-mobile-icon"]');
};
var openCart_ShowTime = function() {
    callbackPublicFunc_delay(openCart_ShowTime);
    return clickToElement('cart-drawer-trigger');
};
var openSearch_ShowTime = function() {
    callbackPublicFunc_delay(openSearch_ShowTime);
    var input = document.querySelector('[class="#header-searchbar-input"]');

    input.addEventListener('touchstart', function() { input.focus(); });
    input.addEventListener('click', function() { input.focus(); });
    setTimeout(() => {
        input.focus();
    }, 500);
};


/***** Theme: Local https://themes.shopify.com/themes/local/styles/light ******************/
var openMenu_Local = function() {
    callbackPublicFunc_delay(openMenu_Local);
    return clickToElement('.mobile-menu-button');
};
var openCart_Local = function() {
    callbackPublicFunc_delay(openCart_Local);
    return focusToElement('.mobile-search input');
};
var openSearch_Local = function() {
    callbackPublicFunc_delay(openSearch_Local);
    return clickToElement('.mobile-cart-button');
};

/***** Theme: Avenue https://themes.shopify.com/themes/avenue/styles/casual ******************/
var openMenu_Avenue = function() {
    callbackPublicFunc_delay(openMenu_Avenue);
    return clickToElement('.toggleMenu');
};
var openCart_Avenue = function() {
    callbackPublicFunc_delay(openCart_Avenue);
    return clickToElement('#cart-count-mobile .cart-count-mobile');
};
/*var openSearch_Avenue = function() {
    return clickToElement('.mobile-cart-button');
};*/

/***** Theme: Parallax https://themes.shopify.com/themes/parallax/styles/aspen ******************/
var openMenu_Parallax = function() {
    callbackPublicFunc_delay(openMenu_Parallax);
    return clickToElement('.icon-menu');
};
var openCart_Parallax = function() {
    callbackPublicFunc_delay(openCart_Parallax);
    return clickToElement('.icon-cart');
};
var openSearch_Parallax = function() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    var input = document.querySelector('.mobile-search-bar .search-form__input');

    input.addEventListener('touchstart', function() { input.focus(); });
    input.addEventListener('click', function() { input.focus(); });
    setTimeout(() => {
        input.focus(); // Focus vào textbox sau khi sự kiện đã được xử lý
    }, 500);

    callbackPublicFunc(openSearch_Parallax);

    return false;
};

/******************************************************************************************/

var callPublicFunction = function (functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    if(typeof context[func] === "function") {
        return context[func].apply(context, args);
    } else {
        //console.log("Function not found: " + functionName);
    }
}

var scrollToHide = function (screen, cssNaviPrefix) {
    cssNaviPrefix = cssNaviPrefix.trim();
    let autoHide = false;
    if (screen == "mobile") {
        if (isMobileMode())
            autoHide = true;
    } else {
        if (!isMobileMode())
            autoHide = true;
    }

    let obj = document.getElementsByClassName(cssNaviPrefix.substr(1) )[0]; // SF-1234567890

    if (autoHide) {
        window.addEventListener('scroll',
            function (e) {
                var scrollTop = document.documentElement.scrollTop;
                if (scrollTop > SCROLL_TO_HIDE) {
                    if( obj.style.display != 'none' ) {
                        obj.style.display = 'none';
                        callPublicFunction("naviApp_scrollToHide_Hide", this);
                        callbackPublicFunc(scrollToHide);
                    }

                } else {
                    if( obj.style.display != 'block' ) {
                        obj.style.display = 'block';
                        callPublicFunction("naviApp_scrollToHide_Show", this);
                        callbackPublicFunc(scrollToHide);
                    }
                }
            });
    }

};

var openInbox_loopHideChat = function () {
    var isLoop = true;
    //console.log("loopHideChat");
    if( document.querySelector('#ShopifyChat').getAttribute("is-open") == "false" )
        if( document.querySelector('#ShopifyChat').style.visibility == "visible" ) {
            document.querySelector('#ShopifyChat').style.visibility = "hidden";
            isLoop = false;
        }

    callbackPublicFunc(openInbox_loopHideChat);

    if( isLoop ) {
        setTimeout(function () {
            openInbox_loopHideChat();
        }, 200);
    }
};

var openInbox_loopHideFAB = function () {
    var isLoop = true;

    if (document.querySelector('#ShopifyChat') != null) {
        document.querySelector('#ShopifyChat').style.visibility = "hidden";
        isLoop = false;
    }

    if (isLoop) {
        setTimeout(function () {
            openInbox_loopHideFAB();
        }, 200);
    }
};

var openInbox = function() {
    if( document.querySelector('#ShopifyChat') == null ) {
        console.log("Navi+: Shopify inbox is not installed. Read document <a target='_blank' href='https://help.shopifas.com/manual/faqs/open-chat-box-by-shopify-inbox'>here</a>");
    }

    var divMenu = document.querySelector('#ShopifyChat').shadowRoot.querySelector('.chat-toggle');
    document.querySelector('#ShopifyChat').style.visibility = "visible";
    divMenu.addEventListener('click', () => {});
    divMenu.click();

    callbackPublicFunc(openInbox);

    setTimeout(function() {
        openInbox_loopHideChat();
    }, 200);

};

var openInboxWithoutReplace = function() {
    if( document.querySelector('#ShopifyChat') == null ) {
        console.log("Navi+: Shopify inbox is not installed. Read document <a target='_blank' href='https://help.shopifas.com/manual/faqs/open-chat-box-by-shopify-inbox'>here</a>");
    }

    var divMenu = document.querySelector('#ShopifyChat').shadowRoot.querySelector('.chat-toggle');
    document.querySelector('#ShopifyChat').style.visibility = "visible";
    divMenu.addEventListener('click', () => {});
    divMenu.click();

    callbackPublicFunc(openInboxWithoutReplace);
};

var openShareMe = function(){
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: "Navi+ share",
            url: window.location.href
        })
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing:', error));
    }else
        console.log("This device does not support share directly!");

    callbackPublicFunc(openShareMe);
}


var callbackPublicFunc = function(func, embedID = "") {
    let callbackName = `Navi.${func.name}_Callback`;

    if (window.Navi)
    {
        if (typeof eval(callbackName) === 'function') {
            eval(callbackName + '("'+ embedID +'")' );
            console.log('Executed: '+ `${callbackName}` + '("'+ embedID +'") ');
        } else {
            // console.log(`${callbackName} is not found!`);
        }
    }else
    console.log(`The function ${callbackName} is not defined.`);
}

var callbackPublicFunc_delay = function(func, embedID = "") {
    setTimeout(() => { callbackPublicFunc(func, embedID); }, 500);
}
    
var asyncGetCart =  async function() {
    const result = await fetch(window.Shopify.routes.root + 'cart.json');

    if (result.status === 200) {
        return result.json();
    }
    throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
};

var updateCartCount = function( item_count ) {
    // Todo 19/6: Chỗ này cần test kỹ càng, ko work rồi vì nếu trộn lẫn thì sẽ ko chạy
    var isHideBadge = false;
    var span = document.querySelectorAll('li.item_badge_withcount span.cart_count');
    for (var i = 0; i < span.length; i++) {
        span[i].textContent = item_count;
        if( item_count == 0 ) {
            span[i].style.display = "none";
            isHideBadge = true;
        }
        else
            span[i].style.display = "initial";
    }

    var span = document.querySelectorAll('li.child_badge_withcount span.cart_count');
    for (var i = 0; i < span.length; i++) {
        span[i].textContent = item_count;
        if( item_count == 0 ) {
            span[i].style.display = "none";
            isHideBadge = true;
        }
        else
            span[i].style.display = "initial";
    }


    const root = document.querySelector(":root");
    if( isHideBadge )
        root.style.setProperty("--cart-count-text", '""');
    else
        root.style.setProperty("--cart-count-text", '"●"');

    callbackPublicFunc(updateCartCount);
};

var checkAndUpdateCartCount = function() {

    asyncGetCart().then( function(result) {
        updateCartCount(result.item_count);
    });
};

var setCartCount =  function(count)
{
    cartCount = count;
};

/*window.addEventListener('SCE:mutate', (event) => {
    updateCartCount();
});*/

/** Library for cart event listener ********************/
(function () {
    if (!window || !window.Shopify) return;

    const CartEvents = {
        add: "SCE:add",
        update: "SCE:update",
        change: "SCE:change",
        clear: "SCE:clear",
        mutate: "SCE:mutate",
    };

    const ShopifyCartURLs = [
        "/cart/add",
        "/cart/update",
        "/cart/change",
        "/cart/clear",
        "/cart/add.js",
        "/cart/update.js",
        "/cart/change.js",
        "/cart/clear.js",
    ];

    function isShopifyCartURL(url) {
        if (!url) return false;
        if (typeof url === 'string' || url instanceof String) {
            const path = url.split("/").pop();
            return ShopifyCartURLs.includes(`/cart/${path}`);
        }
        return false;
    }

    function updateType(url) {
        if (!url) return false;
        if (url.includes("cart/add")) {
            return "add";
        } else if (url.includes("cart/update")) {
            return "update";
        } else if (url.includes("cart/change")) {
            return "change";
        } else if (url.includes("cart/clear")) {
            return "clear";
        } else return false;
    }

    function dispatchEvent(url, detail) {
        if (typeof detail === "string") {
            try {
                detail = JSON.parse(detail);
                console.log( detail );
            } catch (err) {

            }
        }

        window.dispatchEvent(new CustomEvent(CartEvents.mutate, { detail }));
        const type = updateType(url);
        switch (type) {
            case "add":
                window.dispatchEvent(new CustomEvent(CartEvents.add, { detail }));
                break;
            case "update":
                window.dispatchEvent(new CustomEvent(CartEvents.update, { detail }));
                break;
            case "change":
                window.dispatchEvent(new CustomEvent(CartEvents.change, { detail }));
                break;
            case "clear":
                window.dispatchEvent(new CustomEvent(CartEvents.clear, { detail }));
                break;
            default:
                break;
        }
    }

    function XHROverride() {
        if (!window.XMLHttpRequest) return;

        const originalOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function () {
            const url = arguments[1];
            this.addEventListener("load", function () {
                if (isShopifyCartURL(url)) {
                    dispatchEvent(url, this.response);
                }
            });
            return originalOpen.apply(this, arguments);
        };
    }

    function fetchOverride() {
        if (!window.fetch || typeof window.fetch !== "function") return;
        const originalFetch = window.fetch;
        window.fetch = function () {
            const response = originalFetch.apply(this, arguments);
            //console.log(arguments);

            if (isShopifyCartURL(arguments[0])) {
                response.then((res) => {
                    res
                        .clone()
                        .json()
                        .then((data) => dispatchEvent(res.url, data));
                });
            }

            return response;
        };
    }

    fetchOverride();
    XHROverride();
})();


    /******** Active menu item: beg ***********/

function trimChar(str, ch) {
    var start = 0,
        end = str.length;

    while(start < end && str[start] === ch)
        ++start;

    while(end > start && str[end - 1] === ch)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function topContain( str, compare ) {
    str = str.toLowerCase().trim();
    compare = compare.toLowerCase().trim();
    // console.log(str + " | " + compare);

    if( str.trim() == "" )
        if( compare.trim() == "" )
            return true;
    if( str.trim() != "" )
        if( compare.trim() == "" )
            return false;

    if( str.length < compare.length )
        return false;

    if (str.substring(0, compare.length).includes(compare)) {
        return true;
    }
    return false;
}

/******** Active menu item: end ***********/

var generateActiveItems = function() {

    var pathName = trimChar(window.location.pathname, '/');

    var naviItems = document.querySelectorAll(".naviItem");
    for (navi_item = 0; navi_item < naviItems.length; navi_item++) { // Tìm tất cả các naviItem
        const listItems = naviItems[navi_item].querySelectorAll('li');
        //console.log(listItems);

        for (let i = 0; i < listItems.length; i++) { // Tìm trong tất cả các li

            /* Lọc ra url---------------------------------------------------------------*/
            var url = listItems[i].getAttribute("linkto");
            url = trimChar(url.replace(/^.*\/\/[^\/]+/, ''), '/');

            if( url != "" )
            if (topContain(pathName, url)) {
                listItems[i].classList.add("navi-active");

                var parent = listItems[i];
                for (parent_index = 0; parent_index < 10; parent_index++) {
                    parent = parent.parentElement;

                    if (parent.tagName == "LI")
                        parent.classList.add("navi-active");
                    if (parent.className.includes('naviItem'))
                        break;
                }
            }

        }
    }
}

var checkAndRelayout = function() {
    if( window.ShopifyAnalytics == null )
        return;

    if( window.ShopifyAnalytics.meta.page.customerId == null ) {
        // Do nothing
        // console.log("User is not logged in");
    }
    else {
        // console.log("User is logged in");
    }
}
    function setLocalStorage(key, value, ttl = 15000) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

function getLocalStorage(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
    }
    return item.value
}
    
var isDisplayTrigger = function (naviItem) {
    var data = naviItem["data"];
    if(typeof data["setting"]["displayTrigger"] == 'undefined')
        return false;

    if (data["setting"]["displayTrigger"] == 1 || data["setting"]["displayTrigger"] == "1" ) {
        return true;
    }

    return false;
}

function splitTriggerFunction(str) {
    // Sử dụng regex để tách tên hàm và biến
    const regex = /(\w+)\((.+)\)/;
    const match = str.match(regex);

    if (match) {
        const functionName = match[1]; // Tên hàm
        const variableName = match[2]; // Tên biến
        return {
            functionName,
            variableName
        };
    } else {
        return null; // Nếu chuỗi không hợp lệ
    }
}

var openNaviMenu = function( embedId ) {
    const element = document.querySelector("#" + embedId);

    if (element) {
        if( element.style.visibility != "visible" ) {
            showNaviOverlayGlobal();
            element.style.visibility = "visible";
        }
        else {
            hideNaviOverlayGlobal();
            element.style.visibility = "hidden";
        }
    }

    callbackPublicFunc(openNaviMenu);
};

    return {
        Name: "Naviman Libraries",
        drawBottomNav: drawBottomNav,
        init: init,
        gotoUrl: gotoUrl,
        backToLevel1: backToLevel1,

        clickToElement: clickToElement,
        focusToElement: focusToElement,

        // Trigger
        openNaviMenu: openNaviMenu,

        // public JS functions
        openMobileMenu: openMobileMenu,
        openCart: openCart,
        openSearch: openSearch,

        // Scroll
        scrollTop:scrollTop,
        scrollBottom:scrollBottom,
        scrollOnPage:scrollOnPage,

        // Share
        shareCopyUrl:shareCopyUrl,
        shareFacebook:shareFacebook,
        shareTweet:shareTweet,

        // Tailor - https://themes.shopify.com/themes/tailor/styles/cotton
        openMenu_Tailor: openMenu_Tailor,
        openSearch_Tailor: openSearch_Tailor,
        openCart_Tailor: openCart_Tailor,

        // Symmetry - https://themes.shopify.com/themes/symmetry/styles/beatnik
        openMenu_Symmetry: openMenu_Symmetry,
        openSearch_Symmetry: openSearch_Symmetry,
        openCart_Symmetry: openCart_Symmetry,

        // Enterprise - https://themes.shopify.com/themes/tailor/styles/cotton
        openMenu_Enterprise: openMenu_Enterprise,
        openCart_Enterprise: openCart_Enterprise,

        // Pipeline https://themes.shopify.com/themes/pipeline/styles/bright
        openMenu_Pipeline: openMenu_Pipeline,
        openSearch_Pipeline: openSearch_Pipeline,
        openCart_Pipeline: openCart_Pipeline,

        // Empire - https://themes.shopify.com/themes/empire/styles/supply
        openMenu_Empire: openMenu_Empire,
        openSearch_Empire: openSearch_Empire,

        // Impulse - https://themes.shopify.com/themes/impulse/styles/modern
        openMenu_Impulse: openMenu_Impulse,
        openSearch_Impulse: openSearch_Impulse,
        openCart_Impulse: openCart_Impulse,

        // Warehouse - https://themes.shopify.com/themes/impact/styles/sound
        openMenu_Warehouse: openMenu_Warehouse,
        openCart_Warehouse: openCart_Warehouse,
        openSearch_Warehouse: openSearch_Warehouse,

        // Focal - https://themes.shopify.com/themes/focal/styles/carbon
        openMenu_Focal: openMenu_Focal,
        openCart_Focal: openCart_Focal,
        openSearch_Focal: openSearch_Focal,

        // Xclusive - https://themes.shopify.com/themes/xclusive/styles/shoes
        openMenu_Xclusive: openMenu_Xclusive,
        openCart_Xclusive: openCart_Xclusive,
        openSearch_Xclusive: openSearch_Xclusive,

        // Palo Alto https://themes.shopify.com/themes/palo-alto/styles/vibrant
        openMenu_PaloAlto: openMenu_PaloAlto,
        openCart_PaloAlto: openCart_PaloAlto,
        openSearch_PaloAlto: openSearch_PaloAlto,

        // Borders https://themes.shopify.com/themes/borders/styles/raw
        openMenu_Borders: openMenu_Borders,
        openCart_Borders: openCart_Borders,
        openSearch_Borders: openSearch_Borders,

        // Impact - https://themes.shopify.com/themes/Impact/styles/metal
        openMenu_Impact: openMenu_Impact,
        openCart_Impact: openCart_Impact,
        openSearch_Impact: openSearch_Impact,

        // Broadcast - https://themes.shopify.com/themes/broadcast/styles/clean
        openMenu_Broadcast: openMenu_Broadcast,
        openCart_Broadcast: openCart_Broadcast,
        openSearch_Broadcast: openSearch_Broadcast,

        // Expanse - https://themes.shopify.com/themes/expanse/styles/classic
        openMenu_Expanse: openMenu_Expanse,
        openCart_Expanse: openCart_Expanse,
        openSearch_Expanse: openSearch_Expanse,

        // ShowTime - https://themes.shopify.com/themes/showtime/styles/cooktime
        openMenu_ShowTime: openMenu_ShowTime,
        openCart_ShowTime: openCart_ShowTime,
        openSearch_ShowTime: openSearch_ShowTime,

        // Local - https://themes.shopify.com/themes/local/styles/light
        openMenu_Local: openMenu_Local,
        openCart_Local: openCart_Local,
        openSearch_Local: openSearch_Local,

        // Avenue - https://themes.shopify.com/themes/avenue/styles/casual
        openMenu_Avenue: openMenu_Avenue,
        openCart_Avenue: openCart_Avenue,
        // openSearch_Avenue: openSearch_Avenue,

        // Parallax - https://themes.shopify.com/themes/parallax/styles/aspen
        openMenu_Parallax: openMenu_Parallax,
        openCart_Parallax: openCart_Parallax,
        openSearch_Parallax: openSearch_Parallax,

        // Work with other applications
        openInbox: openInbox,
        openInboxWithoutReplace: openInboxWithoutReplace,

        openShareMe: openShareMe,

        isHadValue: isHadValue, // TODO: No need publish this function

        // Cart
        setCartCount: setCartCount,
        asyncGetCart:asyncGetCart,
        checkAndUpdateCartCount:checkAndUpdateCartCount,
        updateCartCount:updateCartCount,
        generateActiveItems:generateActiveItems,
        checkAndRelayout:checkAndRelayout,

        showNaviOverlay:showNaviOverlay,
        hideNaviOverlay:hideNaviOverlay,

        showNaviOverlayGlobal:showNaviOverlayGlobal,
        hideNaviOverlayGlobal:hideNaviOverlayGlobal,

        isMobileMode: isMobileMode,
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,

        callbackPublicFunc: callbackPublicFunc

    };

})();

var Navi = Navi || {};


/** uigen/fix_by_cases.js ****************************************/
/*
Fix cho trường hợp click ra ngoài thì đóng toàn bộ menu, quay về trạng thái ban đầu mặc định
 */

document.onclick=function(event){

    if( typeof event.target.closest == "undefined" )
        return;

    if( event.target.closest(".naviman_app ul li ul.children") == null && event.target.closest(".naviman_app .naviItem") == null ) {
        document.querySelectorAll('.naviman_app ul li ul.children').forEach((item) => {
            item.style.display = "none";
        });

        naviman.hideNaviOverlay();
    }

}

/*
Fix cho việc hover chuột qua thì hiện lên luôn trên desktop.
 */
/** uigen/fix_by_cases.js END****************************************/


if (!naviman.isMobileMode()) {
    setTimeout(() => {
        var actions = document.getElementsByClassName("navi-hover");

        for (var i = 0; i < actions.length; i++) {
            actions[i].addEventListener("mouseover", function () {
                if (!this.classList.contains("navi-hover-active")) {
                    this.classList.add("navi-hover-active");
                    this.click();
                }
            });

            actions[i].addEventListener("mouseout", function () {
                if (this.classList.contains("navi-hover-active")) {
                    this.classList.remove("navi-hover-active");
                    this.click();
                }

            });
        }
    }, "1000");
}

// TODO IMPORTANT: Có thể là cái này không hoạt động khi mà loading chưa kịp naviman_app_overlay_global

setTimeout(() => {
    var overlay_global = document.querySelector(".naviman_app_overlay_global");
    if( overlay_global ) {
        overlay_global.addEventListener("click", function (event) {
            overlay_global.style.display = "none";
            document.querySelectorAll('.STICKY_HAMBURGER').forEach((item) => {
                item.style.visibility = "hidden";
                document.body.style.overflow = "initial";
            });
            event.preventDefault();
        });
    }

    var hamburgerMenus = document.querySelectorAll(".hamburger_close");
    hamburgerMenus.forEach(menu => {
        menu.addEventListener('click', function() {
            var overlay_global = document.querySelector(".naviman_app_overlay_global");
            if( overlay_global )
                overlay_global.click();
        });
    });

}, "3000");
// .naviman_app_overlay_global

/*
function setVHVWDimensions() {
    const vh = window.innerHeight; // Chiều cao của viewport
    const vw = window.innerWidth; // Chiều rộng của viewport

    console.log( vh );
    console.log( vw );

    // Thiết lập biến CSS
    document.documentElement.style.setProperty('--vh', `${vh}rem`);
    document.documentElement.style.setProperty('--vw', `${vw}rem`);
}

window.addEventListener('resize', setVHVWDimensions);
setVHVWDimensions(); */

var naviLanguage = (function(){

    var countryList = {
        'ab' : 'Abkhazian',
        'aa' : 'Afar',
        'af' : 'Afrikaans',
        'ak' : 'Akan',
        'sq' : 'Albanian',
        'am' : 'Amharic',
        'ar' : 'Arabic',
        'an' : 'Aragonese',
        'hy' : 'Armenian',
        'as' : 'Assamese',
        'av' : 'Avaric',
        'ae' : 'Avestan',
        'ay' : 'Aymara',
        'az' : 'Azerbaijani',
        'bm' : 'Bambara',
        'ba' : 'Bashkir',
        'eu' : 'Basque',
        'be' : 'Belarusian',
        'bn' : 'Bengali',
        'bh' : 'Bihari languages',
        'bi' : 'Bislama',
        'bs' : 'Bosnian',
        'br' : 'Breton',
        'bg' : 'Bulgarian',
        'my' : 'Burmese',
        'ca' : 'Catalan, Valencian',
        'km' : 'Central Khmer',
        'ch' : 'Chamorro',
        'ce' : 'Chechen',
        'ny' : 'Chichewa, Chewa, Nyanja',
        'zh' : 'Chinese',
        'cu' : 'Church Slavonic, Old Bulgarian, Old Church Slavonic',
        'cv' : 'Chuvash',
        'kw' : 'Cornish',
        'co' : 'Corsican',
        'cr' : 'Cree',
        'hr' : 'Croatian',
        'cs' : 'Czech',
        'da' : 'Danish',
        'dv' : 'Divehi, Dhivehi, Maldivian',
        'nl' : 'Dutch, Flemish',
        'dz' : 'Dzongkha',
        'en' : 'English',
        'eo' : 'Esperanto',
        'et' : 'Estonian',
        'ee' : 'Ewe',
        'fo' : 'Faroese',
        'fj' : 'Fijian',
        'fi' : 'Finnish',
        'fr' : 'French',
        'ff' : 'Fulah',
        'gd' : 'Gaelic, Scottish Gaelic',
        'gl' : 'Galician',
        'lg' : 'Ganda',
        'ka' : 'Georgian',
        'de' : 'German',
        'ki' : 'Gikuyu, Kikuyu',
        'el' : 'Greek (Modern)',
        'kl' : 'Greenlandic, Kalaallisut',
        'gn' : 'Guarani',
        'gu' : 'Gujarati',
        'ht' : 'Haitian, Haitian Creole',
        'ha' : 'Hausa',
        'he' : 'Hebrew',
        'hz' : 'Herero',
        'hi' : 'Hindi',
        'ho' : 'Hiri Motu',
        'hu' : 'Hungarian',
        'is' : 'Icelandic',
        'io' : 'Ido',
        'ig' : 'Igbo',
        'id' : 'Indonesian',
        'ia' : 'Interlingua (International Auxiliary Language Association)',
        'ie' : 'Interlingue',
        'iu' : 'Inuktitut',
        'ik' : 'Inupiaq',
        'ga' : 'Irish',
        'it' : 'Italian',
        'ja' : 'Japanese',
        'jv' : 'Javanese',
        'kn' : 'Kannada',
        'kr' : 'Kanuri',
        'ks' : 'Kashmiri',
        'kk' : 'Kazakh',
        'rw' : 'Kinyarwanda',
        'kv' : 'Komi',
        'kg' : 'Kongo',
        'ko' : 'Korean',
        'kj' : 'Kwanyama, Kuanyama',
        'ku' : 'Kurdish',
        'ky' : 'Kyrgyz',
        'lo' : 'Lao',
        'la' : 'Latin',
        'lv' : 'Latvian',
        'lb' : 'Letzeburgesch, Luxembourgish',
        'li' : 'Limburgish, Limburgan, Limburger',
        'ln' : 'Lingala',
        'lt' : 'Lithuanian',
        'lu' : 'Luba-Katanga',
        'mk' : 'Macedonian',
        'mg' : 'Malagasy',
        'ms' : 'Malay',
        'ml' : 'Malayalam',
        'mt' : 'Maltese',
        'gv' : 'Manx',
        'mi' : 'Maori',
        'mr' : 'Marathi',
        'mh' : 'Marshallese',
        'ro' : 'Moldovan, Moldavian, Romanian',
        'mn' : 'Mongolian',
        'na' : 'Nauru',
        'nv' : 'Navajo, Navaho',
        'nd' : 'Northern Ndebele',
        'ng' : 'Ndonga',
        'ne' : 'Nepali',
        'se' : 'Northern Sami',
        'no' : 'Norwegian',
        'nb' : 'Norwegian Bokmål',
        'nn' : 'Norwegian Nynorsk',
        'ii' : 'Nuosu, Sichuan Yi',
        'oc' : 'Occitan (post 1500)',
        'oj' : 'Ojibwa',
        'or' : 'Oriya',
        'om' : 'Oromo',
        'os' : 'Ossetian, Ossetic',
        'pi' : 'Pali',
        'pa' : 'Panjabi, Punjabi',
        'ps' : 'Pashto, Pushto',
        'fa' : 'Persian',
        'pl' : 'Polish',
        'pt' : 'Portuguese',
        'qu' : 'Quechua',
        'rm' : 'Romansh',
        'rn' : 'Rundi',
        'ru' : 'Russian',
        'sm' : 'Samoan',
        'sg' : 'Sango',
        'sa' : 'Sanskrit',
        'sc' : 'Sardinian',
        'sr' : 'Serbian',
        'sn' : 'Shona',
        'sd' : 'Sindhi',
        'si' : 'Sinhala, Sinhalese',
        'sk' : 'Slovak',
        'sl' : 'Slovenian',
        'so' : 'Somali',
        'st' : 'Sotho, Southern',
        'nr' : 'South Ndebele',
        'es' : 'Spanish, Castilian',
        'su' : 'Sundanese',
        'sw' : 'Swahili',
        'ss' : 'Swati',
        'sv' : 'Swedish',
        'tl' : 'Tagalog',
        'ty' : 'Tahitian',
        'tg' : 'Tajik',
        'ta' : 'Tamil',
        'tt' : 'Tatar',
        'te' : 'Telugu',
        'th' : 'Thai',
        'bo' : 'Tibetan',
        'ti' : 'Tigrinya',
        'to' : 'Tonga (Tonga Islands)',
        'ts' : 'Tsonga',
        'tn' : 'Tswana',
        'tr' : 'Turkish',
        'tk' : 'Turkmen',
        'tw' : 'Twi',
        'ug' : 'Uighur, Uyghur',
        'uk' : 'Ukrainian',
        'ur' : 'Urdu',
        'uz' : 'Uzbek',
        've' : 'Venda',
        'vi' : 'Vietnamese',
        'vo' : 'Volap_k',
        'wa' : 'Walloon',
        'cy' : 'Welsh',
        'fy' : 'Western Frisian',
        'wo' : 'Wolof',
        'xh' : 'Xhosa',
        'yi' : 'Yiddish',
        'yo' : 'Yoruba',
        'za' : 'Zhuang, Chuang',
        'zu' : 'Zulu'
    };

    function stringByLanguage( str ) {
        if( str == null )
            return "";
        str = String(str);
        str = str.trim();
        let arr = str.match(/<.*?>/g);

        if( arr == null )
            return str;

        if( arr.length == 0 )
            return str;

        // 1. Loại bỏ các phần có <language_code: >
        let localizeStr = str;
        arr.forEach((item) => {
            localizeStr = localizeStr.replace( item, "" );
        });
        localizeStr = localizeStr.trim();

        // 2. Tạo một array gồm language_code:string
        langStr = [];
        langStr.push(["localize", localizeStr]);

        arr.forEach((item) => {
            let child = item.replace( "<", "" ).replace( "/>", "" ).replace( ">", "" );
            var index = child.indexOf(':');
            if( index > -1 ) {
                var child_array = [child.slice(0, index).trim(), child.slice(index + 1).trim()];
                if(child_array.length == 2)
                    if( child_array[0] != "" )
                        langStr.push([child_array[0], child_array[1]]);
            }
        });

        // 3. So sánh trong danh sách trả về
        let currentLang = currentLanguage();
        //console.log( langStr );
        var output = localizeStr;
        langStr.forEach((lang) => {
            if( lang[0] == currentLang ) {
                output = lang[1];
                return;
            }
        });

        return output;
    }

    function currentLanguage() {
        let pathName =  document.location.pathname;

        if( pathName.length < 3 )
            return "localize";

        for (var lang in countryList) {
            var langCom = "/" + lang;

            if( pathName.substring(0, 3).toLowerCase() == langCom.toLowerCase() ) {
                if( pathName.length == 3 )
                    return lang;

                if( pathName.length > 3 )
                    if( pathName[3] == "/" || pathName[3] == "&" || pathName[3] == "#" || pathName[3] == "?" || pathName[3] == "%" )
                        return lang;
            }
        }

        return "localize";
    }

    return {
        Name: "Naviman Language",
        stringByLanguage: stringByLanguage,
        currentLanguage: currentLanguage,

    };

})();


var naviman_runApp = function (e) {

/** 1.Link CSS & icons **************************************/
    function linkCSSToHead(href) {
        // Kiểm tra xem file CSS đã tồn tại trong <head> chưa
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.href = href;
            link.type = "text/css";
            link.rel = 'stylesheet';

            // Khi file CSS được tải xong, log ra thông báo (tùy chọn)
            link.onload = function () {
                console.log(`CSS file ${href} loaded successfully.`);
            };

            // Thêm phần tử <link> vào phần <head>
            document.head.appendChild(link);
        } else {
            // console.log(`CSS file ${href} is already linked on this page.`);
        }
    }

    linkCSSToHead( naviman_css );
    linkCSSToHead( "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" );
    linkCSSToHead( "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.min.css" );

    /** 2.Get variables **************************************/
    var shop = document.currentScript.getAttribute('shop');
    var embed_id = '';
    if(document.currentScript.getAttribute('embed_id') != null)
        embed_id = document.currentScript.getAttribute('embed_id');

    var section_setting = [];
    section_setting['embed_id'] = '';
    section_setting['not_sticky'] = false;
    section_setting['embed_title'] = '';
    section_setting['embed_is_full'] = false;
    section_setting['embed_margin'] = "0 0 0 0";

    if(embed_id != '') {
        var not_sticky = false;
        var embed_title = "";
        var embed_is_full = false;
        var embed_margin = "0 0 0 0";

        if (document.currentScript.getAttribute('not_sticky') != null)
            not_sticky = document.currentScript.getAttribute('not_sticky');
        if(embed_id != '') if(document.currentScript.getAttribute('embed_title') != null)
            embed_title = document.currentScript.getAttribute('embed_title');
        if(embed_id != '') if(document.currentScript.getAttribute('embed_is_full') != null)
            embed_is_full = document.currentScript.getAttribute('embed_is_full');
        if(embed_id != '') if(document.currentScript.getAttribute('embed_margin') != null)
            embed_margin = document.currentScript.getAttribute('embed_margin');

        section_setting['embed_id'] = embed_id.trim();
        section_setting['not_sticky'] = not_sticky;
        section_setting['embed_title'] = embed_title.trim();
        section_setting['embed_is_full'] = embed_is_full;
        section_setting['embed_margin'] = embed_margin;
    }

    // console.log(section_setting);

    /*****************
     Mỗi khi gặp đoạn mã này thì sẽ chạy một lần runNaviman. Data có thể là một danh sách hoặc 1 item
     - Nếu all: Chạy for cho nhiều item.
     - Nếu section:
        1. Nếu sticky thì chạy bình thường (for vô nghĩa)
        2. Nếu ko sticky thì bổ sung mã CSS (for vô nghĩa)
     ***************/
    function runNaviman( data, shopinfo ) {
        naviman.init();

        if( isNeedCartCount(data) ) {
            naviman.asyncGetCart().then( function(result) {
                // console.log("Cart count: " + result.item_count );
                window.addEventListener('SCE:mutate', (event) => {
                    naviman.checkAndUpdateCartCount();
                });
                naviman.setCartCount( result.item_count );
                naviman.drawBottomNav(data, naviman_domain, shop, embed_id, section_setting);
                naviman.generateActiveItems();
                naviman.checkAndRelayout();

                if( result.item_count == 0 ) {
                    naviman.updateCartCount( result.item_count );
                }

            });
        }else {
            naviman.drawBottomNav(data, naviman_domain, shop, embed_id, section_setting);
            naviman.generateActiveItems();
            naviman.checkAndRelayout();
        }
    }


    var api_url = naviman_json_cdn + "/" + shop.replace(".myshopify.com", '') + ".all.json";
    if( embed_id != '' )
        api_url = naviman_json_cdn + "/" + shop.replace(".myshopify.com", '') + "." + embed_id + ".json";
    // TODO: Chỗ này không có là không chạy đúng
    // api_url += "?v=" + Math.random();

    var api_shopinfo_url = naviman_json_cdn + "/" + shop.replace(".myshopify.com", '') + ".info.json";
    api_shopinfo_url += "?v=" + Math.random();

    function logCache( kind, key, value ) {
        console.log( kind + ": " + key);
        console.log(value);
    }

    // Start here ===============================================<<

    function clearNaviLocalStorage() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key.includes('naviplus')) {
                localStorage.removeItem(key);
                i--;
            }
        }
    }


    function runApplication(shopinfo) {
        var jsonData = naviman.getLocalStorage(api_url);
        var jsonUpdateVersion = 0;
        if( naviman.getLocalStorage("jsonUpdateVersion") != null )
            jsonUpdateVersion = naviman.getLocalStorage("jsonUpdateVersion");

        var isNeedRequestServer = false;
        if( jsonData == null )
            isNeedRequestServer = true;
        if( shopinfo["update_version"] != jsonUpdateVersion ) {
            console.log("There is a new version of Navi+ data! Deleted!");
            clearNaviLocalStorage();
            isNeedRequestServer = true;
        }

        if( isNeedRequestServer ) {
            fetch(api_url + "?v=" + Math.random())
                .then((response) => response.json())
                .then((json) => {
                    logCache( "[Server]", api_url, json );

                    // Set json to localStorate
                    naviman.setLocalStorage(api_url, json, naviman_cache_miniseconds);

                    // Set update version to localStorate
                    naviman.setLocalStorage("jsonUpdateVersion", shopinfo["update_version"], naviman_cache_miniseconds);

                    runNaviman(json, shopinfo);
                });
        }else {
            // logCache( "From local", api_url, jsonData );
            runNaviman(jsonData, shopinfo);
        }
    }

    window.naviman_shopinfo = naviman.getLocalStorage("naviman_shopinfo");

    if ( window.naviman_shopinfo == null) {
        fetch(api_shopinfo_url)
            .then((response_shopinfo) => response_shopinfo.json())
            .then((shopinfo) => {
                window.naviman_shopinfo = shopinfo;

                // TODO IMPORTANT ============================================================
                //  Hiện tại setup cứ 5 giây lại load lại shopinfo một lần -> tạo áp lực lên server và
                // thêm nữa nếu trên một trang có nhiều menu thì sẽ load nhiều lần.
                // Giải pháp: Chờ load xong shopinfo thì mới load tiếp các menu khác -> Vòng lặp vô hạn cho đến khi phát
                // hiện ra localstorage có data -> Nếu local storage không hoạt động thì nó có thể gây hỏng toàn bộ. liệu cần kiểm tra localstorage có hoạt động ko?
                // TODO IMPORTANT ============================================================

                naviman.setLocalStorage("naviman_shopinfo", window.naviman_shopinfo, 5000);

                if (!window.isShopinfoServerLogged) {
                    logCache( "[Server]", "naviman_shopinfo", window.naviman_shopinfo );
                    window.isShopinfoServerLogged = true; // Đặt cờ để không log lại nữa
                }

                runApplication(window.naviman_shopinfo);
            });
    }else {
        if (!window.isShopinfoLocalLogged) {
            logCache( "[Local]", "naviman_shopinfo", window.naviman_shopinfo );
            window.isShopinfoLocalLogged = true; // Đặt cờ để không log lại nữa
        }

        runApplication(window.naviman_shopinfo);
    }


    // Start here ===============================================>>


    function containsBadgeIsCart(arr) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if( naviman.isHadValue( item["badgeiscart"] ) )
                if( item["badgeiscart"] == 1 || item["badgeiscart"] == "1" ) {
                    return true;

                }

            if (Array.isArray(item["children"]))
                if (item["children"].length > 0) {
                    if (containsBadgeIsCart(item["children"])) {
                        return true;
                    }
                }
        }

        return false;
    }

    function isNeedCartCount( data ) {

        var isNeed = false;
        data.forEach((naviItem) => {
            if( containsBadgeIsCart( naviItem["data"]["dragdrop"] ) ) {
                isNeed = true;
                return;
            }
        });
        return isNeed;
    }

    /** 3.Get API data **************************************/
    function jsonp(uri) {
        return new Promise(function(resolve, reject) {
            var id = '_' + Math.round(10000 * Math.random());
            var callbackName = 'jsonp_callback_' + id;
            window[callbackName] = function(data) {
                delete window[callbackName];
                var ele = document.getElementById(id);
                ele.parentNode.removeChild(ele);
                resolve(data);
            }

            var src = uri + '&callback=' + callbackName;
            var script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.addEventListener('error', reject);
            (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(script)
        });
    }



};

naviman_runApp();


