let _pg = window._pg = window._pg || {}
_pg.self_closing_tags = 'br,hr,img,input,meta,link,col,source'.split(',');
_pg.pairing_tags = 'div,ol,ul,li,i,a,label,button,select,option,span,form,table,tbody,tr,th,td,nav,footer,script,style,audio,video,canvas,svg,article,section,aside,title,p,h1,h2,h3,h4,h5,markdown,strong'.split(',');

// decompose selector str (e.g. TAG#ID.CLASS) to obj {tag, id, class}
function decomp_selector(sel){
    let ret = {};
    // tagName until sharp or dot
    let m1 = sel.match(/^[^#\.]+/);
    if(!m1){
        ret.tag = 'div'; // can be omitted
    }else{
        ret.tag = m1[0];
    }
    // id starts with sharp
    let m2 = sel.match(/#[^#\.]+/);
    if(m2){
        ret.id = m2[0].substr(1);
    }
    // className starts with dot
    let m3 = [...sel.matchAll(/\.[^#\.]+/g)];
    if(m3.length > 0){
        // remove dots
        ret.class = m3.map(e=>e[0].substr(1)).join(' ');
    }
    return ret;
}
// compose selector str from obj {tag, id, class}
function comp_selector(d){
    let ret = d.tag;
    if(d.class){
        ret += '.' + d.class.split(' ').join('.');
    }
    if(d.id){
        ret += '#' + d.id;
    }
    return ret;
}


// predefined tagged template literals for string interpolation 

// usage: _pg.tr`comments ${row_data} attr1=sth1 attr2=sth2 ${ref1} attr3=sth3 attr4=sth4 ${ref2}`
function tagged_template_TABLEROW(strings, ...values){
    // string[0] is ommitted, or use for comments
    const row = values[0]; // leave blank if directly supplied in later values
    let ret = '';
    for(let ii=1;ii<values.length;++ii){
        let val = values[ii];
        let attr = strings[ii].trim();
        // use val=[ref] to refer to the value row[ref]
        if(Array.isArray(val)){
            attr = (attr + ` data-col="${val}"`).trim();
            val = row[val[0]];
        }
        ret += `<td ${attr}>${val}</td>`;
    }
    return ret;
}
_pg.tr = tagged_template_TABLEROW;

// usage: _pg.ds`#form_login ${row_id}row ${col_id}col`
function tagged_template_DATASEL(strings, r, c){
    return `${strings[0].trim()} tr[data-${strings[1].trim()}="${r}"] td[data-${strings[2].trim()}="${c}"]`;
}
_pg.ds = tagged_template_DATASEL;
function tagged_template_DATAELE(strings, ...values){
    return document.querySelector(tagged_template_DATASEL(strings, ...values));
}
_pg.de = tagged_template_DATAELE;

// arr.length = 2n+1; transfromed to size-3 with remaining elements nested in the tail
function nest_from_straight(arr){
    let ret = [];
    let cur = ret;
    for(let ii=1;ii<arr.length;ii+=2){
        cur.push(arr[ii-1], arr[ii]);
        if(ii+2==arr.length){
            cur.push(arr[ii+1]);
        }else{
            cur.push([[]]);
        }
        // move on to the tail's single child node
        cur = cur[2][0];
    }
    return ret;
}
// render DOM elements from a condensed string
function create_ele(obj){
    // destructing assignment
    let [br,hr,img,input,meta,link,col,source] = _pg.self_closing_tags;
    let [div,ol,ul,li,i,a,label,button,select,option,span,form,table,tbody,tr,th,td,nav,footer,script,style,audio,video,canvas,svg,article,section,aside,title,p,h1,h2,h3,h4,h5,markdown,strong] = _pg.pairing_tags;
    let all_tags = _pg.self_closing_tags.concat(_pg.pairing_tags);
    
    if(typeof obj == 'string'){
        // str -> variable corresponding to the specified str, otherwise should be quoted
        obj = eval(obj);
        if(typeof obj == 'string' && all_tags.includes(obj)){
            obj = [obj];
        }
    }// unquoted tag converted

    // not become array in the previous step
    if(typeof obj == 'string'){
        // string -> textContent
        return document.createTextNode(obj);
    }
    if(Array.isArray(obj) && obj.length>3){
        obj = nest_from_straight(obj);
    }
    
    // real render func for [tag, attr, nodes], recursively
    function render(tag, attr={}, nodes=[]){
        let d = decomp_selector(tag);
        let ele = document.createElement(d.tag);
        if(typeof attr == 'string' || Array.isArray(attr)){
            // omit empty attr, shift args
            nodes = attr;
            attr = {};
        }
        if(d.id){
            attr.id = d.id;
        }
        if(d.class){
            attr.class = (attr.class || '') + ' ' + d.class;
            attr.class = attr.class.trimLeft();
        }
        for(let k in attr){
            ele.setAttribute(k, attr[k]);
        }
        if(!Array.isArray(nodes)){
            nodes = [nodes];
        }
        nodes.length > 0 && nodes.forEach( (e)=>{
            if(typeof e == 'string' && all_tags.includes(e)){
                e = [e];
            }else if(Array.isArray(e) && e.length>3){
                e = nest_from_straight(e);
            }

            if(typeof e == 'string'){
                ele.appendChild(document.createTextNode(e));
            }else{
                ele.appendChild(render(...e));
            }
        });
        return ele;
    }
    return render(...obj);
   
}

function test_render(){
    //examples
    let tests = [
        `"Hello World"`, // pure textNode
        `div`, `[div]`, `[i, {class:"fas-circle"}]`, // incomplete
        `[input, {type:"text",value:"Male"}]`,
        `[p, "Paragraph" ]`, // single child textNode
        `[form,{action:"/"}, [
            [input, {type: "text"}],
            [p, "please fill in"],
            button
        ]]`, // mixed
        `["table.panel.panel-info", {id:"data_sheet"}, [
            [h1, "Data"],
            [tbody,{class:"table-content"},[
                [tr,[th,th,th]],
                [tr,{"data-row":1},[td,td,td]]
            ]]
        ]]`,
        `['#nest_table',{},table,{},tbody,{},tr,{},[th,th,th]]`, // nested
        ['tr',{id:"header_row"},['th', 'th', 'th']] // object
    ];

    tests.forEach((e,i)=>{
        let ret = create_ele(e);
        console.log(i, e, ':', ret.outerHTML || ret.textContent);
    });
}

// expose

_pg.create_ele = create_ele;
_pg.test_render = test_render;