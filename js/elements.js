let _pg = window._pg = window._pg || {}
_pg.self_closing_tags = 'br,hr,img,input,meta,link,col,source'.split(',');
_pg.pairing_tags = 'div,ol,ul,li,i,a,label,button,select,option,span,form,table,tbody,tr,th,td,nav,footer,script,style,audio,video,canvas,svg,article,section,aside,title,p,h1,h2,h3,h4,h5,markdown,strong'.split(',');

// decompose selector
function decomp_selector(sel){
    let ret = {};
    let m1 = sel.match(/^[^#\.]+/);
    if(!m1){
        ret.tag = 'div'; // can be omitted
    }else{
        ret.tag = m1[0];
    }
    let m2 = sel.match(/#[^#\.]+/);
    if(m2){
        ret.id = m2[0].substr(1);
    }
    let m3 = [...sel.matchAll(/\.[^#\.]+/g)];
    if(m3.length > 0){
        ret.class = m3.map(e=>e[0].substr(1)).join(' ');
    }
    return ret;
}
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

function tagged_template_TABLEROW(strings, ...values){
    const row = values[0];
    let ret = '';
    for(let ii=1;ii<values.length;++ii){
        let val = values[ii];
        let attr = strings[ii].trim();
        if(Array.isArray(val)){
            attr = (attr + ` data-col="${val}"`).trim();
            val = row[val[0]];
        }
        ret += `<td ${attr}>${val}</td>`;
    }
    return ret;
}
_pg.tr = tagged_template_TABLEROW;
function tagged_template_DATASEL(strings, r, c){
    // e.g. tt`#form_login ${row_id}row ${col_id}col`
    return `${strings[0].trim()} tr[data-${strings[1].trim()}="${r}"] td[data-${strings[2].trim()}="${c}"]`;
}
_pg.ds = tagged_template_DATASEL;
function tagged_template_DATAELE(strings, ...values){
    return document.querySelector(tagged_template_DATASEL(strings, ...values));
}
_pg.de = tagged_template_DATAELE;

function nest_from_straight(arr){
    // arr.length = 2n+1
    let ret = [];
    let cur = ret;
    for(let ii=1;ii<arr.length;ii+=2){
        cur.push(arr[ii-1], arr[ii]);
        if(ii+2==arr.length){
            cur.push(arr[ii+1]);
        }else{
            cur.push([[]]);
        }
        cur = cur[2][0]; // single child node
    }
    return ret;
}
// render DOM element
function create_ele(obj){
    let [br,hr,img,input,meta,link,col,source] = _pg.self_closing_tags;
    let [div,ol,ul,li,i,a,label,button,select,option,span,form,table,tbody,tr,th,td,nav,footer,script,style,audio,video,canvas,svg,article,section,aside,title,p,h1,h2,h3,h4,h5,markdown,strong] = _pg.pairing_tags;
    let all_tags = _pg.self_closing_tags.concat(_pg.pairing_tags);
    
    if(typeof obj == 'string'){
        obj = eval(obj);
        if(typeof obj == 'string' && all_tags.includes(obj)){
            obj = [obj];
        }
    }// unquoted tag converted

    if(typeof obj == 'string'){
        // string -> textContent
        return document.createTextNode(obj);
    }
    if(Array.isArray(obj) && obj.length>3){
        obj = nest_from_straight(obj);
    }
    
    // real render, recursively
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