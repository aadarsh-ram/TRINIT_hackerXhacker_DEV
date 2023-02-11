let attached_tabs =[]

// tell_login();

let gtabid = 0

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (request.jwt) {
        console.log('Token ::: ', request.jwt);
        localStorage.setItem('eco-token')
        sendResponse({ success: true, message: 'Token has been received' });
    }
});


//change from google
// function tell_login(){
//     chrome.tabs.create({url : "https://google.com"})
// }


function addRequestToAttachedTabs(response,url,size){
    req = {}
    req["timestamp"] = new Date().toISOString().slice(0,-5).replace('T',' ')
    req["co2_grid_grams"] = response.co2_grid_grams
    req["energy_kwg"] = response.energy_kwg
    req["co2_renewable_grams"] = response.co2_renewable_grams;
    req["request_url"] = url;
    req["category"] = response.category
    req["size"] = size
    return req
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        setTimeout(()=>{
            chrome.tabs.getSelected(null, function(tab) { 
                let tt = attached_tabs.find(obj=>obj.id == tab.id)
                let req = {}
                if(tt===undefined ||  tt["all_requests"].length==0){
                    req["co2_grid_grams"] = 0
                    req["energy_kwg"] = 0
                    req["co2_renewable_grams"] = 0
                    req["category"] = 'unknown'
                }
                else{
                    req = tt["all_requests"][tt["all_requests"].length-1]
                }
                chrome.runtime.sendMessage(req);
            })
        },10000)
});

chrome.tabs.onUpdated.addListener(
    (tabid,info,t)=>{
        chrome.debugger.getTargets((targets)=>{
            if(attached_tabs.some(tab => tab["id"] === tabid)) return
            if(!(targets.some(obj => (obj.tabId === tabid && obj.attached == true)))){
                startDebugger(tabid)
            }
            else{
                tab={}
                tab["id"] = tabid;
                tab["total_co2_renewable_grams"] = 0;
                tab["timestamp"] = new Date().toISOString().slice(0,-5).replace('T',' ')
                tab["session_id"] = self.crypto.randomUUID()
                tab["username"] = "username"
                tab["total_co2_grid_grams"] = 0
                tab["total_energy_kwg"] = 0
                tab["all_requests"] = []
                tab["green_category"] = "semi-green"
                attached_tabs.push(tab)
            }
        })

        if(info.status=="complete"){
            try{
                let allSmallReqs = netList[tabid+"list"]
                let totSize = 0
                allSmallReqs.map((num) =>{
                    if(num.size && !num.cached){
                        totSize+=num.size;
                    }
                });
                netList[tabid+"list"] = []
                chrome.tabs.getSelected(null, function(tab) { 
                    let reqUrl=''
                    if(tab.url.substr(0,4)==="http"){
                        let dataForHost = new URL(tab.url)
                        reqUrl = dataForHost.hostname
                        //timestamp
                    }
                    console.log("sending...")
                    fetch('https://api-aadarsh-ram.cloud.okteto.net/user/get-emission-stats?'+new URLSearchParams({
                        bytes:totSize,
                        host:reqUrl
                    })).then(async(res)=>{
                        console.log("got response")
                        let response = await(res.json())
                        let currobj = addRequestToAttachedTabs(response,reqUrl,totSize)
                        let tt = attached_tabs.find(obj=>obj.id == tabid)
                        chrome.runtime.sendMessage(currobj);
                        tt["all_requests"].push(currobj)
                    }).catch((e)=>{
                        console.log(e)
                    })
                })
            }
            catch(e){
                console.log("error is : ",e)
            }
        }
    }
)

function add_before_closing(tabid){
    try{
        let allSmallReqs = netList[tabid+"list"]
        let totSize = 0
        allSmallReqs.map((num) =>{
            if(num.size && !num.cached){
                totSize+=num.size;
            }
        });
        let tt = attached_tabs.find(obj=>obj.id == tabid)
        netList[tabid+"list"] = []
            let reqUrl=tt["all_requests"][tt["all_requests"].length-1]["request_url"]
            fetch('https://api-aadarsh-ram.cloud.okteto.net/user/get-emission-stats?'+new URLSearchParams({
                bytes:totSize,
                host:reqUrl
            })).then(async(res)=>{
                let response = await(res.json())
                let currobj = addRequestToAttachedTabs(response,reqUrl,totSize)
                tt["all_requests"].push(currobj)
                clear_tab_data(tabid)
            }).catch((e)=>{
                console.log(e)
            })
    }
    catch(e){
        console.log("error is : ",e)
    }
}


