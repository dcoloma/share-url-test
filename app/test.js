function shareUrl() {
  urlToShare = document.getElementById("url-to-share").value;
  console.log("shareUrl " + urlToShare);
  var activity = new MozActivity({
    name: 'share',
    data: {
      type: 'url',
      url: urlToShare
    }
  });

  console.log("Activity invoked");

  activity.onsuccess = function() {
    console.log("Activity Launched Successfully");
  };

  activity.onerror = function() {
    console.log("Activity Error")
    console.log(this.error);
  };
}

function loadJSON(callback) {
  console.log("loadJson");
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'config.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  }
  xobj.send(null);
}

function init(){
  document.getElementById("share-url").addEventListener("click", shareUrl);
  loadJSON(function(response) {
    var urlToShare = JSON.parse(response).url;
    document.getElementById("url-to-share").value = urlToShare;
    //shareUrl();
  });
};

document.addEventListener("DOMContentLoaded", init, false);
