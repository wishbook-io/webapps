function setNotificationsRead(){
  var a = JSON.parse(localStorage.getItem("push_que")) || [];

  for (var i = 0 ; i < a.length ; i++) {
      a[a.length - i -1].read = true;
    }

    console.log(a);

    localStorage.setItem('push_que', JSON.stringify(a));
    document.getElementById('iconbadge').innerHTML = '';


}


function createNotificationList(){


    moveNotificationsFromDbToLocalStorage();
    var a = JSON.parse(localStorage.getItem("push_que")) || [];
    var html = '';
    var unreadcount = 0;

    if(a.length < 1)
    {
      html = '<div style="margin-top: 40px;text-align: center;">No Notifications Received</div>';
    }


    for (var i = 0 ; i < a.length ; i++)
    {
        var item = a[a.length - i -1];

        if(!item.read){
        unreadcount += 1;
        }
        
        //console.log(item);
        var url = notificationURLGenerator(item);
      

        html += '<a class="list-group-item" href="'+url+'">\
                  <div class="media-box">\
                     <div class="pull-left" style="width: 60px;">\
                        <img style="width: 100%;" src="'+a[a.length - i -1].image+'"/>\
                     </div>\
                     <div class="media-box-body clearfix">\
                        <p class="m0">'+a[a.length - i -1].title+'</p>\
                        <p class="m0 text-muted">\
                           <small>'+a[a.length - i -1].message+'</small>\
                        </p>\
                     </div>\
                  </div>\
                </a>'
    }

    /*if(a.length > 5)
     {
       html += '<a class="list-group-item" href="">\
    <small translate="topbar.notification.MORE">More notifications</small>\
    <span class="label label-danger pull-right">'+(a.length-5)+'</span>\
    </a>';
     }*/
    
    if(unreadcount > 0 ){
      document.getElementById('iconbadge').innerHTML = unreadcount;
    }
    document.getElementById('notificationlist').innerHTML = html;
    

}


function moveNotificationsFromDbToLocalStorage(){

  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;


  // Open (or create) the database
  var open = indexedDB.open("Wishbook", 1);

  // Create the schema
  open.onupgradeneeded = function() {
          var db = open.result;
          var store = db.createObjectStore("Notifications", {keyPath: "id"});
          //var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
      };

  open.onsuccess = function() {
          // Start a new transaction
          var db = open.result;
          var tx = db.transaction("Notifications", "readwrite");
          var store = tx.objectStore("Notifications");
         // var index = store.index("NameIndex");

          // Add some data
         

          var countRequest = store.count();
          countRequest.onsuccess = function() {
            // console.log(countRequest.result);
          }

          var allRequest = store.getAll();
          allRequest.onsuccess = function() {
            // console.log(allRequest.result);
            if(allRequest.result.length > 0){
              var a = JSON.parse(localStorage.getItem("push_que")) || [];

              var new_pushes = a.concat(allRequest.result);
             

              localStorage.setItem('push_que', JSON.stringify(new_pushes));
              createNotificationList();
            }
          }

          

          // Make a request to clear all the data out of the object store
          var clearStoreRequest = store.clear();
          clearStoreRequest.onsuccess = function() {
            // console.log(clearStoreRequest.result);
          }
         
          // Close the db when the transaction is done
          tx.oncomplete = function() {
              db.close();
          };
      }
}

function addToDB(data){

      // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
  //var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  // Open (or create) the database
  var open = indexedDB.open("Wishbook", 1);

  // Create the schema
  open.onupgradeneeded = function() {
          var db = open.result;
          var store = db.createObjectStore("Notifications", {keyPath: "id"});
          //var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
      };

  open.onsuccess = function() {
          // Start a new transaction
          var db = open.result;
          var tx = db.transaction("Notifications", "readwrite");
          var store = tx.objectStore("Notifications");
         // var index = store.index("NameIndex");

          // Add some data
         // store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
         var countRequest = store.count();
          countRequest.onsuccess = function() {
            //console.log(countRequest.result);
            data.id = countRequest.result+1;
            store.put(data);
          }

          

        
          /*// Query the data
          var getJohn = store.get(12345);
          var getBob = index.get(["Smith", "Bob"]);

          getJohn.onsuccess = function() {
              console.log(getJohn.result.name.first);  // => "John"
          };

          getBob.onsuccess = function() {
              console.log(getBob.result.name.first);   // => "Bob"
          };*/

          // Close the db when the transaction is done
          tx.oncomplete = function() {
              db.close();
          };
      }


}

function notificationURLGenerator(item)
{
    var url = '/';

    if(item.type == "catalog" || true)
    { 
                    
    //url = '#/app/products-detail/?type=receivedcatalog&id='+item.comId+'&name='+item.name;
    url = "javascript:;";
    
    }
    else if(item.title == "Purchase Order"){
            
    url = '#/app/order-detail/?type=purchaseorders&id='+item.comId+'&name='+item.title;

    }
    else if (item.title == "Sales Order"){           

    url = '#/app/order-detail/?type=salesorders&id='+item.comId+'&name='+item.title;
                    
    }
    else if (item.type == "promotional")
    {

        url = "javascript:;";
        //urlHandler(item.other_praam.deeplink);
    }
    else if (item.type == "buyer") {

        url = '#/app/suppliers';

    }
    else if (item.type == "supplier") {

        url = '#/app/buyers';

    }
    else if (item.type == "supplier_enquiry") {

        url = '#/app/myleads';
        //'#/app/buyerenquiry';
    }
    else if (item.type == "buyer_enquiry") {

        url = '#/app/myleads';
        //'#/app/supplierenquiry';
    }
    else
    {
        url = "javascript:;";
    }
      
    return url;
}