// current tab being inspected

var is_cache_disabled = false;

// map of tabid -> requests
var netList = {};

// list of requestIds that were cached
var cachedList = {};


// tab changed
chrome.tabs.onActivated.addListener(function(info) {
    // seems chrome.tabs.get always causes exception...
    return;
    chrome.tabs.get(info.tabId, function(tab) {
        tab_updated(tab.id);
    });
});

// tab deleted
chrome.tabs.onRemoved.addListener(function(tabid){
    add_before_closing(tabid)
    // clear_tab_data(tabid);
});

// page load start
chrome.webNavigation.onBeforeNavigate.addListener(function(details) {

    if (details.frameId === 0 && details.tabId == gtabid) {
        // main frame loaded
        deb("onStart");

        is_loading = true;

        // clear_tab_data(details.tabId);

        // remember time
        var t = details.timeStamp;
        netList[details.tabId+"t0"] = t;
    }
});

// page completed
chrome.webNavigation.onCompleted.addListener(function(details) {

    if (details.frameId === 0 && details.tabId == gtabid) {
        deb("onCompleted");

        is_loading = false;

        // chrome.runtime.sendMessage({load_completed: 1});

        // remember time
        var t = details.timeStamp;
        netList[details.tabId+"t1"] = t;

    }
});


// remove all network requests of this tab
function clear_tab_data(tabid) {
//    deb("cleared "+tabid);

    try{
        let tt = attached_tabs.find(obj=>obj.id == tabid)
        let countNonGreen=0
        let countSemiGreen=0
        let countGreen=0
        tt["all_requests"].map((num) =>{
            tt["total_co2_grid_grams"] +=num["co2_grid_grams"]
            tt["total_energy_kwg"]  += num["energy_kwg"]
            tt["total_co2_renewable_grams"] += num["co2_renewable_grams"]
            if(num["category"]==="green"){
                countGreen+=num["size"];
            }
            else if(num["category"]==="non-green"){
                countNonGreen+=num["size"];
            }
            else {
                countSemiGreen+=num["size"]
            }
        });
        let maxx = Math.max(countGreen,countSemiGreen,countNonGreen)
        tt["green_category"] = (maxx==countGreen ? "green" : (maxx==countSemiGreen ? "semi-green" : "non-green"))
        let token = localStorage.getItem('eco-token')
        if(!token){
            token=" "
            // tell_login();
        }
        fetch('https://api-aadarsh-ram.cloud.okteto.net/user/save-session',{
            method:"POST",
            headers:{
                "Authorization" : `Bearer ${token}`
            },
            body:JSON.stringify(tt)
        }).then(()=>{
            console.log("saved session")
        }).catch((err)=>{
            console.log("error",err);
        })
    }

    catch(e){
        console.log("error",e)
    }

    delete netList[tabid+"list"];
    delete netList[tabid];
    delete netList[tabid+"t1"];

    cachedList = {};
}

// add or get a single request item from list
function get_item(tabid, reqid) {
    if (!netList[tabid])
        netList[tabid] = {};
    if (!netList[tabid+"list"])
        netList[tabid+"list"] = [];

    var obj = netList[tabid][reqid];
    if (!obj) {
        obj = {};
        netList[tabid][reqid] = obj;
    }

    return obj;
}

// add a request to the list
function add_file(tabid, reqid, url, code, from_cache, type) {

    if (url && url.startsWith("chrome-extension:"))
        return;

    var urlpart = url.split("/").pop();

    // is request cached even though from_cache = false!?
    if (cachedList[reqid])
        from_cache = true;

//    deb("add", reqid, urlpart, "cached:", from_cache);

    var obj = get_item(tabid, reqid);

    obj["url"] = url;
    obj["code"] = code;
    obj["type"] = type;
    obj["req"] = reqid;
    obj["cached"] = from_cache;
    obj["size"] = 0;
    obj["co2_renewable_grams"] = 0
    obj["co2_grid_grams"]=0
    obj["energy_kwg"]=0
    chrome.tabs.getSelected(null, function(tab) { 
        if(tab.url.substr(0,4)==="http"){
            let dataForHost = new URL(tab.url)
            obj["request_url"] = dataForHost.hostname
            //timestamp
        }
    })
    // add to request list
    netList[tabid+"list"].push(obj);
}

