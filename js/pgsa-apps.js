// Utilities

window.opTime = (scale) => (new Date().getTime() / (scale ||  1e3) ) >> 0;

window.encF = function(plain, key){ // assuming string input
    if(!key){
        return plain;// skip
    }
    return plain; // TODO: AES CBC
}

window.getQueryFromURL = function(url) {
    url = url || 'https://example.hku.hk/s?a=b#rd'; 
    let tmp = url.split('?'),
        query = (tmp[1] || "").split('#')[0].split('&'),
        params = {};
    for (let i=0; i<query.length; i++) {
        let arg = query[i].split('=');
        params[arg[0]] = arg[1];
    }
   
    return params;
};

window.getMeta = function(name, dom){
   if(typeof $ == 'undefined'){
       return null;
   }

   return $(`meta[property="${name}"]`, dom).attr('content');
}

// from WeChat
window.setPublishTime = function(e,t,s,o){ // now:secs, publish:secs, date_str, dom_element
    var n="",i=86400,a=new Date(1e3*e),d=1*t,f=s||"";
    a.setHours(0),a.setMinutes(0),a.setSeconds(0);
    var r=a.getTime()/1e3;
    a.setDate(1),a.setMonth(0);
    var l=a.getTime()/1e3;
    if(d>=r)n="Today";
    else if(d>=r-i)n="Yesterday";
    else if(d>=r-2*i)n="2 days ago";
    else if(d>=r-3*i)n="3 days ago";
    else if(d>=r-4*i)n="4 days ago";
    else if(d>=r-5*i)n="5 days ago";
    else if(d>=r-6*i)n="6 days ago";
    else if(d>=r-14*i)n="1 week ago";
    else if(d>=l){
    var c=f.split("-");
    n="%s/%s".replace("%s",parseInt(c[1],10)).replace("%s",parseInt(c[2],10));
    }else n=f;
    o&&(o.innerText=n,setTimeout(function(){
    o.onclick=function(){
    o.innerText=f;
    };
    },10));
}


// Namespace _pg

var _pg = _pg || {}; // config object


_pg.log = function(...args){
    if(_pg.debug){
        console.log(...args);
    }
}

/* Usage: 
      (1) store(key) - get value
      (2) store(key, value, -1) - set permanent, public value
      (3) store(key, value, ttl, enc_code) - set encrypted value using _pg.enc[enc_code]
*/
_pg.store = function(_key, value, _ttl, _enc){
    // key => { sec, val, exp, enc }
    var storage = window.localStorage;
    let key = [_pg.ver, _pg.sec, _key].join(_pg.sep);

    if(typeof value == 'undefined'){
        // get value; TODO: match sec
        let tmp = storage.getItem(key);
        if(!tmp){return null;}
        try{
            tmp = JSON.parse(tmp);
        }catch(e){
            this.console.log('err get storage:', _key);
            storage.removeItem(key);
            return null;
        }
        
        if(!tmp.exp || (tmp.exp>0 && tmp.exp<_pg.now)){
            storage.removeItem(key); // expired
            return null;
        }else if(!tmp.enc){ // not encrypted
            //console.log('local ', tmp.val);
            return tmp.val;
        }else if(tmp.enc in _pg.enc){
            let _val = encF(tmp.val, _pg.enc[tmp.enc]);
            //console.log('decrypt local', _val);
            return JSON.parse(_val);
        }else{
            // try to retrieve key from server;

            // if fail
            return null;
        }

    }else{
        let now = opTime();
        // set value
        let _val = value;
        if(_enc && _pg.enc[_enc]){ // encryption
            _val = encF(JSON.stringify(_val), _pg.enc[_enc]);
        }
        _ttl = _ttl || 86400; // default one day;
        //console.log('set local ', _val);

        storage.setItem(
            key,
            JSON.stringify({
                sec: _pg.sec,
                val: _val,
                exp: _ttl<=0? _ttl : now + _ttl, 
                enc: _enc || '', // default not encrypted
            })
        );

    }
}

_pg.purgeStore = function(_ver){
    var storage = window.localStorage;
    
    let getVer = (ver)=> ver.substr(1).split(_pg.ver_sep).map((e)=>parseInt(e));
    let cur = getVer(_ver);
    Object.keys(storage).forEach((key)=>{
        let v = key.split(_pg.sep)[0];
        if( getVer(v) < cur ){
            console.log('purge old version', key);
            storage.removeItem(key);
        }
        
     });
}

_pg.init = function(){
    _pg.sec = _pg.sec || 'h'; // default section home;
    _pg.ver = _pg.ver || 'v1.0'; // default version 1; 
    _pg.enc = _pg.enc || {}; // encryption keys;
    _pg.sep = ":"; _pg.ver_sep = ".";
    _pg.now = opTime();
    _pg.debug = location.origin.match(/:\/\/localhost/)?true:false;
    if(_pg.refresh){
    window.localStorage.clear();
    }else if(_pg.purge){
        _pg.purgeStore(_pg.ver);
    }
    return true;
}

_pg.allow_orders = [null, 'ascending', 'descending', 'keep'];

