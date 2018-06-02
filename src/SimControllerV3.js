'use strict';
class SimController{
	constructor(ctx, e){
		//this.e = e;
		window.addEventListener('mousemove', this.getMousePos.bind(this));
		window.addEventListener('mousedown', this.setMouseDown.bind(this));
		window.addEventListener('mouseup', this.setMouseUp.bind(this));
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseDown = false;
		this.ctx = ctx;
		this.w = window.innerWidth;
		this.h = window.innerWidth;
		this.objects = new Array;
		this.titles = new Array;
		this.engine = new SimEngine(this.w,this.h);
	}
	resize(w,h){
		this.w=w;
		this.h = h;
		this.engine.resize(w,h);
	}
	getMousePos(evt) {
		if(evt.target.id == "canvas"){
		    this.mouseX = evt.clientX - this.ctx.canvas.offsetLeft;
		    this.mouseY = evt.clientY - this.ctx.canvas.offsetTop;
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

	addObject(sizeX,sizeY){
		this.load("http://www.setgetgo.com/randomword/get.php", create.bind(this));

		function create(resp){
			const word = resp.response.toUpperCase()
			const x = this.w * Math.random(); //Uh Oh
			const y = this.h * Math.random();
			this.titles.push(word)
			this.ctx.font = "24px Arial";
			console.log(this.ctx.measureText(word).width)
			this.objects.push({x:x-sizeX/2,y:y-sizeY/2, w:this.ctx.measureText(word).width +10, h:sizeY});
			this.engine.addObject(new FieldObject(x,y,this.ctx.measureText(word).width+10,sizeY,this.engine.objFieldX, this.engine.objFieldY));
		}
	}

	draw(){
		this.ctx.clearRect(0,0,this.w,this.h);
		this.objects.forEach((object,i,a)=>{

			this.ctx.fillStyle="#fff";
			//this.ctx.rect(object.x, object.y, object.w+2, object.h+2);
		},this);
		this.objects.forEach((object,i,a)=>{
			this.ctx.fillStyle="#fff";
			this.ctx.fillRect(object.x-object.w/2, object.y, object.w, object.h);
			this.ctx.stroke();
			this.ctx.fillStyle="#000";
			this.ctx.font = "24px Arial";
			this.ctx.fillText(this.titles[i],object.x - object.w/2 + 5,object.y + object.h - 5);
		}, this);
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