// set size of the item
function set_file_size(tabid, reqid, size, is_chunk) {
    size = isNaN(size) ? 0 : size || 0;

    var obj = get_item(tabid, reqid);

//    var isdoub = (is_chunk && obj.size);

    if (size)
        obj.size = size + (is_chunk? (obj.size || 0) : 0);

//    if (isdoub)
//        deb("  double ", reqid, size, obj.size);
//    else
//        deb("  single ", reqid, size, obj.size);
}

// provide list of network requests
function get_tab_network_requests(tabid) {
    tabid = parseInt(tabid);
    return netList[tabid+"list"];
}
function get_tab_load_time(tabid) {
    var t0 = netList[tabid+"t0"];
    var t1 = netList[tabid+"t1"];
    return t1-t0;
}

// count non-cached network request
function get_requests_count(tabid) {
    tabid = parseInt(tabid);

    var c = 0;
    var list = netList[tabid+"list"];
    if (list && list.length) {
        for (const obj of list) {
            if (!obj.cached)
                c++;
        }
    }

    return c;
}

//--------------------------------------------------------------------------
// debugger logic

chrome.debugger.onDetach.addListener(onDetachDebugger);
chrome.debugger.onEvent.addListener(onNetworkEvent);

function startDebugger(tabid) {
    deb("startDebugger");

    var version = "1.0";
    var cb = onAttachDebugger.bind(null, tabid);

        chrome.debugger.attach({"tabId":tabid}, version, cb);
        if (chrome.runtime.lastError)
            return false;

        chrome.debugger.sendCommand({tabId: tabid}, "Network.enable");
        return true;
}

function stopDebugger(tabid) {
    deb("stopDebugger");

    is_cache_disabled = false;

    // does not call onDetachDebugger!
    chrome.debugger.detach({tabId:tabid});
}

function setCache(tabid, state) {
    deb("setCache ", state);

//    if (!is_debugger_on)
//        startDebugger(tabid);

    is_cache_disabled = state;

    chrome.debugger.sendCommand(
        { tabId: tabid },
        "Network.setCacheDisabled", { "cacheDisabled": state });
}

function reload(tabid) {
    deb("reload");

    chrome.debugger.sendCommand(
        { tabId: tabid },
        "Page.reload", { "ignoreCache": false });
}
function navigate(tabid, url) {
    deb("navigate");

    chrome.debugger.sendCommand(
        { tabId: tabid },
        "Page.navigate", { "url": url });
}

function getState(tabid) {
    var r = {"is_debugger_on": gtabid==tabid,
            "is_cache_disabled":is_cache_disabled,
            "is_loading":is_loading};
//    deb("state", tabid, gtabid, r);
    return r;
}

function onAttachDebugger(tabid) {

    if (chrome.runtime.lastError) {
        // var msg = chrome.runtime.lastError.message;
//        err(msg);
        // chrome.runtime.sendMessage({"attach_error":msg});
    } else {
        deb( "onAttach ok");
    }
}
function onDetachDebugger(source, reason) {
    err("onDetach");

    is_cache_disabled = false;

    // ask to refresh popup
    // chrome.runtime.sendMessage({load_completed: 1});
}

function onNetworkEvent(debuggeeId, message, params) {

    var tabid = debuggeeId.tabId;

    // console.log(params)

    if (message == "Network.responseReceived") {

        // remember request id + url
        var resp = params.response;
        var reqid = params.requestId;
        
        add_file(tabid, reqid, resp.url, resp.status, resp.fromDiskCache,
            params.type);

    } else if (message == "Network.requestServedFromCache") {
        // fired if request ended up loading from cache.
        //deb("fromcache" + params.requestId);

        cachedList[params.requestId] = 1;

    } else if (message == "Network.dataReceived") {

        // a chunk received!
        var reqid = params.requestId
        var size = params.dataLength; // is uncompressed!
//        var size = params.encodedDataLength; // zero!
        set_file_size(tabid, reqid, size, 1);

    } else if (message == "Network.loadingFinished") {

        var reqid = params.requestId
        var size = params.encodedDataLength;
        set_file_size(tabid, reqid, size);
    }
//    else {
//        deb(message, params);
//    }

}

function err(msg) {
    console.debug("ERR "+ msg);
}
deb = console.debug;

deb('inspector loaded');

