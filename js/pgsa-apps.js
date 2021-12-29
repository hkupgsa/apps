// Utilities

window.opTime = (scale) => (new Date().getTime() / (scale ||  1e3) ) >> 0;

window.encF = function(plain, key){ // assuming string input
    if(!key){
        return plain;// skip
    }
    return plain; // TODO: AES CBC
}

window.getQueryFromURL = function(url, decode) {
    decode = decode || ( (e)=>e );
    url = url || 'https://example.hku.hk/s?a=b#rd'; 
    let tmp = url.split('?'),
        query = (tmp[1] || "").split('#')[0].split('&'),
        params = {};
    for (let i=0; i<query.length; i++) {
        let arg = query[i].split('=');
        params[decode(arg[0])] = decode(arg[1]);
    }
   
    return params;
};

window.getMeta = function(name, dom){
    return dom.querySelector(`meta[property="${name}"]`).getAttribute('content');
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

String.prototype.html = function(encode) {
    var replace =["&#39;", "'", "&quot;", '"', "&nbsp;", " ", "&gt;", ">", "&lt;", "<", "&yen;", "¥", "&amp;", "&"];
    var replaceReverse = ["&", "&amp;", "¥", "&yen;", "<", "&lt;", ">", "&gt;", " ", "&nbsp;", '"', "&quot;", "'", "&#39;"];
    var target;
    if (encode) {
        target = replaceReverse;
    } else {
        target = replace;
    }
    for (var i=0,str=this;i< target.length;i+= 2) {
         str=str.replace(new RegExp(target[i],'g'),target[i+1]);
    }
    return str;
};

window.isInWeixinApp = function() {
    return /MicroMessenger/.test(navigator.userAgent);
};

function ajax(url, method) {
    method = method || 'GET';

	// Create the XHR request
	let request = new XMLHttpRequest();

	// Return it as a Promise
	return new Promise((resolve, reject) => {

		// Setup our listener to process compeleted requests
		request.onreadystatechange = () => {

			// Only run if the request is complete
            if (request.readyState !== 4) return;

			// Process the response
			if (request.status >= 200 && request.status < 300) {
				// If successful
				resolve(request.responseText);
			} else {
				// If failed
				reject({
					status: request.status,
					statusText: request.statusText
				});
			}

		};

		// Setup our HTTP request
		request.open(method, url, true);

		// Send the request
		request.send();

	});
};

// TODO: proxify
function ajaxPOST(obj){
    let url   = obj.url;
    let xhr   = new XMLHttpRequest();

    let data = null;
    if (typeof obj.data == "object"){
        var d = obj.data;
        if(!obj.form){ // form urlencoded
            data = [];
            for(let k in d) {
                if (d.hasOwnProperty(k)){
                    data.push(k + "=" + encodeURIComponent(d[k]));
                }
            }
            data = data.join("&");

        }else{ // formdata
            data = new FormData();
            obj.blob && ( data.enctype="multipart/form-data" );
            for(let k in d) {
                if (d.hasOwnProperty(k)){
                    data.append(k,  d[k]);
                }
            }
        }
        
    }else{
        data = typeof obj.data  == 'string' ? obj.data : null;
    }
    xhr.open(obj.method  || 'POST', url, true);
    obj.blob && ( xhr.responseType = "blob" );
    xhr.onreadystatechange = function(){
        if( xhr.readyState == 4 ){
            if( xhr.status >= 200 && xhr.status < 400 ){
                obj.success && obj.success(obj.blob? xhr.response.blob(): xhr.responseText);
            } else {
                obj.error && obj.error(xhr);
            }
            obj.complete && obj.complete();
            obj.complete = null;
        }
    };
    if(obj.content_type!=false)
        xhr.setRequestHeader("Content-Type", obj.content_type || "application/x-www-form-urlencoded; charset=UTF-8");
        
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(data);
}


function dataURItoBlob(dataURI) {
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;

  }


function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
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
            console.log('err get storage:', _key);
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
    _pg.ver = _pg.ver || 'v1.0.1'; // default version 1; 
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
// without jQuery
_pg.reorder = function(order, parent, sel, attr){
    // order in {null, latest, oldest}
    if(_pg.allow_orders.indexOf(order)<0){
        _pg.log('unsupported order ', order);
        return false; // ignore unsupported order
    }
    let eles = parent.querySelectorAll(sel);
    // TODO: deduplicate here? detect identical
    let vals = Array.prototype.map.call(eles,
        (ele, i)=>[parseInt(ele.getAttribute('data-'+attr)),i]
    );
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
        parent.appendChild(eles[e[1]]);
    });
    return true;



}

