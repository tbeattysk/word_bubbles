'use strict';
class SimController{
	constructor(w,h,elList){
		this.elList=elList
		window.addEventListener('mousemove', this.getMousePos.bind(this));
		window.addEventListener('mousedown', this.setMouseDown.bind(this));
		window.addEventListener('mouseup', this.setMouseUp.bind(this));
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseDown = false;
        this.buttons = Object.keys(elList).reduce((p,c)=>{
            if(elList[c].localName === "button") p[c]=elList[c];
            return p;
        }, {});
        console.log(this.buttons);        
		this.objects = new Array;
		this.titles = new Array;
		this.engine = new SimEngine(this.w,this.h);
	}
	
	getMousePos(evt) {
		    this.mouseX = evt.clientX;
		    this.mouseY = evt.clientY;
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
			//console.log(resp.response)
			const x = this.w * Math.random(); //Uh Oh
			const y = this.h * Math.random();
			this.titles.push(resp.response)
            
            var newbtn = document.createElement("BUTTON");
            newbtn.appendChild(document.createTextNode(resp.response))
			document.getElementById("wordswarm").appendChild(newbtn);
			//this.ctx.font = "16px Arial";
			//console.log(this.ctx.measureText(resp.response).width)
			//console.log(newbtn.getBoundingClientRect().height);
			this.objects.push({x:x-sizeX/2,y:y-sizeY/2, w:newbtn.getBoundingClientRect().width, h: newbtn.getBoundingClientRect().height});
			this.engine.addObject(new FieldObject(x,y,newbtn.getBoundingClientRect().width,newbtn.getBoundingClientRect().height));
		}
	}

	draw(){
		this.ctx.clearRect(0,0,this.w,this.h);
		this.objects.forEach((object,i,a)=>{
			this.ctx.fillStyle="#FF0";
			this.ctx.fillRect(object.x, object.y, object.w, object.h);
			this.ctx.beginPath();
			this.ctx.rect(object.x, object.y, object.w, object.h);
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.fillStyle="#000";
			this.ctx.font = "16px Arial";
			this.ctx.fillText(this.titles[i],object.x + 5,object.y + object.h - 5);
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