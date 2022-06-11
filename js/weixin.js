/**
 * @file utility functions modified from WeChat
 * @author cs.pgsa
 */

/**
 * current system time (in seconds by default)
 * @param {number} [scale=1e3] - number of miliseconds to scale by 
 * @returns {void}
 */
 window.opTime = (scale) => (new Date().getTime() / (scale ||  1e3) ) >> 0;


 /**
  * @callback decodeFunc
  * @param {string} encoded 
  * @returns {string} decoded text
  */
 
 /**
  * parse a url query string into an object
  * @param {string} url 
  * @param {decodeFunc=} decode - identify function by default
  * @returns {Object}
  */
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
 /**
  * get meta property in head section
  * @param {string} name - meta property name
  * @param {Object} dom 
  * @returns {string}
  */
 window.getMeta = function(name, dom){
     dom = dom || document;
     return dom.querySelector(`meta[property="${name}"]`).getAttribute('content');
 }
 
 /**
  * @deprecated from wechat; use setPublishTime_new instead
  * @param {number} e - current time in seconds
  * @param {number} t - publish time in seconds 
  * @param {string} s - formated date
  * @param {Object} o - DOM element
  */
 window.setPublishTime = function(e,t,s,o){ // now:secs (deprecated), publish:secs, date_str (deprecated), dom_element
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
 };

 /**
 * 
 * @returns {boolean} whether the current browser is weixin
 */
window.isInWeixinApp = function() {
    return /MicroMessenger/.test(navigator.userAgent);
};