// without jQuery
_pg.one_card = function(arr){
    
    if(!arr || arr.length != 5){
        console.log('skip ');
        return;//skip
    }
    let [fid, image_url, title, summary, extra] = arr;
    _pg.log('loading ', fid);
    let link = "https://mp.weixin.qq.com/s/"+fid;
    let card = document.createElement('div');
    card.classList.add('panel', 'article-card');
    card.setAttribute('data-t', extra.publish_time);
    card.setAttribute('data-link', link);
    card.setAttribute('id', 's_' + fid);
    card.innerHTML = `
    <div class="panel-heading article-author">
        <table><tbody><tr>
        <td><img src="${extra.round_logo || ''}" style=""></td>
        <td><span>${extra.nickname || ''}</span></td>
        <td><span class="publish_time"></span></td>
        </tr></tbody></table>
    </div>
    <div class="panel-body">
        <div class="article-image">
        <img src="${image_url.replace('http://', '//')}">
        </div>
        <div class="article-summary">
        <h3>${title}</h3>
        <p>${summary}</p>
        </div>
    </div>`;
    

    card.querySelector('.panel-body').addEventListener('click', ()=>{
        _pg.log('clicked!');
        window.open(link, '_blank');
    });
    let dom_ele = card.querySelector(`#s_${fid} .publish_time`);
    //_pg.log(dom_ele);
    setPublishTime(_pg.now, extra.publish_time, extra.publish_date, dom_ele);
    return card;

}

// without jQuery
_pg.load_articles = async function (li, info, check_lock){
    // callback
    let t0 = opTime(1);
    // remove old articles if any
    if(!check_lock){ // not lazy loading
        _pg.lazy_lock = true; // lock unfinished lazy loading
        _pg.log('remove lazy added nodes');
        li.querySelectorAll('.article-card').forEach(e=>e.parentNode.removeChild(e));
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
                li.appendChild(card);
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
// without jQuery
_pg.parseArticle = function(data){
        let tmpDom = document.createElement('output');
        tmpDom.innerHTML = data;
        let image_url = getMeta('twitter:image', tmpDom);
        let title = getMeta('twitter:title', tmpDom);
        let summary = getMeta('twitter:description', tmpDom);
        let extra = {};

        function contains(s, t){
            return Array.prototype.filter.call(s, 
                (e)=>(e.textContent || e.innerText).indexOf(t) > -1
            );
        }

        let scripts = tmpDom.querySelectorAll('script');
        let publish = contains(scripts, 'publish_time');
        publish = publish.length? publish[0].innerHTML : '';

        let setting = contains(scripts, 'round_head_img');
        setting = setting.length? setting[0].innerHTML: '';

        var re_publish = /var\s+\w+\s*=\s*"(\d+)",\s*\w+\s*="(\d+)",\s*\w+\s*=\s*"([^"]+)"/g;
        var re_logo = /var\s+round_head_img\s*=\s*"([^"]+)"/g;
        var re_nickname = /var\s+nickname\s*=\s*"([^"]+)"/g;
        
        if(! image_url || !title || !summary){
            console.log('fail to retrieve ');
            _pg.log(html);
            return null;
        }
        image_url = image_url.replace('http://', '//');
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

    return ajax('/wx/'+fid).then(function(data){
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
    });
}

// canvas drawing

