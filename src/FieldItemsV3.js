'use strict';
class FieldObject{
	constructor(x,y,width,height,fieldX,fieldY){
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
		//console.log(this.field)
	}
	getCenter(){
		//this.cx = this.x;
		//this.cy = this.y;
		return[this.x, this.y]
	}

	getField(absC, strength){
		let rangeX = this.fieldX.length-15;
		let rangeY = this.fieldX[0].length-15;
		//console.log(this.fieldX)
		//console.log(Math.floor(Math.abs(this.x-absC[0]))+ " of range: "+rangeX);
		//console.log(Math.floor(Math.abs(this.y-absC[1])));
		if(Math.abs(Math.abs(this.x-absC[0]))>rangeX || Math.abs(Math.abs(this.y-absC[1]))>rangeY){
			return [0,0];
		}else{
			let fieldX= Math.sign(absC[0]-this.x) * this.fieldX[ Math.floor(Math.abs(this.x-absC[0])) ][ Math.floor(Math.abs(this.y-absC[1])) ];
			let fieldY= Math.sign(absC[1]-this.y) * this.fieldY[ Math.floor(Math.abs(this.x-absC[0])) ][ Math.floor(Math.abs(this.y-absC[1])) ];
			//console.log("objField: "+fieldX+ " "+ fieldY);
			
			return[fieldX, fieldY]
		}
	}

	//for the given force this function calculates the average of the force and 
	//velocity vector for the new velocity vector.
	getNextLocation(force, distance, mouseX, mouseY, mouseDown, heldState){
		//check if user has clicked and held this object
		//if it was held down on the last loop, or if there is a new click
		//how we update this.mouseX will change position only if mouse down
		if(this.heldDown || (!heldState || this.held) && mouseX>this.x && mouseX<(this.x+this.w) && mouseY>this.y && mouseY<(this.y+this.h) ){
			if(mouseDown){
				this.x = this.x + mouseX - this.mouseX;
			    this.y = this.y + mouseY - this.mouseY;
				this.heldDown = true;
			}else this.heldDown = false;
			//console.log("this.mouseX: " + this.mouseX + "  mouseX: "+ mouseX );
			this.mouseX = mouseX;
			this.mouseY = mouseY;
			this.held = true;

			return{
				x: this.x,
				y: this.y,
				w: this.w,
				h: this.h
			}	
		}
		else this.held = false;
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
		//console.log(this.nextX+" x "+this.x)
		this.x = this.x + (vx);
		this.y = this.y + (vy);
		this.vx = vx;
		this.vy = vy;
		return {
			x: this.x,
			y: this.y,
			w: this.w,
			h: this.h
		}
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
				this.fieldX[i+this.w/2][j+this.h/2]=10*i*i*i/(Math.sqrt(i*i*i*i+j*j*j*j));
				this.fieldY[i+this.w/2][j+this.h/2]=10*j*j*j/(Math.sqrt(i*i*i*i+j*j*j*j));
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
		//console.log(absC)
		if(absC[0]>0 && absC[0]<this.w){
			//console.log("a")
			absX=absC[0];
		}
		else if(absC[0]>0){
			//console.log("b")
			absX=this.w-1;
		}
		else if(absC[0]<this.w){
			//console.log("c")
			absX=0;
		}
		if(absC[1]>0 && absC[1]<this.h){
			//console.log("1")			
			absY=absC[1];
		}
		else if(absC[1]>0){
			//console.log("2")			
			absY=this.h-1;
		}
		else if(absC[1]<this.h){
			//console.log("3")			
			absY=0
		}
		//console.log("backForce: " +[absX,absY])
		return[-this.fieldX[Math.floor(absX)][Math.floor(absY)]
			,-this.fieldY[Math.floor(absX)][Math.floor(absY)]]
	}
}