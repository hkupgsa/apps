// Utilities

import "./weixin.js";
import './elements.js';

window.setPublishTime_new = function(e,t,n,i){ // t: publish_time, i: dom_element
    var o=new Date(1e3*(1*t));
    var c=function(e){
        return "0".concat(e).slice(-2)
    };
    var u = o.getFullYear()+"-"+c(o.getMonth()+1)+"-"+c(o.getDate())+" "+c(o.getHours())+":"+c(o.getMinutes());
    //console.log(u);
    i && (i.innerText=u);
};

window.encF = function(plain, key){ // assuming string input
    if(!key){
        return plain;// skip
    }
    return plain; // TODO: AES CBC
}


// @deprecated
function ajax(url, method) {
    console.warn('abandoned, use fetch instead');
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
window.ajax = ajax;

// @deprecated
function ajaxPOST(obj){
    console.warn('abandoned, use fetch instead');
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
window.ajaxPOST = ajaxPOST;


function dataURItoBlob(dataURI) {
    let [proto, content] = dataURI.split(',');

    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(content);

    // separate out the mime component
    let mimeString = proto.split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});

  }

/**
 * see if DOM is already available
 * @param {*} fn - function to execute
 */
function docReady(fn) {
    // 
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
window.docReady = docReady;


// Namespace _pg

window._pg = window._pg || {}; // config object
let _pg = window._pg;

_pg.random_salt = function(len){// len <= 13
    let salt = Math.random().toString(36); //10 digits+ 26 letters
    return salt.substring(salt.length-len);
}

_pg.log = function(...args){
    if(_pg.debug){ // silent if not debug
        console.log(...args);
    }
}

_pg.ajax = ajaxPOST; // @deprecated

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

_pg.getVer = function(ver){
    return ver.substr(1).split(_pg.ver_sep).map((e)=>parseInt(e));
}

_pg.purgeStore = function(_ver){
    let storage = window.localStorage;
    let cur = _pg.getVer(_ver);
    Object.keys(storage).forEach((key)=>{
        let v = key.split(_pg.sep)[0];
        if( _pg.getVer(v) < cur ){
            console.log('purging storage of old version', key);
            storage.removeItem(key);
        }
        
     });
}

_pg.init = function(){
    _pg.sec = _pg.sec || 'h'; // default section home;
    _pg.ver = _pg.ver || 'v1.3.0'; // default version; 
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
// reorder element according to data attribute, without jQuery
_pg.reorder = function(order, parent, sel, attr){
    // order in {null, latest, oldest}
    if(_pg.allow_orders.indexOf(order)<0){
        _pg.log('unsupported order ', order);
        return false; // ignore unsupported order
    }
    let eles = parent.querySelectorAll(sel);
    // TODO: deduplicate here? detect identical
    let vals = Array.prototype.map.call(eles,
        (ele, i)=>[parseInt(ele.dataset[attr]),i]
    );
    _pg.log('before sorting: ',vals.slice());
    if(order == 'ascending'){
        vals.sort((a,b)=>a[0]-b[0]);
        
    }else if(order == 'descending'){
        vals.sort((a,b)=>b[0]-a[0]);
    }else{ // null, keep, ...
        return false; // no change
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
    card.dataset.t = extra.publish_time;
    card.dataset.link = link;
    card.setAttribute('id', 's_' + fid);
    
    let e1 = `[".panel-heading.article-author",{},table,{},tbody,{},tr,{},[
        [td,{},img,{src:"${extra.round_logo || ''}"},[]],
        [td,{},span,{},"${extra.nickname || ''}"],
        [td,{},[["span.publish_time"]]]
    ]]`;
    let e2 = `[".panel-body",{},[
        [".article-image",{},img,{src:"${image_url.replace('http://', '//')}"},[]],
        [".article-summary",{},[
            [h3,{},"${title}"],
            [p,{},"${summary}"]
        ]]
    ]]`;
    card.appendChild(_pg.create_ele(e1));
    card.appendChild(_pg.create_ele(e2));
    

    card.querySelector('.panel-body').addEventListener('click', ()=>{
        _pg.log('clicked!');
        window.open(link, '_blank');
    });
    let dom_ele = card.querySelector(`#s_${fid} .publish_time`);
    //_pg.log(dom_ele);
    setPublishTime_new(_pg.now, extra.publish_time, extra.publish_date, dom_ele);
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
    for await (let arr of info){// in order
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
        let image_url = getMeta('twitter:image', tmpDom),
            title = getMeta('twitter:title', tmpDom),
            summary = getMeta('twitter:description', tmpDom),
            extra = {};

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

        //var re_publish = /var\s+\w+\s*=\s*"(\d+)",\s*\w+\s*="(\d+)",\s*\w+\s*=\s*"([^"]+)"/g;
        let re_publish_new = /oriCreateTime\s*=\s*'(\d{10})'/g; // changed from " to ' (single quotes)
        let re_logo = /var\s+round_head_img\s*=\s*"([^"]+)"/g;
        let re_nickname = /var\s+nickname\s*=\s*(?:htmlDecode\()?"([^"]+)"/g; // forget group
        
        if(! image_url || !title || !summary){
            console.log('fail to retrieve ');
            _pg.log(html);
            return null;
        }
        image_url = image_url.replace('http://', '//');
        // get publish time and round logo
        let publish_res = re_publish_new.exec(publish); // match once the value of oriCreateTime
        let logo_res = re_logo.exec(setting);
        let nickname_res = re_nickname.exec(setting);
        // _pg.log(publish_res, logo_res, nickname_res);
        if(!!publish_res){
            extra.retrieve_time = 0; //publish_res[1]; 
            extra.publish_time = publish_res[1];
            extra.publish_date = 0; //publish_res[3];
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

    return fetch('/wx/'+fid).then((resp)=>resp.text()).then((data)=>{
        _pg.log('retrieve article ', fid);
        item = _pg.parseArticle(data);
        if(!!item){
            item.unshift(fid);
            _pg.store(fid, item, ttl);// forever
            console.log('successfully retrieved ', fid);
        }
        return item;
        
    }).catch((err)=>{
        console.log('fail to retrieve ', fid, err);
        return null;
    });
}

// canvas drawing

_pg.drawTicketAsync = function (canvas, style, obj, canvases){ // TODO: test
    return new Promise(function(resolve, reject){
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
            
            resolve({tno:tno, png_base64: canvas.toDataURL("image/png")});// return base64_img
        }
        bg.src = style.background.path;
    });
}

_pg.drawTicket = function(canvas, style, obj, canvases){
    let {tno, qrsize, add_to} = obj;
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
        if(!!add_to){
            add_to.file(tno + '.png', canvas.toDataURL("image/png").split('base64,')[1], {base64: true});
        }


    }

    bg.src = style.background.path;
    return true;
}