_pg.drawTicket = function(canvas, style, obj, canvases){
    let {tno, qrsize} = obj;
    let {qr} = canvases || {};
    let bg = new Image();
    
    let ctx = canvas.getContext('2d');
    bg.onload = ()=>{
        canvas.width=bg.width;
        canvas.height=bg.height;
        //_pg.log(bg.width, bg.height);
        ctx.drawImage(bg, 0, 0);//

        // drawing ticket no.

        ctx.font=style.font.size1+' '+style.font.family;
        ctx.fillStyle=style.font.color1;
        ctx.textAlign = style.pos.tno1.align; // 'center',
        ctx.fillText(tno, style.pos.tno1.x, style.pos.tno1.y);

        ctx.font=style.font.size2+' '+style.font.family;
        ctx.fillStyle=style.font.color2;
        ctx.textAlign = style.pos.tno2.align; // 'center',
        ctx.fillText(tno, style.pos.tno2.x, style.pos.tno2.y);

        if(!!qr){
            ctx.drawImage(qr, style.pos.qr.x - qrsize/2, style.pos.qr.y - qrsize/2);
        }



    }

    bg.src = style.background.path;
    return true;

    


}

_pg.drawMCard = function(canvas, style, obj, canvases){
    let {surname, given_name, uno, since_year, unverified} = obj || {};
    let {qr, avatar} = canvases || {};
    
    _pg.log(`generating membership card for ${given_name} ${surname} of ID ${uno} since year ${since_year}`);
    let bg = new Image();
    
    let ctx = canvas.getContext('2d');

    let disName = given_name + ' ' + surname;

    let lenName = disName.length, sizeName;
    if (lenName < 10){
        sizeName = 45;
    }else if(lenName < 15) {
        sizeName = 40;
        
    }else if(lenName < 20){
        sizeName = 35;
    }else{
        sizeName = 30;
    }

    
    bg.onload = ()=>{
        canvas.width=bg.width;
        canvas.height=bg.height;
        //_pg.log(bg.width, bg.height);
        ctx.drawImage(bg, 0, 0);//

        ctx.fillStyle=style.font.color;

        ctx.font=sizeName+'pt '+style.font.family;
        ctx.textAlign = style.pos.name.align; // 'center',
        ctx.fillText(disName.toUpperCase(), style.pos.name.x, style.pos.name.y);

        ctx.font='30pt '+style.font.family;
        ctx.textAlign = style.pos.uno.align; //'right';
        ctx.fillText(uno, style.pos.uno.x, style.pos.uno.y);
        ctx.textAlign = style.pos.since_year.align; // 'right';
        ctx.fillText(since_year, style.pos.since_year.x, style.pos.since_year.y);

        if(!!qr){
            const qr_size = 256;
            ctx.drawImage(qr, style.pos.qr.x, style.pos.qr.y);
            if(!!style.pos.qr.border){
                // white border
                ctx.strokeStyle='white';
                ctx.strokeRect(style.pos.qr.x-1, style.pos.qr.y-1, qr_size+2, qr_size+2);
            }
            
        }
        if(!!avatar){
            const avatar_size = 256;
            if(!!style.pos.avatar.border){
                ctx.strokeStyle='white';
                ctx.strokeRect(style.pos.avatar.x-1, style.pos.avatar.y-1, 
                    avatar_size+2, avatar_size+2);
            }
            ctx.drawImage(avatar, style.pos.avatar.x, style.pos.avatar.y);

        }
        if(!!unverified){
            // Red Not Verified
            ctx.save();
            ctx.translate(bg.width/2, bg.height/2);
            ctx.rotate(-Math.PI/4);
            ctx.textAlign = "center";
            ctx.font="90pt "+style.font.family;
            ctx.fillStyle='rgba(255,0,0,0.75)';
            ctx.fillText(unverified || "Not Verified", -200, -100);
            ctx.fillText(unverified || "Not Verified", 200, 300);
            ctx.restore();
        }
    }
    bg.src = style.background.path;
    return true;

}

_pg.saveCard = function(canvas, uno, pre){
    var pre = pre || "PGSA_Membership_Card_";
    return typeof saveAs == 'undefined'? null: saveAs(
        dataURItoBlob(canvas.toDataURL("image/jpeg")), 
        pre+uno+".jpg"
    );  
}

