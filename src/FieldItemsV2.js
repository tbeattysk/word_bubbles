'use strict';
class FieldObject{
	constructor(x,y,width,height){
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
	}
	
	//Returns the field potential as the inverse
	getPotential(absX, absY, strength){
		if(this.held){
			return 5 * strength/(Math.sqrt( (Math.abs(absX - this.x)-this.w/4) * (Math.abs(absX - this.x)-this.w/4) + (Math.abs(absY - this.y)-this.h/4) * (Math.abs(absY - this.y)-this.h/4) ));
		}
		else return strength/(Math.sqrt( (Math.abs(absX - this.x)-this.w/4) * (Math.abs(absX - this.x)-this.w/4) + (Math.abs(absY - this.y)-this.h/4) * (Math.abs(absY - this.y)-this.h/4) ));
	}
	
	//Returns the corner of the shape - top left, top right, bottom right, bottom left
	getCorners(){
		this.x = this.nextX || this.x;
		this.y = this.nextY || this.y; 
		this.vx = this.nextVx || this.vx;
		this.vy = this.nextVy || this.vy; 
		return [[this.x-this.w/2, this.y-this.h/2],[this.x+this.w/2, this.y-this.h/2],
					[this.x+this.w/2, this.y+this.h/2],[this.x-this.w/2, this.y+this.h/2]];
	}

	//for the given force this function calculates the average of the force and 
	//velocity vector for the new velocity vector.
	getNextLocation(force, distance, mouseX, mouseY, mouseDown, heldState){
		//check if user has clicked and held this object
		//if it was held down on the last loop, or if there is a new click
		//how we update this.mouseX will change position only if mouse down
		if(this.heldDown || (!heldState || this.held) && mouseX>this.x && mouseX<(this.x+this.w) && mouseY>this.y && mouseY<(this.y+this.h) ){
			if(mouseDown){
				this.nextX = this.x + mouseX - this.mouseX;
			    this.nextY = this.y + mouseY - this.mouseY;
				this.heldDown = true;
			}else this.heldDown = false;
			//console.log("this.mouseX: " + this.mouseX + "  mouseX: "+ mouseX );
			this.mouseX = mouseX;
			this.mouseY = mouseY;
			this.held = true;

			return{
				x: this.nextX,
				y: this.nextY,
				w: this.w,
				h: this.h
			}	
		}
		else this.held = false;
		//distance * unit vector to move 1px per cycle
		let forceX = force.fx;
		let forceY = force.fy;
		let ax = forceX*0.00001;
		let ay = forceY*0.00001;
		//console.log(ax +" " +ay);
		let vx = this.vx + ax;
		let vy = this.vy + ay;
		let vtotal = Math.sqrt(vx*vx + vy*vy);
		//console.log(vtotal)
		if(vtotal > 2 || vtotal < -2){
			//console.log("max");
			vx = 2 * (forceX * 0.0001 + this.vx) 
						/ Math.sqrt((forceX * 0.0001 + this.vx) 
						* (forceX * 0.0001 + this.vx) 
						+ (forceY * 0.0001 + this.vy) 
						* (forceY * 0.0001 + this.vy));
			vy = 2 * (forceY * 0.0001 + this.vy) 
						/ Math.sqrt((forceX * 0.0001 + this.vx) 
						* (forceX * 0.0001 + this.vx) 
						+ (forceY * 0.0001 + this.vy) 
						* (forceY * 0.0001 + this.vy));
		}/*else if(vtotal<0.3 && vtotal>0.03){
			console.log("min");
			vx = 0.3 * (forceX * 0.0001 + this.vx) 
						/ Math.sqrt((forceX * 0.0001 + this.vx) 
						* (forceX * 0.0001 + this.vx) 
						+ (forceY * 0.0001 + this.vy) 
						* (forceY * 0.0001 + this.vy));
			vy = 0.3 * (forceY * 0.0001 + this.vy) 
						/ Math.sqrt((forceX * 0.0001 + this.vx) 
						* (forceX * 0.0001 + this.vx) 
						+ (forceY * 0.0001 + this.vy) 
						* (forceY * 0.0001 + this.vy));
		}*/
		//console.log(this.nextX+" x "+this.x)

		this.nextX = this.x + (vx);
		this.nextY = this.y + (vy);
		this.vx = vx;
		this.vy = vy;
		return {
			x: this.nextX,
			y: this.nextY,
			w: this.w,
			h: this.h
		}
	}

	changeAccel(forceX, forceY){
		let ax = forceX*0.0001;
		let ay = forceY*0.0001;
		console.log(ax +" " +ay);
		let vx = ax + this.vx;
		let vy = ay + this.vy;
		let vtotal = sqrt(vx*vx + vy*vy);
		if(vtotal > 1 || vtotal < -1){
			vx = 1 * (ax + this.vx) 
						/ Math.sqrt((ax + this.vx) 
						* (ax + this.vx) 
						+ (ay + this.vy) 
						* (ay + this.vy));
			vy = 1 * (ay + this.vy) 
						/ Math.sqrt((ax + this.vx) 
						* (ax + this.vx) 
						+ (ay + this.vy) 
						* (ay + this.vy));
		}/*else if(vtotal<0.3 && vtotal>0.03){
			console.log(min);
			vx = 0.3 * (forceX * 0.0001 + this.vx) 
						/ Math.sqrt((forceX * 0.0001 + this.vx) 
						* (forceX * 0.0001 + this.vx) 
						+ (forceY * 0.0001 + this.vy) 
						* (forceY * 0.0001 + this.vy));
			vy = 0.3 * (forceY * 0.0001 + this.vy) 
						/ Math.sqrt((forceX * 0.0001 + this.vx) 
						* (forceX * 0.0001 + this.vx) 
						+ (forceY * 0.0001 + this.vy) 
						* (forceY * 0.0001 + this.vy));
		}*/
	}
}


class FieldBackground{
	constructor(width,height){
		this.w = width;
		this.h = height;
	}
	resize(w,h){
		this.w=w;
		this.h=h;
	}
	//Returns the field potential as spherical where center is zero
	getPotential(absX, absY){
			//return Math.pow(fromCx,2)+Math.pow(fromCy,2)
			return 5*Math.sqrt(Math.pow(Math.abs(absX-this.w/2),4)+Math.pow(Math.abs(absY-this.h/2),4))

	}
}