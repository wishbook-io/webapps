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


    for (var i = 0 ; i < a.length ; i++) {
     
     var item = a[a.length - i -1];

     if(!item.read){
      unreadcount += 1;
     }
     
     console.log(item);
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

function notificationURLGenerator(item){

   var url = '/';

  if(item.type == "catalog"){ 
                  
        url = '#/app/products-detail/?type=receivedcatalog&id='+item.comId+'&name='+item.name;
        
      }
      else if(item.title == "Purchase Order"){
                
        url = '#/app/order-detail/?type=purchaseorders&id='+item.comId+'&name='+item.title;

            }
      else if (item.title == "Sales Order"){           

         url = '#/app/order-detail/?type=salesorders&id='+item.comId+'&name='+item.title;
                         
          }
      else if(item.type == "buyer")
      {
     
         url = '#/app/suppliers';
       
      }
    else if(item.type == "supplier"){
                 
         url = '#/app/buyers';
        
    }
    else if(item.type == "supplier_enquiry") 
        {

             url = '#/app/buyerenquiry';
        }

    else if(item.type == "buyer_enquiry") 
       {
          
          url = '#/app/supplierenquiry';
    }
      
      return url;
}
