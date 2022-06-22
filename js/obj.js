// Models

// handling local image edit and upload
_pg.Photo = class {
    constructor(){
        this.data = null;
        this.type = null;
        this.name = null;
        this.url = null; // updated when uploaded
        this.thumb = null;
        this.dom_ele = null;
    }
    static upload_url = null;
    set(data, type, name){
        this.data = data;
        this.type = type;
        this.name = name;
    }
    get(){
        return this.data;
    }
    upload(){ // TODO: notify when done
        return new Promise((resolve, reject)=>{
            if(!this.data){
                reject("No data");
                return;
            }
          
            if(!this.name){
                reject("No name");
                return;
            }
            let formData = new FormData();
            formData.append("file", this.data);
            formData.append("filename", this.name);
            _pg.ajax({
                url: constructor.upload_url,
                method: 'POST',
                data: formData,
            }).then(res=>{
                this.url = res.url;
                this.thumb = res.thumb; // thumbnail url
                resolve(res);
            }).catch(err=>{
                reject(err);
            });
        });
    }
    pick(){ // should be inited with a dom element
        return new Promise((resolve, reject)=>{
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = this.type;
            input.onchange = (e)=>{
                let file = e.target.files[0];
                this.name = file.name;
                this.data = file;
                resolve(file);
            }
            input.click();
        });
    }
    crop(x, y, w, h){
        return new Promise((resolve, reject)=>{
            if(!this.data){
                reject("No data");
                return;
            }
            let canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.onload = ()=>{
                ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
                this.data = canvas.toDataURL("image/jpeg");
                resolve(this.data);
            }
            img.src = this.data;
        });
    }
    fullscreen(){
        if(!this.dom_ele){ // may use a common one
            this.dom_ele = document.createElement('div'); // then add to DOM
            this.dom_ele.addEventListener('click', (e)=>{
                this.dom_ele.display = 'none';
                e.stopPropagation();
            });
        }
        this.dom_ele.display = 'block';
        
    }

}

_pg.Album = class {
    constructor(){
        this.prefix = '';
        this.photos = [];
        this.enabled = false;

    }
    addPhoto(photo){
        if(_pg.Photo.prototype == photo.constructor){
            this.photos.push(photo.url);
        }else{
            this.photos.push(photo);
        }
    }
    getPhoto(uno){
        return this.prefix + this.photos[uno];
    }
    getPhotos(){
        return this.photos.map(p=>this.prefix+p);
    }
    getPhotoCount(){
        return this.photos.length;
    }
    render(){// TODO: add options: grid, flow, etc
        let photo_class = this.photos.length > 1? 'photo-square': 'photo-single';
        return this.photos.map(p=>{
            let url = this.prefix+p;
            let thumb = url; // TODO: config
            // photo_square class enforce the size
            return `<div class="${photo_class}" data-src="${url}"><img class="center-cropped fullbox" src="${thumb}"></div>`;
        }).join('');

    }

}
