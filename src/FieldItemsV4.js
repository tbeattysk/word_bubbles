'use strict';
class FieldObject{
	constructor(x,y,width,height,fieldX,fieldY,el){
		this.el = el;
		this.x = x;
		this.y = y;
		this.vx = Math.random();
		this.vy = Math.random();
		this.ax = 0;
		this.ay = 0;
		this.w = width; 
		this.h = height;
		this.held = false;
		this.heldDown = false;
		this.mouseX;
		this.mouseY;
		this.fieldX=fieldX;
		this.fieldY=fieldY;
		el.addEventListener("mouseenter",this.mouseEnter.bind(this));
		el.addEventListener("mouseout",this.mouseExit.bind(this));
		el.addEventListener("dragstart",this.dragStart.bind(this));
		el.addEventListener("dragend",this.dragEnd.bind(this));
		el.addEventListener("drag",this.drag.bind(this));

		//console.log(this.field)
	}
	getCenter(){
		return[this.x, this.y]
	}
	mouseEnter(){
		this.over=true;
	}
	mouseExit(){
		this.over=false;
	}
	dragStart(e){
		this.drag=true;
	}
	drag(e){
		console.log(e);
	}
	dragEnd(){
		this.drag=false;
	}
	getField(absC, strength){
		let rangeX = this.fieldX.length-1;
		let rangeY = this.fieldX[0].length-1;
		if(Math.abs(Math.abs(this.x-absC[0]))>rangeX || Math.abs(Math.abs(this.y-absC[1]))>rangeY){
			return [0,0];
		}else{
			let fieldX= Math.sign(absC[0]-this.x) * this.fieldX[ Math.floor(Math.abs(this.x-absC[0])) ][ Math.floor(Math.abs(this.y-absC[1])) ];
			let fieldY= Math.sign(absC[1]-this.y) * this.fieldY[ Math.floor(Math.abs(this.x-absC[0])) ][ Math.floor(Math.abs(this.y-absC[1])) ];
			return[fieldX, fieldY]
		}
	}

	//for the given force this function calculates the average of the force and 
	//velocity vector for the new velocity vector.
	getNextLocation(force, distance, mouseX, mouseY, mouseDown, heldState){
		//check if user has clicked and held this object
		//if it was held down on the last loop, or if there is a new click
		//how we update this.mouseX will change position only if mouse down
		if(this.over){
			return
		}
		//console.log(this.el)
		//distance * unit vector to move 1px per cycle
		//console.log("Force: "+ force[0]+" "+force[1])
		let ax = force[0]*0.00001;
		let ay = force[1]*0.00001;
		//console.log("Position: "+ this.x +" " +this.y);
		let vx = this.vx + ax;
		let vy = this.vy + ay;
		let vtotal = Math.sqrt(vx*vx + vy*vy);
		if(vtotal > 2 || vtotal < -2){
			//console.log("max");
			vx = 2 * (ax + this.vx) 
						/ Math.sqrt((ax + this.vx) 
						* (ax + this.vx) 
						+ (ay + this.vy) 
						* (ay + this.vy));
			vy = 2 * (ay + this.vy) 
						/ Math.sqrt((ax + this.vx) 
						* (ax + this.vx) 
						+ (ay + this.vy) 
						* (ay + this.vy));
		}
		//console.log(this.x)
		//console.log(this.nextX+" x "+this.x)
		this.vx = vx;
		this.vy = vy;
		this.x = this.x + (this.vx);
		this.y = this.y + (this.vy);
	}
}


class FieldBackground{
	constructor(width,height){
		this.w = width;
		this.h = height;
		this.fieldX = [[],[]];
		this.fieldY = [[],[]];		
		//console.log(this.fieldX);
		this.setField();
	}
	setField(){
		for(let i=-this.w/2; i<this.w/2; i++){
			this.fieldX.push(new Array)
			this.fieldY.push(new Array)
			for(let j=-this.h/2; j<this.h/2; j++){
				this.fieldX[i+this.w/2][j+this.h/2]= 10*i*i*i/(Math.sqrt(i*i*i*i+j*j*j*j));
				this.fieldY[i+this.w/2][j+this.h/2]= 10*j*j*j/(Math.sqrt(i*i*i*i+j*j*j*j));
			}
		}
	}
	resize(w,h){
		this.w=w;
		this.h=h;
		this.setField();
	}
	getField(absC){
		let absX=0;
		let absY=0;
		if(absC[0]>0 && absC[0]<this.w){
			absX=absC[0];
		}
		else if(absC[0]>0){
			absX=this.w-1;
		}
		else if(absC[0]<this.w){
			absX=0;
		}
		if(absC[1]>0 && absC[1]<this.h){
			absY=absC[1];
		}
		else if(absC[1]>0){
			absY=this.h-1;
		}
		else if(absC[1]<this.h){
			absY=0
		}
		return[-this.fieldX[Math.floor(absX)][Math.floor(absY)]
			,-this.fieldY[Math.floor(absX)][Math.floor(absY)]]
	}
}