function urlHandler(url)
{
    // alert(url);
    var urlParams = url.replace("?", "");

    //decode json fro url parameters
    var params = urlParams.split("&").reduce(function (prev, curr, i, arr) {
        var p = curr.split("=");
        prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
        return prev;
    }, {});

   
    for (var k in params)
    {
        //console.log(k, params[k]);

        var pramsElement = params[k].split(",");
        var array = [];
        pramsElement.forEach(function (el, i) {
            var n = Number(el);
            array[i] = (n == 0 ? n : n || el);

        });

        if (array.length > 1) {
            params[k] = array;
        }
    }


    console.log('url params');
    console.log(params);


    var ctype = getParameterByName('ctype', url);
    var cid = getParameterByName('companyid', url)
    var status = getParameterByName('status', status);
    var catalog_type = getParameterByName('catalog_type', url);

    var type = getParameterByName('type', url);
    var id = getParameterByName('id', url);
    var t = getParameterByName('t', url);
    var page = getParameterByName('page', url);
    var categoryid = getParameterByName('category', url);



    console.log(type);
    console.log(url);
    console.log(catalog_type);
    console.log(ctype);



    console.log(catalog_type);
    var filterApplied = false;

    if (urlParams != "")
    {
        console.log(params);
        if (params.type) {
            type = params.type;
            delete params.type;
        }

        if (params.ctype) {
            ctype = params.ctype;

            if (params.ctype == 'public')
            {
                console.log("deeplink");
                if (isEmpty(params)) {
                    filterApplied = false;
                }
                
            }

            delete params.ctype;

        }

    }


    /*var tokenId = localStorage.getItem("token");

    if (t == 'page' & page == 'received') {
        wGlobal.type = t;
        wGlobal.page = page;
    }
    gaSendEventView('SMS', 'Click', type, id);

    if (tokenId == null || tokenId == 0) {
        wGlobal.type = type;
        wGlobal.id = id;

        myNavigator.resetToPage('html/login.html');

    }*/
    if (type)
    {
        if (type == 'catalog')
        {
            if (ctype == 'public' && catalog_type == 'noncatalog')
            {
                console.log('inside noncatalogs list');
                url = '#/app/publiccatalog/?type=noncatalog'
                //myNavigator.pushPage('html/catalog/mycatalogs.html', { type: 'public', non_catalogs: 'true', filters: filterApplied });
            }
            else if (ctype == 'public')
            {
                console.log('inside catalog list');
                url = '#/app/publiccatalog/?type=catalog'
                //myNavigator.pushPage('html/catalog/mycatalogs.html', { type: 'public', filters: filterApplied });
            }
            else
            {
                url = '#/app/products-detail/?type=publiccatalog&id=8953 & name=Fffsss';
                //myNavigator.pushPage('html/catalog/catalogView.html', { catalogId: id });
            }

        }
        else if (type == 'received_enquiries') {
            myNavigator.pushPage('html/LeadsEnquiries/LeadsIndividual.html', { buyingCompanyid: id })
        }
        else if (type == 'received_enquiries') {
            myNavigator.pushPage('html/LeadsEnquiries/Leads.html');
        }
        else if (type == 'sales') {
            myNavigator.pushPage('html/orders/orderdetail.html', { salesNumber: id })
        }
        else if (type == 'purchase') {
            myNavigator.pushPage('html/orders/purchaseDetail.html', { ID: id })
        }
        else if (type == 'supplier') {
            if (id) {
                myNavigator.pushPage('html/supplierDetail.html', { comId: id });
            }
            else if (cid) {
                myNavigator.pushPage('html/supplierDetail.html', { comId: cid });
            }
        }
        else if (type == 'buyer') {
            myNavigator.pushPage('html/detailBuyer.html', { comId: id })
        }
        else if (type == 'brands') {
            myNavigator.pushPage('html/catalog/mycatalogs.html', { closeMenu: true, brand: id, type: 'public' })
        }
        else if (type == 'tab') {
            getTabDeeplink(url, params);
        }
        else if (type == 'credit_reference_buyer_requested') {
            //context based chat
        }
        else if (type == 'catalogwise-enquiry-supplier') {
            //context based chat
        }
        else if (type == 'promotional') {
            var link = extractLinks(page);
            if (link.length > 1) {
                window.open(link);
            }
            else {
                console.log('link is not valid in param page');
            }

        }
        else if (type == 'update') {
            window.open('itms-apps://itunes.apple.com/app/wishbook-catalog-sales-app/id1090636460?mt=8', '_system');
        }
        else if (type == 'selection') {
            //
        }
        else if (type == 'html' || type == 'faq') {
            document.getElementById("fc_frame").style.display = 'block';
            document.getElementById("hotlineIcon").style.display = 'block';

            console.log("in deeplink of FAQ ");

            if (wGlobal.platform == '') {
                console.log('lite');
                window.fcWidget.open();

            }
            else {
                console.log('IOS');
                showFAQ();
            }
        }
        else if (type == 'webview') {
            //
        }
        else if (type == 'support_chat') {
            openfreshorhotlinechat();
        }
        else if (type == 'credit_rating') {
            //
        }
        else {
            myNavigator.pushPage('html/notification.html');
        }
    }




}

function extractLinks(page) //deeplink handler functions Dhiren Singh 
{
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression); var url;

    if (page.match(regex)) {
        //alert("Successful match");
        url = page.match(regex);
    }
    else {
        //alert("No match");
        url = "";
    }

    console.log(url);
    return url;

}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}