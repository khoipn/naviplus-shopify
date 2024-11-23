var naviman_version = "2.0.8";
var naviman_domain = 'https://shopify.naviplus.app/';
var naviman_css = 'https://cdn.jsdelivr.net/gh/khoipn/naviplus-shopify/'+ naviman_version +'/uigen.min.css';
var UIGEN_ENV = "DEPLOYMENT";



var naviman_json_cdn = "https://naviplus.b-cdn.net/naviplus/data/json";
var naviman_json_files = "https://naviplus.b-cdn.net/naviplus/data/";
var naviman_cache_miniseconds = 3600000; // 10 minutes

<?php
    include_once ("uigen/uigen_func.js.php");
?>

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
    //linkCSSToHead( "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.min.css" );

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