_pg.drawMCard = function(canvas, style, obj, canvases){
    let {surname, given_name, uno, since_year, unverified} = obj || {};
    let {qr, avatar, badges} = canvases || {};
    
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
            const avatar_size = style.pos.avatar.size;
            let cur_x = style.pos.avatar.x, cur_y = style.pos.avatar.y;
            if(!!style.pos.avatar.fill){
                ctx.fillStyle=style.pos.avatar.fill;
                ctx.fillRect(cur_x, cur_y, 
                    avatar_size, avatar_size);
            }
            if(!!style.pos.avatar.border){
                ctx.strokeStyle='white';
                ctx.strokeRect(cur_x-1, cur_y-1, 
                    avatar_size+2, avatar_size+2);
            }
            ctx.drawImage(avatar, style.pos.avatar.x, style.pos.avatar.y);
        }
        if(!!badges){
            const num_badge = badges.length;
            const badge_size = style.pos.badge.size;
            
            let cur_x = style.pos.badge.x, cur_y = style.pos.badge.y;
            badges.slice(0, style.pos.badge.size || num_badge).forEach((badge)=>{
                if(!!style.pos.badge.border){
                    ctx.strokeStyle='white';
                    ctx.strokeRect(cur_x-1, cur_y-1, 
                        badge_size+2, badge_size+2);
                }
                if(!!style.pos.badge.fill){
                    ctx.fillStyle=style.pos.badge.fill;
                    ctx.fillRect(cur_x, cur_y, 
                        badge_size, badge_size);
                }
                ctx.drawImage(badge, cur_x, cur_y);
                cur_x += style.pos.badge.x_sep + badge_size;
            });
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
