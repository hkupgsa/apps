
    
!function(e,t){
    "object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Darkmode",[],t):"object"==typeof exports?exports.Darkmode=t():e.Darkmode=t();
    }(window,function(){
    return function(e){
    function t(n){
    if(r[n])return r[n].exports;
    var a=r[n]={
    i:n,
    l:!1,
    exports:{}
    };
    return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports;
    }
    var r={};
    return t.m=e,t.c=r,t.d=function(e,r,n){
    t.o(e,r)||Object.defineProperty(e,r,{
    enumerable:!0,
    get:n
    });
    },t.r=function(e){
    "undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{
    value:"Module"
    }),Object.defineProperty(e,"__esModule",{
    value:!0
    });
    },t.t=function(e,r){
    if(1&r&&(e=t(e)),8&r)return e;
    if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;
    var n=Object.create(null);
    if(t.r(n),Object.defineProperty(n,"default",{
    enumerable:!0,
    value:e
    }),2&r&&"string"!=typeof e)for(var a in e)t.d(n,a,function(t){
    return e[t];
    }.bind(null,a));
    return n;
    },t.n=function(e){
    var r=e&&e.__esModule?function(){
    return e.default;
    }:function(){
    return e;
    };
    return t.d(r,"a",r),r;
    },t.o=function(e,t){
    return Object.prototype.hasOwnProperty.call(e,t);
    },t.p="",t(t.s=9);
    }([function(e,t,r){
    "use strict";
    function n(e,t){
    if(!(this instanceof n))return new n(e,t);
    if(t&&t in h&&(t=null),t&&!(t in u))throw new Error("Unknown model: "+t);
    var r,a;
    if(null==e)this.model="rgb",this.color=[0,0,0],this.valpha=1;else if(e instanceof n)this.model=e.model,
    this.color=e.color.slice(),this.valpha=e.valpha;else if("string"==typeof e){
    var o=l.get(e);
    if(null===o)throw new Error("Unable to parse color from string: "+e);
    this.model=o.model,a=u[this.model].channels,this.color=o.value.slice(0,a),this.valpha="number"==typeof o.value[a]?o.value[a]:1;
    }else if(e.length){
    this.model=t||"rgb",a=u[this.model].channels;
    var i=c.call(e,0,a);
    this.color=s(i,a),this.valpha="number"==typeof e[a]?e[a]:1;
    }else if("number"==typeof e)e&=16777215,this.model="rgb",this.color=[e>>16&255,e>>8&255,255&e],
    this.valpha=1;else{
    this.valpha=1;
    var d=Object.keys(e);
    "alpha"in e&&(d.splice(d.indexOf("alpha"),1),this.valpha="number"==typeof e.alpha?e.alpha:0);
    var b=d.sort().join("");
    if(!(b in f))throw new Error("Unable to parse color from object: "+JSON.stringify(e));
    this.model=f[b];
    var p=u[this.model].labels,m=[];
    for(r=0;r<p.length;r++)m.push(e[p[r]]);
    this.color=s(m);
    }
    if(g[this.model])for(a=u[this.model].channels,r=0;a>r;r++){
    var y=g[this.model][r];
    y&&(this.color[r]=y(this.color[r]));
    }
    this.valpha=Math.max(0,Math.min(1,this.valpha)),Object.freeze&&Object.freeze(this);
    }
    function a(e,t,r){
    return(e=Array.isArray(e)?e:[e]).forEach(function(e){
    (g[e]||(g[e]=[]))[t]=r;
    }),e=e[0],function(n){
    var a;
    return arguments.length?(r&&(n=r(n)),(a=this[e]()).color[t]=n,a):(a=this[e]().color[t],
    r&&(a=r(a)),a);
    };
    }
    function o(e){
    return function(t){
    return Math.max(0,Math.min(e,t));
    };
    }
    function i(e){
    return Array.isArray(e)?e:[e];
    }
    function s(e,t){
    for(var r=0;t>r;r++)"number"!=typeof e[r]&&(e[r]=0);
    return e;
    }
    var l=r(3),u=r(6),c=[].slice,h=["keyword","gray","hex"],f={};
    Object.keys(u).forEach(function(e){
    f[c.call(u[e].labels).sort().join("")]=e;
    });
    var g={};
    n.prototype={
    toString:function(){
    return this.string();
    },
    toJSON:function(){
    return this[this.model]();
    },
    string:function(e){
    var t=this.model in l.to?this:this.rgb(),r=1===(t=t.round("number"==typeof e?e:1)).valpha?t.color:t.color.concat(this.valpha);
    return l.to[t.model](r);
    },
    percentString:function(e){
    var t=this.rgb().round("number"==typeof e?e:1),r=1===t.valpha?t.color:t.color.concat(this.valpha);
    return l.to.rgb.percent(r);
    },
    array:function(){
    return 1===this.valpha?this.color.slice():this.color.concat(this.valpha);
    },
    object:function(){
    for(var e={},t=u[this.model].channels,r=u[this.model].labels,n=0;t>n;n++)e[r[n]]=this.color[n];
    return 1!==this.valpha&&(e.alpha=this.valpha),e;
    },
    unitArray:function(){
    var e=this.rgb().color;
    return e[0]/=255,e[1]/=255,e[2]/=255,1!==this.valpha&&e.push(this.valpha),e;
    },
    unitObject:function(){
    var e=this.rgb().object();
    return e.r/=255,e.g/=255,e.b/=255,1!==this.valpha&&(e.alpha=this.valpha),e;
    },
    round:function(e){
    return e=Math.max(e||0,0),new n(this.color.map(function(e){
    return function(t){
    return function(e,t){
    return Number(e.toFixed(t));
    }(t,e);
    };
    }(e)).concat(this.valpha),this.model);
    },
    alpha:function(e){
    return arguments.length?new n(this.color.concat(Math.max(0,Math.min(1,e))),this.model):this.valpha;
    },
    red:a("rgb",0,o(255)),
    green:a("rgb",1,o(255)),
    blue:a("rgb",2,o(255)),
    hue:a(["hsl","hsv","hsl","hwb","hcg"],0,function(e){
    return(e%360+360)%360;
    }),
    saturationl:a("hsl",1,o(100)),
    lightness:a("hsl",2,o(100)),
    saturationv:a("hsv",1,o(100)),
    value:a("hsv",2,o(100)),
    chroma:a("hcg",1,o(100)),
    gray:a("hcg",2,o(100)),
    white:a("hwb",1,o(100)),
    wblack:a("hwb",2,o(100)),
    cyan:a("cmyk",0,o(100)),
    magenta:a("cmyk",1,o(100)),
    yellow:a("cmyk",2,o(100)),
    black:a("cmyk",3,o(100)),
    x:a("xyz",0,o(100)),
    y:a("xyz",1,o(100)),
    z:a("xyz",2,o(100)),
    l:a("lab",0,o(100)),
    a:a("lab",1),
    b:a("lab",2),
    keyword:function(e){
    return arguments.length?new n(e):u[this.model].keyword(this.color);
    },
    hex:function(e){
    return arguments.length?new n(e):l.to.hex(this.rgb().round().color);
    },
    rgbNumber:function(){
    var e=this.rgb().color;
    return(255&e[0])<<16|(255&e[1])<<8|255&e[2];
    },
    luminosity:function(){
    for(var e=this.rgb().color,t=[],r=0;r<e.length;r++){
    var n=e[r]/255;
    t[r]=.03928>=n?n/12.92:Math.pow((n+.055)/1.055,2.4);
    }
    return.2126*t[0]+.7152*t[1]+.0722*t[2];
    },
    contrast:function(e){
    var t=this.luminosity(),r=e.luminosity();
    return t>r?(t+.05)/(r+.05):(r+.05)/(t+.05);
    },
    level:function(e){
    var t=this.contrast(e);
    return t>=7.1?"AAA":t>=4.5?"AA":"";
    },
    isDark:function(){
    var e=this.rgb().color;
    return(299*e[0]+587*e[1]+114*e[2])/1e3<128;
    },
    isLight:function(){
    return!this.isDark();
    },
    negate:function(){
    for(var e=this.rgb(),t=0;3>t;t++)e.color[t]=255-e.color[t];
    return e;
    },
    lighten:function(e){
    var t=this.hsl();
    return t.color[2]+=t.color[2]*e,t;
    },
    darken:function(e){
    var t=this.hsl();
    return t.color[2]-=t.color[2]*e,t;
    },
    saturate:function(e){
    var t=this.hsl();
    return t.color[1]+=t.color[1]*e,t;
    },
    desaturate:function(e){
    var t=this.hsl();
    return t.color[1]-=t.color[1]*e,t;
    },
    whiten:function(e){
    var t=this.hwb();
    return t.color[1]+=t.color[1]*e,t;
    },
    blacken:function(e){
    var t=this.hwb();
    return t.color[2]+=t.color[2]*e,t;
    },
    grayscale:function(){
    var e=this.rgb().color,t=.3*e[0]+.59*e[1]+.11*e[2];
    return n.rgb(t,t,t);
    },
    fade:function(e){
    return this.alpha(this.valpha-this.valpha*e);
    },
    opaquer:function(e){
    return this.alpha(this.valpha+this.valpha*e);
    },
    rotate:function(e){
    var t=this.hsl(),r=t.color[0];
    return r=(r=(r+e)%360)<0?360+r:r,t.color[0]=r,t;
    },
    mix:function(e,t){
    if(!e||!e.rgb)throw new Error('Argument to "mix" was not a Color instance, but rather an instance of '+typeof e);
    var r=e.rgb(),a=this.rgb(),o=void 0===t?.5:t,i=2*o-1,s=r.alpha()-a.alpha(),l=((i*s==-1?i:(i+s)/(1+i*s))+1)/2,u=1-l;
    return n.rgb(l*r.red()+u*a.red(),l*r.green()+u*a.green(),l*r.blue()+u*a.blue(),r.alpha()*o+a.alpha()*(1-o));
    }
    },Object.keys(u).forEach(function(e){
    if(-1===h.indexOf(e)){
    var t=u[e].channels;
    n.prototype[e]=function(){
    if(this.model===e)return new n(this);
    if(arguments.length)return new n(arguments,e);
    var r="number"==typeof arguments[t]?t:this.valpha;
    return new n(i(u[this.model][e].raw(this.color)).concat(r),e);
    },n[e]=function(r){
    return"number"==typeof r&&(r=s(c.call(arguments),t)),new n(r,e);
    };
    }
    }),e.exports=n;
    },function(e){
    "use strict";
    e.exports={
    aliceblue:[240,248,255],
    antiquewhite:[250,235,215],
    aqua:[0,255,255],
    aquamarine:[127,255,212],
    azure:[240,255,255],
    beige:[245,245,220],
    bisque:[255,228,196],
    black:[0,0,0],
    blanchedalmond:[255,235,205],
    blue:[0,0,255],
    blueviolet:[138,43,226],
    brown:[165,42,42],
    burlywood:[222,184,135],
    cadetblue:[95,158,160],
    chartreuse:[127,255,0],
    chocolate:[210,105,30],
    coral:[255,127,80],
    cornflowerblue:[100,149,237],
    cornsilk:[255,248,220],
    crimson:[220,20,60],
    cyan:[0,255,255],
    darkblue:[0,0,139],
    darkcyan:[0,139,139],
    darkgoldenrod:[184,134,11],
    darkgray:[169,169,169],
    darkgreen:[0,100,0],
    darkgrey:[169,169,169],
    darkkhaki:[189,183,107],
    darkmagenta:[139,0,139],
    darkolivegreen:[85,107,47],
    darkorange:[255,140,0],
    darkorchid:[153,50,204],
    darkred:[139,0,0],
    darksalmon:[233,150,122],
    darkseagreen:[143,188,143],
    darkslateblue:[72,61,139],
    darkslategray:[47,79,79],
    darkslategrey:[47,79,79],
    darkturquoise:[0,206,209],
    darkviolet:[148,0,211],
    deeppink:[255,20,147],
    deepskyblue:[0,191,255],
    dimgray:[105,105,105],
    dimgrey:[105,105,105],
    dodgerblue:[30,144,255],
    firebrick:[178,34,34],
    floralwhite:[255,250,240],
    forestgreen:[34,139,34],
    fuchsia:[255,0,255],
    gainsboro:[220,220,220],
    ghostwhite:[248,248,255],
    gold:[255,215,0],
    goldenrod:[218,165,32],
    gray:[128,128,128],
    green:[0,128,0],
    greenyellow:[173,255,47],
    grey:[128,128,128],
    honeydew:[240,255,240],
    hotpink:[255,105,180],
    indianred:[205,92,92],
    indigo:[75,0,130],
    ivory:[255,255,240],
    khaki:[240,230,140],
    lavender:[230,230,250],
    lavenderblush:[255,240,245],
    lawngreen:[124,252,0],
    lemonchiffon:[255,250,205],
    lightblue:[173,216,230],
    lightcoral:[240,128,128],
    lightcyan:[224,255,255],
    lightgoldenrodyellow:[250,250,210],
    lightgray:[211,211,211],
    lightgreen:[144,238,144],
    lightgrey:[211,211,211],
    lightpink:[255,182,193],
    lightsalmon:[255,160,122],
    lightseagreen:[32,178,170],
    lightskyblue:[135,206,250],
    lightslategray:[119,136,153],
    lightslategrey:[119,136,153],
    lightsteelblue:[176,196,222],
    lightyellow:[255,255,224],
    lime:[0,255,0],
    limegreen:[50,205,50],
    linen:[250,240,230],
    magenta:[255,0,255],
    maroon:[128,0,0],
    mediumaquamarine:[102,205,170],
    mediumblue:[0,0,205],
    mediumorchid:[186,85,211],
    mediumpurple:[147,112,219],
    mediumseagreen:[60,179,113],
    mediumslateblue:[123,104,238],
    mediumspringgreen:[0,250,154],
    mediumturquoise:[72,209,204],
    mediumvioletred:[199,21,133],
    midnightblue:[25,25,112],
    mintcream:[245,255,250],
    mistyrose:[255,228,225],
    moccasin:[255,228,181],
    navajowhite:[255,222,173],
    navy:[0,0,128],
    oldlace:[253,245,230],
    olive:[128,128,0],
    olivedrab:[107,142,35],
    orange:[255,165,0],
    orangered:[255,69,0],
    orchid:[218,112,214],
    palegoldenrod:[238,232,170],
    palegreen:[152,251,152],
    paleturquoise:[175,238,238],
    palevioletred:[219,112,147],
    papayawhip:[255,239,213],
    peachpuff:[255,218,185],
    peru:[205,133,63],
    pink:[255,192,203],
    plum:[221,160,221],
    powderblue:[176,224,230],
    purple:[128,0,128],
    rebeccapurple:[102,51,153],
    red:[255,0,0],
    rosybrown:[188,143,143],
    royalblue:[65,105,225],
    saddlebrown:[139,69,19],
    salmon:[250,128,114],
    sandybrown:[244,164,96],
    seagreen:[46,139,87],
    seashell:[255,245,238],
    sienna:[160,82,45],
    silver:[192,192,192],
    skyblue:[135,206,235],
    slateblue:[106,90,205],
    slategray:[112,128,144],
    slategrey:[112,128,144],
    snow:[255,250,250],
    springgreen:[0,255,127],
    steelblue:[70,130,180],
    tan:[210,180,140],
    teal:[0,128,128],
    thistle:[216,191,216],
    tomato:[255,99,71],
    turquoise:[64,224,208],
    violet:[238,130,238],
    wheat:[245,222,179],
    white:[255,255,255],
    whitesmoke:[245,245,245],
    yellow:[255,255,0],
    yellowgreen:[154,205,50]
    };
    },function(e,t,r){
    var n=r(7),a={};
    for(var o in n)n.hasOwnProperty(o)&&(a[n[o]]=o);
    var i=e.exports={
    rgb:{
    channels:3,
    labels:"rgb"
    },
    hsl:{
    channels:3,
    labels:"hsl"
    },
    hsv:{
    channels:3,
    labels:"hsv"
    },
    hwb:{
    channels:3,
    labels:"hwb"
    },
    cmyk:{
    channels:4,
    labels:"cmyk"
    },
    xyz:{
    channels:3,
    labels:"xyz"
    },
    lab:{
    channels:3,
    labels:"lab"
    },
    lch:{
    channels:3,
    labels:"lch"
    },
    hex:{
    channels:1,
    labels:["hex"]
    },
    keyword:{
    channels:1,
    labels:["keyword"]
    },
    ansi16:{
    channels:1,
    labels:["ansi16"]
    },
    ansi256:{
    channels:1,
    labels:["ansi256"]
    },
    hcg:{
    channels:3,
    labels:["h","c","g"]
    },
    apple:{
    channels:3,
    labels:["r16","g16","b16"]
    },
    gray:{
    channels:1,
    labels:["gray"]
    }
    };
    for(var s in i)if(i.hasOwnProperty(s)){
    if(!("channels"in i[s]))throw new Error("missing channels property: "+s);
    if(!("labels"in i[s]))throw new Error("missing channel labels property: "+s);
    if(i[s].labels.length!==i[s].channels)throw new Error("channel and label counts mismatch: "+s);
    var l=i[s].channels,u=i[s].labels;
    delete i[s].channels,delete i[s].labels,Object.defineProperty(i[s],"channels",{
    value:l
    }),Object.defineProperty(i[s],"labels",{
    value:u
    });
    }
    i.rgb.hsl=function(e){
    var t,r,n=e[0]/255,a=e[1]/255,o=e[2]/255,i=Math.min(n,a,o),s=Math.max(n,a,o),l=s-i;
    return s===i?t=0:n===s?t=(a-o)/l:a===s?t=2+(o-n)/l:o===s&&(t=4+(n-a)/l),(t=Math.min(60*t,360))<0&&(t+=360),
    r=(i+s)/2,[t,100*(s===i?0:.5>=r?l/(s+i):l/(2-s-i)),100*r];
    },i.rgb.hsv=function(e){
    var t,r,n,a,o,i=e[0]/255,s=e[1]/255,l=e[2]/255,u=Math.max(i,s,l),c=u-Math.min(i,s,l),h=function(e){
    return(u-e)/6/c+.5;
    };
    return 0===c?a=o=0:(o=c/u,t=h(i),r=h(s),n=h(l),i===u?a=n-r:s===u?a=1/3+t-n:l===u&&(a=2/3+r-t),
    0>a?a+=1:a>1&&(a-=1)),[360*a,100*o,100*u];
    },i.rgb.hwb=function(e){
    var t=e[0],r=e[1],n=e[2];
    return[i.rgb.hsl(e)[0],100*(1/255)*Math.min(t,Math.min(r,n)),100*(n=1-1/255*Math.max(t,Math.max(r,n)))];
    },i.rgb.cmyk=function(e){
    var t,r=e[0]/255,n=e[1]/255,a=e[2]/255;
    return[100*((1-r-(t=Math.min(1-r,1-n,1-a)))/(1-t)||0),100*((1-n-t)/(1-t)||0),100*((1-a-t)/(1-t)||0),100*t];
    },i.rgb.keyword=function(e){
    var t=a[e];
    if(t)return t;
    var r,o,i,s=1/0;
    for(var l in n)if(n.hasOwnProperty(l)){
    var u=n[l],c=(o=e,i=u,Math.pow(o[0]-i[0],2)+Math.pow(o[1]-i[1],2)+Math.pow(o[2]-i[2],2));
    s>c&&(s=c,r=l);
    }
    return r;
    },i.keyword.rgb=function(e){
    return n[e];
    },i.rgb.xyz=function(e){
    var t=e[0]/255,r=e[1]/255,n=e[2]/255;
    return[100*(.4124*(t=t>.04045?Math.pow((t+.055)/1.055,2.4):t/12.92)+.3576*(r=r>.04045?Math.pow((r+.055)/1.055,2.4):r/12.92)+.1805*(n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92)),100*(.2126*t+.7152*r+.0722*n),100*(.0193*t+.1192*r+.9505*n)];
    },i.rgb.lab=function(e){
    var t=i.rgb.xyz(e),r=t[0],n=t[1],a=t[2];
    return n/=100,a/=108.883,r=(r/=95.047)>.008856?Math.pow(r,1/3):7.787*r+16/116,[116*(n=n>.008856?Math.pow(n,1/3):7.787*n+16/116)-16,500*(r-n),200*(n-(a=a>.008856?Math.pow(a,1/3):7.787*a+16/116))];
    },i.hsl.rgb=function(e){
    var t,r,n,a,o,i=e[0]/360,s=e[1]/100,l=e[2]/100;
    if(0===s)return[o=255*l,o,o];
    t=2*l-(r=.5>l?l*(1+s):l+s-l*s),a=[0,0,0];
    for(var u=0;3>u;u++)(n=i+1/3*-(u-1))<0&&n++,n>1&&n--,o=1>6*n?t+6*(r-t)*n:1>2*n?r:2>3*n?t+(r-t)*(2/3-n)*6:t,
    a[u]=255*o;
    return a;
    },i.hsl.hsv=function(e){
    var t=e[0],r=e[1]/100,n=e[2]/100,a=r,o=Math.max(n,.01);
    return r*=(n*=2)<=1?n:2-n,a*=1>=o?o:2-o,[t,100*(0===n?2*a/(o+a):2*r/(n+r)),100*((n+r)/2)];
    },i.hsv.rgb=function(e){
    var t=e[0]/60,r=e[1]/100,n=e[2]/100,a=Math.floor(t)%6,o=t-Math.floor(t),i=255*n*(1-r),s=255*n*(1-r*o),l=255*n*(1-r*(1-o));
    switch(n*=255,a){
    case 0:
    return[n,l,i];
    
    case 1:
    return[s,n,i];
    
    case 2:
    return[i,n,l];
    
    case 3:
    return[i,s,n];
    
    case 4:
    return[l,i,n];
    
    case 5:
    return[n,i,s];
    }
    },i.hsv.hsl=function(e){
    var t,r,n,a=e[0],o=e[1]/100,i=e[2]/100,s=Math.max(i,.01);
    return n=(2-o)*i,r=o*s,[a,100*(r=(r/=(t=(2-o)*s)<=1?t:2-t)||0),100*(n/=2)];
    },i.hwb.rgb=function(e){
    var t,r,n,a,o,i,s,l=e[0]/360,u=e[1]/100,c=e[2]/100,h=u+c;
    switch(h>1&&(u/=h,c/=h),n=6*l-(t=Math.floor(6*l)),0!=(1&t)&&(n=1-n),a=u+n*((r=1-c)-u),
    t){
    default:
    case 6:
    case 0:
    o=r,i=a,s=u;
    break;
    
    case 1:
    o=a,i=r,s=u;
    break;
    
    case 2:
    o=u,i=r,s=a;
    break;
    
    case 3:
    o=u,i=a,s=r;
    break;
    
    case 4:
    o=a,i=u,s=r;
    break;
    
    case 5:
    o=r,i=u,s=a;
    }
    return[255*o,255*i,255*s];
    },i.cmyk.rgb=function(e){
    var t=e[0]/100,r=e[1]/100,n=e[2]/100,a=e[3]/100;
    return[255*(1-Math.min(1,t*(1-a)+a)),255*(1-Math.min(1,r*(1-a)+a)),255*(1-Math.min(1,n*(1-a)+a))];
    },i.xyz.rgb=function(e){
    var t,r,n,a=e[0]/100,o=e[1]/100,i=e[2]/100;
    return r=-.9689*a+1.8758*o+.0415*i,n=.0557*a+-.204*o+1.057*i,t=(t=3.2406*a+-1.5372*o+-.4986*i)>.0031308?1.055*Math.pow(t,1/2.4)-.055:12.92*t,
    r=r>.0031308?1.055*Math.pow(r,1/2.4)-.055:12.92*r,n=n>.0031308?1.055*Math.pow(n,1/2.4)-.055:12.92*n,
    [255*(t=Math.min(Math.max(0,t),1)),255*(r=Math.min(Math.max(0,r),1)),255*(n=Math.min(Math.max(0,n),1))];
    },i.xyz.lab=function(e){
    var t=e[0],r=e[1],n=e[2];
    return r/=100,n/=108.883,t=(t/=95.047)>.008856?Math.pow(t,1/3):7.787*t+16/116,[116*(r=r>.008856?Math.pow(r,1/3):7.787*r+16/116)-16,500*(t-r),200*(r-(n=n>.008856?Math.pow(n,1/3):7.787*n+16/116))];
    },i.lab.xyz=function(e){
    var t,r,n,a=e[0];
    t=e[1]/500+(r=(a+16)/116),n=r-e[2]/200;
    var o=Math.pow(r,3),i=Math.pow(t,3),s=Math.pow(n,3);
    return r=o>.008856?o:(r-16/116)/7.787,t=i>.008856?i:(t-16/116)/7.787,n=s>.008856?s:(n-16/116)/7.787,
    [t*=95.047,r*=100,n*=108.883];
    },i.lab.lch=function(e){
    var t,r=e[0],n=e[1],a=e[2];
    return(t=360*Math.atan2(a,n)/2/Math.PI)<0&&(t+=360),[r,Math.sqrt(n*n+a*a),t];
    },i.lch.lab=function(e){
    var t,r=e[0],n=e[1];
    return t=e[2]/360*2*Math.PI,[r,n*Math.cos(t),n*Math.sin(t)];
    },i.rgb.ansi16=function(e){
    var t=e[0],r=e[1],n=e[2],a=1 in arguments?arguments[1]:i.rgb.hsv(e)[2];
    if(0===(a=Math.round(a/50)))return 30;
    var o=30+(Math.round(n/255)<<2|Math.round(r/255)<<1|Math.round(t/255));
    return 2===a&&(o+=60),o;
    },i.hsv.ansi16=function(e){
    return i.rgb.ansi16(i.hsv.rgb(e),e[2]);
    },i.rgb.ansi256=function(e){
    var t=e[0],r=e[1],n=e[2];
    return t===r&&r===n?8>t?16:t>248?231:Math.round((t-8)/247*24)+232:16+36*Math.round(t/255*5)+6*Math.round(r/255*5)+Math.round(n/255*5);
    },i.ansi16.rgb=function(e){
    var t=e%10;
    if(0===t||7===t)return e>50&&(t+=3.5),[t=t/10.5*255,t,t];
    var r=.5*(1+~~(e>50));
    return[(1&t)*r*255,(t>>1&1)*r*255,(t>>2&1)*r*255];
    },i.ansi256.rgb=function(e){
    if(e>=232){
    var t=10*(e-232)+8;
    return[t,t,t];
    }
    var r;
    return e-=16,[Math.floor(e/36)/5*255,Math.floor((r=e%36)/6)/5*255,r%6/5*255];
    },i.rgb.hex=function(e){
    var t=(((255&Math.round(e[0]))<<16)+((255&Math.round(e[1]))<<8)+(255&Math.round(e[2]))).toString(16).toUpperCase();
    return"000000".substring(t.length)+t;
    },i.hex.rgb=function(e){
    var t=e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if(!t)return[0,0,0];
    var r=t[0];
    3===t[0].length&&(r=r.split("").map(function(e){
    return e+e;
    }).join(""));
    var n=parseInt(r,16);
    return[n>>16&255,n>>8&255,255&n];
    },i.rgb.hcg=function(e){
    var t,r=e[0]/255,n=e[1]/255,a=e[2]/255,o=Math.max(Math.max(r,n),a),i=Math.min(Math.min(r,n),a),s=o-i;
    return t=0>=s?0:o===r?(n-a)/s%6:o===n?2+(a-r)/s:4+(r-n)/s+4,t/=6,[360*(t%=1),100*s,100*(1>s?i/(1-s):0)];
    },i.hsl.hcg=function(e){
    var t=e[1]/100,r=e[2]/100,n=1,a=0;
    return(n=.5>r?2*t*r:2*t*(1-r))<1&&(a=(r-.5*n)/(1-n)),[e[0],100*n,100*a];
    },i.hsv.hcg=function(e){
    var t=e[1]/100,r=e[2]/100,n=t*r,a=0;
    return 1>n&&(a=(r-n)/(1-n)),[e[0],100*n,100*a];
    },i.hcg.rgb=function(e){
    var t=e[0]/360,r=e[1]/100,n=e[2]/100;
    if(0===r)return[255*n,255*n,255*n];
    var a,o=[0,0,0],i=t%1*6,s=i%1,l=1-s;
    switch(Math.floor(i)){
    case 0:
    o[0]=1,o[1]=s,o[2]=0;
    break;
    
    case 1:
    o[0]=l,o[1]=1,o[2]=0;
    break;
    
    case 2:
    o[0]=0,o[1]=1,o[2]=s;
    break;
    
    case 3:
    o[0]=0,o[1]=l,o[2]=1;
    break;
    
    case 4:
    o[0]=s,o[1]=0,o[2]=1;
    break;
    
    default:
    o[0]=1,o[1]=0,o[2]=l;
    }
    return a=(1-r)*n,[255*(r*o[0]+a),255*(r*o[1]+a),255*(r*o[2]+a)];
    },i.hcg.hsv=function(e){
    var t=e[1]/100,r=t+e[2]/100*(1-t),n=0;
    return r>0&&(n=t/r),[e[0],100*n,100*r];
    },i.hcg.hsl=function(e){
    var t=e[1]/100,r=e[2]/100*(1-t)+.5*t,n=0;
    return r>0&&.5>r?n=t/(2*r):r>=.5&&1>r&&(n=t/(2*(1-r))),[e[0],100*n,100*r];
    },i.hcg.hwb=function(e){
    var t=e[1]/100,r=t+e[2]/100*(1-t);
    return[e[0],100*(r-t),100*(1-r)];
    },i.hwb.hcg=function(e){
    var t=e[1]/100,r=1-e[2]/100,n=r-t,a=0;
    return 1>n&&(a=(r-n)/(1-n)),[e[0],100*n,100*a];
    },i.apple.rgb=function(e){
    return[e[0]/65535*255,e[1]/65535*255,e[2]/65535*255];
    },i.rgb.apple=function(e){
    return[e[0]/255*65535,e[1]/255*65535,e[2]/255*65535];
    },i.gray.rgb=function(e){
    return[e[0]/100*255,e[0]/100*255,e[0]/100*255];
    },i.gray.hsl=i.gray.hsv=function(e){
    return[0,0,e[0]];
    },i.gray.hwb=function(e){
    return[0,100,e[0]];
    },i.gray.cmyk=function(e){
    return[0,0,0,e[0]];
    },i.gray.lab=function(e){
    return[e[0],0,0];
    },i.gray.hex=function(e){
    var t=255&Math.round(e[0]/100*255),r=((t<<16)+(t<<8)+t).toString(16).toUpperCase();
    return"000000".substring(r.length)+r;
    },i.rgb.gray=function(e){
    return[(e[0]+e[1]+e[2])/3/255*100];
    };
    },function(e,t,r){
    function n(e,t,r){
    return Math.min(Math.max(t,e),r);
    }
    function a(e){
    var t=e.toString(16).toUpperCase();
    return t.length<2?"0"+t:t;
    }
    var o=r(1),i=r(4),s={};
    for(var l in o)o.hasOwnProperty(l)&&(s[o[l]]=l);
    var u=e.exports={
    to:{},
    get:{}
    };
    u.get=function(e){
    var t,r;
    switch(e.substring(0,3).toLowerCase()){
    case"hsl":
    t=u.get.hsl(e),r="hsl";
    break;
    
    case"hwb":
    t=u.get.hwb(e),r="hwb";
    break;
    
    default:
    t=u.get.rgb(e),r="rgb";
    }
    return t?{
    model:r,
    value:t
    }:null;
    },u.get.rgb=function(e){
    if(!e)return null;
    var t,r,a,i=[0,0,0,1];
    if(t=e.match(/^#([a-f0-9]{6})([a-f0-9]{2})?$/i)){
    for(a=t[2],t=t[1],r=0;3>r;r++){
    var s=2*r;
    i[r]=parseInt(t.slice(s,s+2),16);
    }
    a&&(i[3]=Math.round(parseInt(a,16)/255*100)/100);
    }else if(t=e.match(/^#([a-f0-9]{3,4})$/i)){
    for(a=(t=t[1])[3],r=0;3>r;r++)i[r]=parseInt(t[r]+t[r],16);
    a&&(i[3]=Math.round(parseInt(a+a,16)/255*100)/100);
    }else if(t=e.match(/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)){
    for(r=0;3>r;r++)i[r]=parseInt(t[r+1],0);
    t[4]&&(i[3]=parseFloat(t[4]));
    }else{
    if(!(t=e.match(/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/)))return(t=e.match(/(\D+)/))?"transparent"===t[1]?[0,0,0,0]:(i=o[t[1]])?(i[3]=1,
    i):null:null;
    for(r=0;3>r;r++)i[r]=Math.round(2.55*parseFloat(t[r+1]));
    t[4]&&(i[3]=parseFloat(t[4]));
    }
    for(r=0;3>r;r++)i[r]=n(i[r],0,255);
    return i[3]=n(i[3],0,1),i;
    },u.get.hsl=function(e){
    if(!e)return null;
    var t=e.match(/^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
    if(t){
    var r=parseFloat(t[4]);
    return[(parseFloat(t[1])+360)%360,n(parseFloat(t[2]),0,100),n(parseFloat(t[3]),0,100),n(isNaN(r)?1:r,0,1)];
    }
    return null;
    },u.get.hwb=function(e){
    if(!e)return null;
    var t=e.match(/^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/);
    if(t){
    var r=parseFloat(t[4]);
    return[(parseFloat(t[1])%360+360)%360,n(parseFloat(t[2]),0,100),n(parseFloat(t[3]),0,100),n(isNaN(r)?1:r,0,1)];
    }
    return null;
    },u.to.hex=function(){
    var e=i(arguments);
    return"#"+a(e[0])+a(e[1])+a(e[2])+(e[3]<1?a(Math.round(255*e[3])):"");
    },u.to.rgb=function(){
    var e=i(arguments);
    return e.length<4||1===e[3]?"rgb("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+")":"rgba("+Math.round(e[0])+", "+Math.round(e[1])+", "+Math.round(e[2])+", "+e[3]+")";
    },u.to.rgb.percent=function(){
    var e=i(arguments),t=Math.round(e[0]/255*100),r=Math.round(e[1]/255*100),n=Math.round(e[2]/255*100);
    return e.length<4||1===e[3]?"rgb("+t+"%, "+r+"%, "+n+"%)":"rgba("+t+"%, "+r+"%, "+n+"%, "+e[3]+")";
    },u.to.hsl=function(){
    var e=i(arguments);
    return e.length<4||1===e[3]?"hsl("+e[0]+", "+e[1]+"%, "+e[2]+"%)":"hsla("+e[0]+", "+e[1]+"%, "+e[2]+"%, "+e[3]+")";
    },u.to.hwb=function(){
    var e=i(arguments),t="";
    return e.length>=4&&1!==e[3]&&(t=", "+e[3]),"hwb("+e[0]+", "+e[1]+"%, "+e[2]+"%"+t+")";
    },u.to.keyword=function(e){
    return s[e.slice(0,3)];
    };
    },function(e,t,r){
    "use strict";
    var n=r(5),a=Array.prototype.concat,o=Array.prototype.slice,i=e.exports=function(e){
    for(var t=[],r=0,i=e.length;i>r;r++){
    var s=e[r];
    n(s)?t=a.call(t,o.call(s)):t.push(s);
    }
    return t;
    };
    i.wrap=function(e){
    return function(){
    return e(i(arguments));
    };
    };
    },function(e){
    e.exports=function(e){
    return!(!e||"string"==typeof e)&&(e instanceof Array||Array.isArray(e)||e.length>=0&&(e.splice instanceof Function||Object.getOwnPropertyDescriptor(e,e.length-1)&&"String"!==e.constructor.name));
    };
    },function(e,t,r){
    var n=r(2),a=r(8),o={};
    Object.keys(n).forEach(function(e){
    o[e]={},Object.defineProperty(o[e],"channels",{
    value:n[e].channels
    }),Object.defineProperty(o[e],"labels",{
    value:n[e].labels
    });
    var t=a(e);
    Object.keys(t).forEach(function(r){
    var n=t[r];
    o[e][r]=function(e){
    var t=function(t){
    if(null==t)return t;
    arguments.length>1&&(t=Array.prototype.slice.call(arguments));
    var r=e(t);
    if("object"==typeof r)for(var n=r.length,a=0;n>a;a++)r[a]=Math.round(r[a]);
    return r;
    };
    return"conversion"in e&&(t.conversion=e.conversion),t;
    }(n),o[e][r].raw=function(e){
    var t=function(t){
    return null==t?t:(arguments.length>1&&(t=Array.prototype.slice.call(arguments)),
    e(t));
    };
    return"conversion"in e&&(t.conversion=e.conversion),t;
    }(n);
    });
    }),e.exports=o;
    },function(e){
    "use strict";
    e.exports={
    aliceblue:[240,248,255],
    antiquewhite:[250,235,215],
    aqua:[0,255,255],
    aquamarine:[127,255,212],
    azure:[240,255,255],
    beige:[245,245,220],
    bisque:[255,228,196],
    black:[0,0,0],
    blanchedalmond:[255,235,205],
    blue:[0,0,255],
    blueviolet:[138,43,226],
    brown:[165,42,42],
    burlywood:[222,184,135],
    cadetblue:[95,158,160],
    chartreuse:[127,255,0],
    chocolate:[210,105,30],
    coral:[255,127,80],
    cornflowerblue:[100,149,237],
    cornsilk:[255,248,220],
    crimson:[220,20,60],
    cyan:[0,255,255],
    darkblue:[0,0,139],
    darkcyan:[0,139,139],
    darkgoldenrod:[184,134,11],
    darkgray:[169,169,169],
    darkgreen:[0,100,0],
    darkgrey:[169,169,169],
    darkkhaki:[189,183,107],
    darkmagenta:[139,0,139],
    darkolivegreen:[85,107,47],
    darkorange:[255,140,0],
    darkorchid:[153,50,204],
    darkred:[139,0,0],
    darksalmon:[233,150,122],
    darkseagreen:[143,188,143],
    darkslateblue:[72,61,139],
    darkslategray:[47,79,79],
    darkslategrey:[47,79,79],
    darkturquoise:[0,206,209],
    darkviolet:[148,0,211],
    deeppink:[255,20,147],
    deepskyblue:[0,191,255],
    dimgray:[105,105,105],
    dimgrey:[105,105,105],
    dodgerblue:[30,144,255],
    firebrick:[178,34,34],
    floralwhite:[255,250,240],
    forestgreen:[34,139,34],
    fuchsia:[255,0,255],
    gainsboro:[220,220,220],
    ghostwhite:[248,248,255],
    gold:[255,215,0],
    goldenrod:[218,165,32],
    gray:[128,128,128],
    green:[0,128,0],
    greenyellow:[173,255,47],
    grey:[128,128,128],
    honeydew:[240,255,240],
    hotpink:[255,105,180],
    indianred:[205,92,92],
    indigo:[75,0,130],
    ivory:[255,255,240],
    khaki:[240,230,140],
    lavender:[230,230,250],
    lavenderblush:[255,240,245],
    lawngreen:[124,252,0],
    lemonchiffon:[255,250,205],
    lightblue:[173,216,230],
    lightcoral:[240,128,128],
    lightcyan:[224,255,255],
    lightgoldenrodyellow:[250,250,210],
    lightgray:[211,211,211],
    lightgreen:[144,238,144],
    lightgrey:[211,211,211],
    lightpink:[255,182,193],
    lightsalmon:[255,160,122],
    lightseagreen:[32,178,170],
    lightskyblue:[135,206,250],
    lightslategray:[119,136,153],
    lightslategrey:[119,136,153],
    lightsteelblue:[176,196,222],
    lightyellow:[255,255,224],
    lime:[0,255,0],
    limegreen:[50,205,50],
    linen:[250,240,230],
    magenta:[255,0,255],
    maroon:[128,0,0],
    mediumaquamarine:[102,205,170],
    mediumblue:[0,0,205],
    mediumorchid:[186,85,211],
    mediumpurple:[147,112,219],
    mediumseagreen:[60,179,113],
    mediumslateblue:[123,104,238],
    mediumspringgreen:[0,250,154],
    mediumturquoise:[72,209,204],
    mediumvioletred:[199,21,133],
    midnightblue:[25,25,112],
    mintcream:[245,255,250],
    mistyrose:[255,228,225],
    moccasin:[255,228,181],
    navajowhite:[255,222,173],
    navy:[0,0,128],
    oldlace:[253,245,230],
    olive:[128,128,0],
    olivedrab:[107,142,35],
    orange:[255,165,0],
    orangered:[255,69,0],
    orchid:[218,112,214],
    palegoldenrod:[238,232,170],
    palegreen:[152,251,152],
    paleturquoise:[175,238,238],
    palevioletred:[219,112,147],
    papayawhip:[255,239,213],
    peachpuff:[255,218,185],
    peru:[205,133,63],
    pink:[255,192,203],
    plum:[221,160,221],
    powderblue:[176,224,230],
    purple:[128,0,128],
    rebeccapurple:[102,51,153],
    red:[255,0,0],
    rosybrown:[188,143,143],
    royalblue:[65,105,225],
    saddlebrown:[139,69,19],
    salmon:[250,128,114],
    sandybrown:[244,164,96],
    seagreen:[46,139,87],
    seashell:[255,245,238],
    sienna:[160,82,45],
    silver:[192,192,192],
    skyblue:[135,206,235],
    slateblue:[106,90,205],
    slategray:[112,128,144],
    slategrey:[112,128,144],
    snow:[255,250,250],
    springgreen:[0,255,127],
    steelblue:[70,130,180],
    tan:[210,180,140],
    teal:[0,128,128],
    thistle:[216,191,216],
    tomato:[255,99,71],
    turquoise:[64,224,208],
    violet:[238,130,238],
    wheat:[245,222,179],
    white:[255,255,255],
    whitesmoke:[245,245,245],
    yellow:[255,255,0],
    yellowgreen:[154,205,50]
    };
    },function(e,t,r){
    function n(e){
    var t=function(){
    for(var e={},t=Object.keys(i),r=t.length,n=0;r>n;n++)e[t[n]]={
    distance:-1,
    parent:null
    };
    return e;
    }(),r=[e];
    for(t[e].distance=0;r.length;)for(var n=r.pop(),a=Object.keys(i[n]),o=a.length,s=0;o>s;s++){
    var l=a[s],u=t[l];
    -1===u.distance&&(u.distance=t[n].distance+1,u.parent=n,r.unshift(l));
    }
    return t;
    }
    function a(e,t){
    return function(r){
    return t(e(r));
    };
    }
    function o(e,t){
    for(var r=[t[e].parent,e],n=i[t[e].parent][e],o=t[e].parent;t[o].parent;)r.unshift(t[o].parent),
    n=a(i[t[o].parent][o],n),o=t[o].parent;
    return n.conversion=r,n;
    }
    var i=r(2);
    e.exports=function(e){
    for(var t=n(e),r={},a=Object.keys(t),i=a.length,s=0;i>s;s++){
    var l=a[s];
    null!==t[l].parent&&(r[l]=o(l,t));
    }
    return r;
    };
    },function(e,t,r){
    "use strict";
    function n(e){
    return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){
    return typeof e;
    }:function(e){
    return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e;
    })(e);
    }
    function a(e,t){
    for(var r=0;r<t.length;r++){
    var n=t[r];
    n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);
    }
    }
    function o(e,t,r){
    return t in e?Object.defineProperty(e,t,{
    value:r,
    enumerable:!0,
    configurable:!0,
    writable:!0
    }):e[t]=r,e;
    }
    function i(e,t){
    for(var r=0;r<t.length;r++){
    var n=t[r];
    n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);
    }
    }
    function s(e,t,r){
    return t in e?Object.defineProperty(e,t,{
    value:r,
    enumerable:!0,
    configurable:!0,
    writable:!0
    }):e[t]=r,e;
    }
    function l(e,t){
    for(var r=0;r<t.length;r++){
    var n=t[r];
    n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);
    }
    }
    function u(e,t,r){
    return t in e?Object.defineProperty(e,t,{
    value:r,
    enumerable:!0,
    configurable:!0,
    writable:!0
    }):e[t]=r,e;
    }
    function c(e,t){
    for(var r=0;r<t.length;r++){
    var n=t[r];
    n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);
    }
    }
    function h(e,t,r){
    return t in e?Object.defineProperty(e,t,{
    value:r,
    enumerable:!0,
    configurable:!0,
    writable:!0
    }):e[t]=r,e;
    }
    function f(e){
    return function(e){
    return Array.isArray(e)?g(e):void 0;
    }(e)||function(e){
    return"undefined"!=typeof Symbol&&Symbol.iterator in Object(e)?Array.from(e):void 0;
    }(e)||function(e,t){
    if(e){
    if("string"==typeof e)return g(e,t);
    var r=Object.prototype.toString.call(e).slice(8,-1);
    return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?g(e,t):void 0;
    }
    }(e)||function(){
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
    }
    function g(e,t){
    (null==t||t>e.length)&&(t=e.length);
    for(var r=0,n=new Array(t);t>r;r++)n[r]=e[r];
    return n;
    }
    function d(e){
    var t;
    return(t=[e]).concat.apply(t,f(e.querySelectorAll("*")));
    }
    function b(e,t){
    return function(e){
    return Array.isArray(e)?e:void 0;
    }(e)||function(e,t){
    if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){
    var r=[],n=!0,a=!1,o=void 0;
    try{
    for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);
    }catch(e){
    a=!0,o=e;
    }finally{
    try{
    n||null==s.return||s.return();
    }finally{
    if(a)throw o;
    }
    }
    return r;
    }
    }(e,t)||m(e,t)||function(){
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
    }
    function p(e){
    return function(e){
    return Array.isArray(e)?y(e):void 0;
    }(e)||function(e){
    return"undefined"!=typeof Symbol&&Symbol.iterator in Object(e)?Array.from(e):void 0;
    }(e)||m(e)||function(){
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
    }
    function m(e,t){
    if(e){
    if("string"==typeof e)return y(e,t);
    var r=Object.prototype.toString.call(e).slice(8,-1);
    return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?y(e,t):void 0;
    }
    }
    function y(e,t){
    (null==t||t>e.length)&&(t=e.length);
    for(var r=0,n=new Array(t);t>r;r++)n[r]=e[r];
    return n;
    }
    function v(e,t){
    for(var r=0;r<t.length;r++){
    var n=t[r];
    n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);
    }
    }
    function k(e,t){
    w(t),at.set(e),st(it,{
    force:!0,
    type:"dom"
    });
    }
    function w(){
    var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};
    if(!et.hasInit){
    et.hasInit=!0;
    var t=et.whitelist.tagName;
    "function"==typeof e.error&&(et.error=e.error),["dark","light"].indexOf(e.mode)>-1&&(et.mode=e.mode,
    document.getElementsByTagName("html")[0].classList.add(M)),e.whitelist&&e.whitelist.tagName instanceof Array&&e.whitelist.tagName.forEach(function(e){
    e=e.toUpperCase(),-1===t.indexOf(e)&&t.push(e);
    }),"boolean"==typeof e.needJudgeFirstPage&&(et.needJudgeFirstPage=e.needJudgeFirstPage),
    "boolean"==typeof e.delayBgJudge&&(et.delayBgJudge=e.delayBgJudge),e.container instanceof HTMLElement&&(et.container=e.container),
    "string"==typeof e.cssSelectorsPrefix&&(et.cssSelectorsPrefix=e.cssSelectorsPrefix),
    "string"==typeof e.defaultLightTextColor&&""!==e.defaultLightTextColor&&(et.defaultLightTextColor=e.defaultLightTextColor),
    "string"==typeof e.defaultLightBgColor&&""!==e.defaultLightBgColor&&(et.defaultLightBgColor=e.defaultLightBgColor),
    "string"==typeof e.defaultDarkTextColor&&""!==e.defaultDarkTextColor&&(et.defaultDarkTextColor=e.defaultDarkTextColor),
    "string"==typeof e.defaultDarkBgColor&&""!==e.defaultDarkBgColor&&(et.defaultDarkBgColor=e.defaultDarkBgColor),
    et.mode||null!==it||(it=window.matchMedia(x)).addListener(st);
    }
    }
    function _(e){
    at.set(e),null!==et.container&&(rt.update(e),tt.update(e)),st(it,{
    force:!0,
    type:"bg"
    });
    }
    r.r(t),r.d(t,"run",function(){
    return k;
    }),r.d(t,"init",function(){
    return w;
    }),r.d(t,"convertBg",function(){
    return _;
    });
    var x="(prefers-color-scheme: dark)",M="data_color_scheme_dark",C="".concat(1*new Date).concat(Math.round(10*Math.random())),B="data-darkmode-color-".concat(C),S="data-darkmode-bgcolor-".concat(C),j="data-darkmode-original-color-".concat(C),O="data-darkmode-original-bgcolor-".concat(C),A="data-darkmode-bgimage-".concat(C),P=window.getInnerHeight&&window.getInnerHeight()||window.innerHeight||document.documentElement.clientHeight,T=["TABLE","TR","TD","TH"],E=navigator.userAgent,L=/windows\snt/i.test(E)&&!/Windows\sPhone/i.test(E)||/mac\sos/i.test(E)&&!/(iPhone|iPad|iPod|iOS)/i.test(E),N=/ !important$/,D=function(){
    function e(t,r){
    !function(e,t){
    if(!(e instanceof t))throw new TypeError("Cannot call a class as a function");
    }(this,e),o(this,"_queue",[]),o(this,"_idx",0),this._config=t,this._prefix=r;
    }
    var t,r,i;
    return t=e,(r=[{
    key:"push",
    value:function(e){
    var t="".concat(this._prefix).concat(this._idx++);
    e.classList.add(t),this._queue.push({
    el:e,
    className:t,
    updated:!this._config.delayBgJudge
    });
    }
    },{
    key:"forEach",
    value:function(e){
    var t=[];
    for(this._queue.forEach(function(r,a){
    r.updated&&(t.unshift(a),n(e)&&e(r.el));
    });t.length;)this._queue.splice(t.shift(),1);
    }
    },{
    key:"update",
    value:function(e){
    this._queue.forEach(function(t){
    t.updated||Array.prototype.some.call(e,function(e){
    return!!e.classList.contains(t.className)&&(t.el=e,t.updated=!0,!0);
    });
    });
    }
    }])&&a(t.prototype,r),i&&a(t,i),e;
    }(),F=function(){
    function e(t,r){
    !function(e,t){
    if(!(e instanceof t))throw new TypeError("Cannot call a class as a function");
    }(this,e),s(this,"_stack",[]),s(this,"_idx",0),this._config=t,this._prefix=r;
    }
    var t,r,n;
    return t=e,(r=[{
    key:"push",
    value:function(e,t){
    var r="".concat(this._prefix).concat(this._idx++);
    e.classList.add(r),this._stack.unshift({
    el:e,
    className:r,
    cssKV:t,
    updated:!this._config.delayBgJudge
    });
    }
    },{
    key:"contains",
    value:function(e,t){
    var r=e.getBoundingClientRect(),n=[];
    for(this._stack.forEach(function(e,t){
    if(e.updated){
    e.rect||(e.rect=e.el.getBoundingClientRect());
    var a=e.rect;
    r.top>=a.bottom||r.bottom<=a.top||r.left>=a.right||r.right<=a.left||n.unshift(t);
    }
    });n.length;){
    var a=this._stack.splice(n.shift(),1)[0];
    "function"==typeof t&&t(a);
    }
    }
    },{
    key:"update",
    value:function(e){
    this._stack.forEach(function(t){
    t.updated||Array.prototype.some.call(e,function(e){
    return!!e.classList.contains(t.className)&&(t.el=e,t.updated=!0,!0);
    });
    });
    }
    }])&&i(t.prototype,r),n&&i(t,n),e;
    }(),q=function(){
    function e(t){
    !function(e,t){
    if(!(e instanceof t))throw new TypeError("Cannot call a class as a function");
    }(this,e),u(this,"_firstPageStyle",""),u(this,"_otherPageStyle",""),u(this,"isFinish",!1),
    this._config=t;
    }
    var t,r,n;
    return t=e,(r=[{
    key:"genCssKV",
    value:function(e,t){
    return"".concat(e,": ").concat(t," !important;");
    }
    },{
    key:"genCss",
    value:function(e,t){
    return"".concat("dark"===this._config.mode?"html.".concat(M," "):"").concat(this._config.cssSelectorsPrefix&&"".concat(this._config.cssSelectorsPrefix," "),".").concat(e,"{").concat(t,"}");
    }
    },{
    key:"addCss",
    value:function(e,t){
    this[t?"_firstPageStyle":"_otherPageStyle"]+=e;
    }
    },{
    key:"writeStyle",
    value:function(e){
    var t="";
    e?t="_firstPageStyle":(this._otherPageStyle=this._firstPageStyle+this._otherPageStyle,
    this._firstPageStyle="",t="_otherPageStyle",this.isFinish=!0);
    var r=this[t];
    r&&(document.head.insertAdjacentHTML("beforeend",'<style type="text/css">'.concat("dark"===this._config.mode?r:"@media ".concat(x," {").concat(r,"}"),"</style>")),
    this[t]="");
    }
    }])&&l(t.prototype,r),n&&l(t,n),e;
    }(),U={
    "ue-table-interlace-color-single":"#fcfcfc",
    "ue-table-interlace-color-double":"#f7faff"
    },I=function(){
    function e(t){
    !function(e,t){
    if(!(e instanceof t))throw new TypeError("Cannot call a class as a function");
    }(this,e),h(this,"_nodes",[]),h(this,"_firstPageNodes",[]),h(this,"_delayNodes",[]),
    this._config=t;
    }
    var t,r,n;
    return t=e,(r=[{
    key:"set",
    value:function(){
    var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];
    this._nodes=e;
    }
    },{
    key:"len",
    value:function(){
    return this._nodes.length;
    }
    },{
    key:"get",
    value:function(){
    var e=[];
    return this._nodes.length?(e=this._nodes,this._nodes=[]):this._delayNodes.length?(e=this._delayNodes,
    this._delayNodes=[]):this._config.container&&(e=this._config.container.querySelectorAll("*")),
    e;
    }
    },{
    key:"delay",
    value:function(){
    var e=this;
    this._nodes.forEach(function(t){
    return e._delayNodes.push(t);
    }),this._nodes=[];
    }
    },{
    key:"addFirstPageNode",
    value:function(e){
    this._firstPageNodes.push(e);
    }
    },{
    key:"showFirstPageNodes",
    value:function(){
    this._firstPageNodes.forEach(function(e){
    return e.style.visibility="visible";
    }),this._firstPageNodes=[];
    }
    }])&&c(t.prototype,r),n&&c(t,n),e;
    }(),z=r(0),J=r.n(z),V=r(1),K=r.n(V);
    K.a.windowtext=[0,0,0];
    var $=new RegExp(Object.keys(K.a).map(function(e){
    return"(^|[\\s,()]+)".concat(e,"([\\s,()]+|$)");
    }).join("|"),"ig"),H=/rgba?\([^)]+\)/i,R=/rgba?\([^)]+\)/gi,Q=function(e){
    return e.replace(N,"");
    },G=function(e){
    return Q(e).replace($,function(e){
    return"rgb(".concat(K.a[e.replace(/(^[\s,()]+)|([\s,()]+$)/g,"").toLowerCase()].toString(),")");
    });
    },W=function(e){
    var t=G(e);
    return H.test(t)?t:"";
    },X=function(e){
    return(299*e[0]+587*e[1]+114*e[2])/1e3;
    },Y=function(){
    function e(t){
    var r,n,a,o=t.config,i=t.tnQueue,s=t.bgStack,l=t.cssUtils;
    !function(e,t){
    if(!(e instanceof t))throw new TypeError("Cannot call a class as a function");
    }(this,e),a=0,(n="_idx")in(r=this)?Object.defineProperty(r,n,{
    value:a,
    enumerable:!0,
    configurable:!0,
    writable:!0
    }):r[n]=a,this._config=o,this._tnQueue=i,this._bgStack=s,this._cssUtils=l,this._defaultDarkTextColorRgb=J()(this._config.defaultDarkTextColor).rgb().array(),
    this._defaultDarkBgColorRgb=J()(this._config.defaultDarkBgColor).rgb().array(),this._defaultDarkBgColorHSL=J()(this._config.defaultDarkBgColor).hsl().array(),
    this._defaultDarkTextColorBrightness=X(this._defaultDarkTextColorRgb),this._defaultDarkBgColorBrightness=X(this._defaultDarkBgColorRgb),
    this._defaultDarkBgColorHslBrightness=this._defaultDarkBgColorHSL[2],this._maxLimitOffsetBrightness=this._defaultDarkTextColorBrightness-this._defaultDarkBgColorBrightness;
    }
    var t,r,n;
    return t=e,(r=[{
    key:"_adjustBrightnessByLimit",
    value:function(e,t){
    var r=e/X(t),n=Math.min(255,t[0]*r),a=Math.min(255,t[1]*r),o=Math.min(255,t[2]*r);
    return 0===a||255===n||255===o?a=(1e3*e-299*n-114*o)/587:0===n?n=(1e3*e-587*a-114*o)/299:0!==o&&255!==a||(o=(1e3*e-299*n-587*a)/114),
    J.a.rgb(n,a,o);
    }
    },{
    key:"_adjustTextBrightness",
    value:function(e,t){
    var r=t.rgb().array(),n=t.alpha(),a=X(r)*n+this._defaultDarkBgColorBrightness*(1-n),o=e.rgb().array(),i=e.hsl().array(),s=e.alpha(),l=X(o),u=Math.abs(a-l);
    if(l>=250)return e;
    if(u>this._maxLimitOffsetBrightness&&a<=this._defaultDarkBgColorBrightness+2)return this._adjustBrightnessByLimit(this._maxLimitOffsetBrightness+a,o).alpha(s);
    if(u>=65)return e;
    if(a>=100){
    if(i[2]>50){
    i[2]=90-i[2];
    var c=J.a.hsl.apply(J.a,p(i)).alpha(s);
    return this._adjustTextBrightness(c,t);
    }
    return this._adjustBrightnessByLimit(Math.min(this._maxLimitOffsetBrightness,a-65),o).alpha(s);
    }
    if(i[2]<=40){
    i[2]=90-i[2];
    var h=J.a.hsl.apply(J.a,p(i)).alpha(s);
    return this._adjustTextBrightness(h,t);
    }
    return this._adjustBrightnessByLimit(Math.min(this._maxLimitOffsetBrightness,a+65),o).alpha(s);
    }
    },{
    key:"_adjustBackgroundBrightness",
    value:function(e){
    var t=e.rgb().array(),r=e.hsl().array(),n=e.alpha(),a=X(t),o=e;
    return 0===r[1]&&r[2]>40||a>250?o=J.a.hsl(0,0,Math.min(100,100+this._defaultDarkBgColorHslBrightness-r[2])):a>190?o=this._adjustBrightnessByLimit(190,t).alpha(n):r[2]<22&&(r[2]=22,
    o=J.a.hsl.apply(J.a,p(r))),o.alpha(n).rgb();
    }
    },{
    key:"_adjustBrightness",
    value:function(e,t,r){
    var n,a=e.alpha(),o="";
    if(r.isBgColor){
    if(t.getAttribute(A)&&a>=.05&&t.removeAttribute(A),n=this._adjustBackgroundBrightness(e),
    !r.hasInlineColor){
    var i=t.getAttribute(B)||this._config.defaultLightTextColor,s=n||e,l=this._adjustBrightness(J()(i),t,{
    isTextColor:!0,
    parentElementBgColorStr:s
    });
    o+=l.newColor?this._cssUtils.genCssKV("color",l.newColor):this._cssUtils.genCssKV("color",i);
    }
    }else if(r.isTextColor||r.isBorderColor){
    var u=r.parentElementBgColorStr||r.isTextColor&&t.getAttribute(S)||this._config.defaultDarkBgColor,c=J()(u);
    t.getAttribute(A)||(n=this._adjustTextBrightness(e,c));
    }else r.isTextShadow&&(n=this._adjustBackgroundBrightness(e));
    return{
    newColor:n&&e.toString()!==n.toString()&&n.alpha(a).rgb(),
    extStyle:o
    };
    }
    },{
    key:"convert",
    value:function(e){
    var t=this,r=e.nodeName;
    if(this._config.whitelist.tagName.indexOf(r)>-1)return"";
    var n,a,o=e.style,i="",s="",l=!1,u=!1,c=!1,h=(o.cssText&&o.cssText.split(";")||[]).map(function(e){
    var t=e.indexOf(":");
    return[e.slice(0,t).toLowerCase(),e.slice(t+1)].map(function(e){
    return(e||"").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");
    });
    }).filter(function(e){
    var t=b(e,2),r=t[0],o=t[1];
    return"color"===r?l=!0:/background/i.test(r)&&(u=!0,"background-position"===r?n=o:"background-size"===r&&(a=o)),
    (/background/i.test(r)||/^(-webkit-)?border-image/.test(r))&&/url\([^\)]*\)/i.test(o)&&(c=!0),
    ["-webkit-border-image","border-image","color","background-color","background-image","background","border","border-top","border-right","border-bottom","border-left","border-color","border-top-color","border-right-color","border-bottom-color","border-left-color","-webkit-text-fill-color","-webkit-text-stroke","-webkit-text-stroke-color","text-shadow"].indexOf(r)>-1;
    }).sort(function(e,t){
    var r=b(e,1)[0],n=b(t,1)[0];
    return"color"===r||"background-image"===r&&"background-color"===n||0===n.indexOf("-webkit-text")?1:-1;
    });
    if(T.indexOf(r)>-1&&!u){
    var f=function(e){
    var t=null;
    return Array.prototype.some.call(e.classList,function(e){
    return!!U[e]&&(t=U[e],!0);
    }),t;
    }(e);
    f||(f=e.getAttribute("bgcolor")),f&&(h.unshift(["background-color",J()(f).toString()]),
    u=!0);
    }
    if("FONT"===r&&!l){
    var g=e.getAttribute("color");
    g&&(h.push(["color",J()(g).toString()]),l=!0);
    }
    var p,m="",y="",v=0;
    if(h.some(function(e,t){
    var r=b(e,2),n=r[0],a=r[1];
    if(0!==n.indexOf("-webkit-text"))return v=t,!0;
    switch(n){
    case"-webkit-text-fill-color":
    m=W(a);
    break;
    
    case"-webkit-text-stroke":
    var o=a.split(" ");
    2===o.length&&(y=W(o[1]));
    break;
    
    case"-webkit-text-stroke-color":
    y=W(a);
    }
    return!1;
    }),m&&(l?h[h.length-1]=["-webkit-text-fill-color",m]:(h.push(["-webkit-text-fill-color",m]),
    l=!0)),v&&(h.splice(0,v),y&&h.unshift(["-webkit-text-stroke-color",y])),h.forEach(function(r){
    var s=b(r,2),h=s[0],f=s[1],g=f,p=!1;
    f=G(f);
    var m,y=/^background/.test(h),v="text-shadow"===h,k=["-webkit-text-stroke-color","color","-webkit-text-fill-color"].indexOf(h),w=/^border/.test(h),_=/gradient/.test(f),x="",M=[];
    if(!c&&H.test(f)&&(_&&(f.replace(R,function(e){
    return M.push(e);
    }),m=function(e){
    if(!e||e.length<1)return"";
    if(1===e.length)return e[0];
    for(var t=e.shift(),r=e.pop();r;)t=J()(t).mix(J()(r)),r=e.pop();
    return t;
    }([].concat(M))),f=f.replace(R,function(r){
    _&&(r=m,p=!0);
    var n=t._adjustBrightness(J()(r),e,{
    isBgColor:y,
    isTextShadow:v,
    isTextColor:k>-1,
    isBorderColor:w,
    hasInlineColor:l
    }),a=n.newColor;
    if(x+=n.extStyle,y||k>0){
    var o=y?S:B,i=y?O:j,s=a?a.toString():r;
    d(e).forEach(function(e){
    e.setAttribute(o,s),e.setAttribute(i,r),y&&J()(s).alpha()>=.05&&e.getAttribute(A)&&e.removeAttribute(A);
    });
    }
    return a&&(p=!0),a||r;
    }).replace(/\s?!\s?important/gi,"")),x&&(i+=x),!(e instanceof SVGElement)){
    var C=/^background/.test(h),P=/^(-webkit-)?border-image/.test(h);
    if((C||P)&&/url\([^\)]*\)/i.test(f)){
    p=!0;
    var T=e.getAttribute(O)||t._config.defaultLightBgColor;
    if(f=f.replace(/^(.*?)url\(([^\)]*)\)(.*)$/i,function(r){
    var o=r,s="",l="",c="";
    return"1"!==e.getAttribute(A)&&d(e).forEach(function(e){
    return e.setAttribute(A,"1");
    }),C?(o="linear-gradient(".concat("rgba(0,0,0,0.1)",", ").concat("rgba(0,0,0,0.1)","),").concat(r),
    c=t._cssUtils.genCssKV(h,"".concat(o,",linear-gradient(").concat(T,", ").concat(T,")")),
    n&&(s="top left,".concat(n),i+=t._cssUtils.genCssKV("background-position","".concat(s)),
    c+=t._cssUtils.genCssKV("background-position","".concat(s,",top left"))),a&&(l="100%,".concat(a),
    i+=t._cssUtils.genCssKV("background-size","".concat(l)),c+=t._cssUtils.genCssKV("background-size","".concat(l,",100%"))),
    t._bgStack.push(e,c)):!u&&t._bgStack.push(e,t._cssUtils.genCssKV("background-image","linear-gradient(".concat("rgba(0,0,0,0.1)",", ").concat("rgba(0,0,0,0.1)","),linear-gradient(").concat(T,", ").concat(T,")"))),
    o;
    }),!l){
    var E=e.getAttribute(j)||t._config.defaultLightTextColor;
    i+=t._cssUtils.genCssKV("color",E),d(e).forEach(function(e){
    return e.setAttribute(B,E);
    });
    }
    }
    }
    p&&(N.test(g)&&(o[h]=Q(g)),_?t._bgStack.push(e,t._cssUtils.genCssKV(h,f)):i+=t._cssUtils.genCssKV(h,f));
    }),i){
    L&&e.setAttribute("data-style",o.cssText);
    var k="".concat("js_darkmode__").concat(this._idx++);
    e.classList.add(k),s+=i?this._cssUtils.genCss(k,i):"";
    }
    return p="",e.childNodes.forEach(function(e){
    3===e.nodeType&&(p+=e.nodeValue.replace(/\s/g,""));
    }),p.length>0&&(this._config.delayBgJudge?this._tnQueue.push(e):this._bgStack.contains(e,function(e){
    s+=t._cssUtils.genCss(e.className,e.cssKV);
    })),s;
    }
    }])&&v(t.prototype,r),n&&v(t,n),e;
    }(),Z=new RegExp("".concat("js_darkmode__","[^ ]+"),"g"),et={
    hasInit:!1,
    error:null,
    mode:"",
    whitelist:{
    tagName:["MPCPS","IFRAME"]
    },
    needJudgeFirstPage:!0,
    delayBgJudge:!1,
    container:null,
    cssSelectorsPrefix:"",
    defaultLightTextColor:"#191919",
    defaultLightBgColor:"#fff",
    defaultDarkTextColor:"#a3a3a3",
    defaultDarkBgColor:"#191919"
    },tt=new D(et,"".concat("js_darkmode__","text__")),rt=new F(et,"".concat("js_darkmode__","bg__")),nt=new q(et),at=new I(et),ot=new Y({
    config:et,
    tnQueue:tt,
    bgStack:rt,
    cssUtils:nt
    }),it=null,st=function(e){
    var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{
    type:"dom"
    };
    if(t.force&&(nt.isFinish=!1),!nt.isFinish)try{
    (et.mode?"dark"===et.mode:e.matches)?("dom"===t.type?at.get().forEach(function(e){
    if(e.className&&"string"==typeof e.className&&(e.className=e.className.replace(Z,"")),
    et.needJudgeFirstPage){
    var t=e.getBoundingClientRect(),r=t.top,n=t.bottom;
    0>=r&&0>=n?nt.addCss(ot.convert(e),!1):r>0&&P>r||n>0&&P>n?(at.addFirstPageNode(e),
    nt.addCss(ot.convert(e),!0)):(et.needJudgeFirstPage=!1,nt.writeStyle(!0),at.showFirstPageNodes(),
    nt.addCss(ot.convert(e),!1));
    }else nt.addCss(ot.convert(e),!1);
    }):"bg"===t.type&&tt.forEach(function(e){
    return rt.contains(e,function(e){
    nt.addCss(nt.genCss(e.className,e.cssKV),!1);
    });
    }),nt.writeStyle()):(et.needJudgeFirstPage=!1,et.delayBgJudge=!1,null===et.container&&"dom"===t.type&&at.len()&&at.delay());
    }catch(e){
    console.error(e),"function"==typeof et.error&&et.error(e);
    }
    };
    }]);
    });