window.getQueryFromURL = function(url) {
    url = url || 'https://example.com/s?a=b#rd'; 
    var tmp = url.split('?'),
        query = (tmp[1] || "").split('#')[0].split('&'),
        params = {};
    for (var i=0; i<query.length; i++) {
        var arg = query[i].split('=');
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

window.setPublishTime = function(e,t,s,o){ // now:secs, publish:secs, date_str, dom_element
    var n="",i=86400,a=new Date(1e3*e),d=1*t,f=s||"";
    a.setHours(0),a.setMinutes(0),a.setSeconds(0);
    var r=a.getTime()/1e3;
    a.setDate(1),a.setMonth(0);
    var l=a.getTime()/1e3;
    if(d>=r)n="Today";else if(d>=r-i)n="Yesterday";else if(d>=r-2*i)n="2 days ago";else if(d>=r-3*i)n="3 days ago";else if(d>=r-4*i)n="4 days ago";else if(d>=r-5*i)n="5 days ago";else if(d>=r-6*i)n="6 days ago";else if(d>=r-14*i)n="1 week ago";else if(d>=l){
    var c=f.split("-");
    n="%s/%s".replace("%s",parseInt(c[1],10)).replace("%s",parseInt(c[2],10));
    }else n=f;
    o&&(o.innerText=n,setTimeout(function(){
    o.onclick=function(){
    o.innerText=f;
    };
    },10));
}

