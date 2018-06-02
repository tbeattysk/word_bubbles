'use strict';
class SimController{
	constructor(pg, e){
		//this.e = e;
		window.addEventListener('mousemove', this.getMousePos.bind(this));
		window.addEventListener('mousedown', this.setMouseDown.bind(this));
		window.addEventListener('mouseup', this.setMouseUp.bind(this));
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseDown = false;
		this.pg = pg;
		this.w = window.innerWidth;
		this.h = window.innerWidth;
		this.engine = new SimEngine(this.w,this.h);
	}
	resize(w,h){
		this.w=w;
		this.h = h;
		this.engine.resize(w,h);
	}
	getMousePos(evt) {
		if(evt.srcElement.className == "word"){
		    this.mouseX = evt.clientX - this.pg.offsetLeft;
		    this.mouseY = evt.clientY - this.pg.offsetTop;
	    }
	}
	setMouseDown(evt){
		this.mouseDown=true;
	}
	setMouseUp(evt){
		this.mouseDown=false;
	}

	getEngine(){
		return "Engine is running!";
	}
	//TODO: why is sizeX/Y being used for location?
	addObject(sizeX,sizeY){
		this.load("http://www.setgetgo.com/randomword/get.php", create.bind(this));

		function create(resp){
			const word = resp.response.toUpperCase()
			const x = Math.floor(this.w * Math.random()); //Uh Oh
			const y = Math.floor(this.h * Math.random());
			var para = document.createElement("p");
			para.draggable = true;
			para.classList.add("word");
			para.style.height="20px";
			var node = document.createTextNode(word);
			para.appendChild(node);
			this.pg.appendChild(para);
			this.engine.addObject(new FieldObject(x,y,para.clientWidth,para.clientHeight,this.engine.objFieldX, this.engine.objFieldY, para));
			para.style.transform="translate("+x+"px, "+y+"px)";
		}
	}

	draw(){
		this.engine.objects.forEach((object,i,a)=>{
			object.el.style.transform="translate("+object.x+"px,"+object.y+"px)";
			//console.log(object.el.style.transform)
		});
		animation = requestAnimationFrame(sim.draw.bind(sim));
		this.objects =  this.engine.getNextFrame(1, this.mouseX, this.mouseY, this.mouseDown)
	}

	//load from http://code.tutsplus.com/articles/how-to-make-ajax-requests-with-raw-javascript--net-4855
	load(url, callback) {
        let xhr;
         
        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
            var versions = ["MSXML2.XmlHttp.5.0", 
                            "MSXML2.XmlHttp.4.0",
                            "MSXML2.XmlHttp.3.0", 
                            "MSXML2.XmlHttp.2.0",
                            "Microsoft.XmlHttp"]
 
             for(let i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch(e){}
             } // end for
        }
         
        xhr.onreadystatechange = ensureReadiness;
         
        function ensureReadiness() {
            if(xhr.readyState < 4) {
                return;
            }
             
            if(xhr.status !== 200) {
                return;
            }
 
            // all is well  
            if(xhr.readyState === 4) {
                callback(xhr);
            }           
        }
         
        xhr.open('GET', url, true);
        xhr.send('');
    }
}