_pg.reorder = function(order, parent, sel, attr){
    // order in {null, latest, oldest}
    if(_pg.allow_orders.indexOf(order)<0){
        _pg.log('unsupported order ', order);
        return false; // ignore unsupported order
    }
    parent = $(parent);
    let eles = parent.children(sel);
    // TODO: deduplicate here? detect identical
    let vals = eles.map(function(){return $(this).data(attr)}).get().map(
           (e,i)=>[parseInt(e), i]);
    _pg.log('before sorting: ',vals.slice());
    if(order == 'ascending'){
        vals.sort((a,b)=>a[0]-b[0]);
        
    }else if(order == 'descending'){
        vals.sort((a,b)=>b[0]-a[0]);
    }else{ // null, keep, ...
        return false;
    }
    _pg.log('sorted to ', vals);
    vals.forEach((e,i)=>{
        parent.append(eles[e[1]]);
    });
    return true;



}


_pg.one_card = function(arr){
    
    if(!arr || arr.length != 5){
        console.log('skip ');
        return;//skip
    }
    let [fid, image_url, title, summary, extra] = arr;
    _pg.log('loading ', fid);
    let link = "https://mp.weixin.qq.com/s/"+fid;
    let card = $(`<div data-link="${link}" data-t="${extra.publish_time}" class="panel article-card" id="s_${fid}"  >`);
    card.append(`<div class="panel-heading article-author">
        <table><tbody><tr>
        <td><img src="${extra.round_logo || ''}" style=""></td>
        <td><span>${extra.nickname || ''}</span></td>
        <td><span class="publish_time"></span></td>
        </tr></tbody></table>
    </div>`);
    card.append(`
        <div class="panel-body">
            <div class="article-image">
            <img src="${image_url.replace('http://', '//')}">
            </div>
            <div class="article-summary">
            <h3>${title}</h3>
            <p>${summary}</p>
            </div>
        </div>
    `);
    

    $(card).find('.panel-body').click(function(){
        _pg.log('clicked!');
        window.open(link, '_blank');
    });
    let dom_ele = card[0].querySelector(`#s_${fid} .publish_time`);
    //_pg.log(dom_ele);
    setPublishTime(_pg.now, extra.publish_time, extra.publish_date, dom_ele);
    return card;

}

_pg.load_articles = async function (li, info, check_lock){
    // callback
    let t0 = opTime(1);
    // remove old articles if any
    if(!check_lock){ // not lazy loading
        _pg.lazy_lock = true; // lock unfinished lazy loading
        li.children('.article-card').remove();
    }
    
    console.log('loading articles ...');
    for await (arr of info){// in order
        try{
            let card = _pg.one_card(arr);  
            if(!!card){
                if(check_lock && _pg.lazy_lock){
                    console.log('abort lazy loading');
                    return false; 
                } // there may still be race condition here ...
                li.append(card);
                //li.append('<div><hr></div>');
            }

        }catch(e){
            console.log('error skip ', arr, e);
        }
        
        
    }
    if(_pg.order && _pg.reorder){
        _pg.reorder(_pg.order, li, '.article-card', 't');
    } 
    console.log('load time: ', (opTime(1) - t0)/1e3, ' seconds');
    return true;

}

_pg.parseArticle = function(data){
    let html = $.parseHTML(data, null, true);// keepScripts=true
        //https://stackoverflow.com/questions/15403600/jquery-not-finding-elements-in-jquery-parsehtml-result
        let tmpDom = $('<output>').append(html);
        let image_url = getMeta('twitter:image', tmpDom);
        let title = getMeta('twitter:title', tmpDom);
        let summary = getMeta('twitter:description', tmpDom);
        let extra = {};

        let publish = $('script:contains("publish_time")', tmpDom).html();
        let setting = $('script:contains(round_head_img)', tmpDom).html();

        var re_publish = /var\s+\w+\s*=\s*"(\d+)",\s*\w+\s*="(\d+)",\s*\w+\s*=\s*"([^"]+)"/g;
        var re_logo = /var\s+round_head_img\s*=\s*"([^"]+)"/g;
        var re_nickname = /var\s+nickname\s*=\s*"([^"]+)"/g;
        
        if(! image_url || !title || !summary){
            console.log('fail to retrieve ');
            _pg.log(html);
            return null;
        }
        image_url = image_url.  replace('http://', '//');
        // get publish time and round logo
        let publish_res = re_publish.exec(publish);
        let logo_res = re_logo.exec(setting);
        let nickname_res = re_nickname.exec(setting);
        // _pg.log(publish_res, logo_res, nickname_res);
        if(!!publish_res){
            extra.retrieve_time = publish_res[1]; 
            extra.publish_time = publish_res[2]; 
            extra.publish_date = publish_res[3];
        }
        if(!!logo_res){
            extra.round_logo = logo_res[1].replace('http://', '//');
        }
        if(!!nickname_res){
            extra.nickname = nickname_res[1];
        }
        return [image_url, title, summary, extra];
}

_pg.retrieveArticle = async function (fid, ttl){
    ttl = ttl || -1;  // default forever;
    // check localStorage
    let item = _pg.store(fid);
    if(item != null){
        _pg.log('reuse local ', fid);
        return new Promise((resolve)=>resolve(item));
    }

    return $.ajax('/wx/'+fid).then(function(data){
        _pg.log('retrieve article ', fid);
        item = _pg.parseArticle(data);
        if(!!item){
            item.unshift(fid);
            _pg.store(fid, item, ttl);// forever
            console.log('successfully retrieved ', fid);
        }
        return item;
        
    }).catch(function(err){
        console.log('fail to retrieve ', fid, err);
        return null;
    });}

