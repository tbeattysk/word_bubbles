class FieldObject{
	constructor(x,y,width,height){
		this.x = x;
		this.y = y;
		this.vx = Math.random();
		this.vy = Math.random();
		this.w = width; 
		this.h = height;
		this.held = false;
		this.heldDown = false;
		this.mouseX;
		this.mouseY;
	}
	
	//Returns the field potential as the inverse
	getPotential(absX, absY, strength){
		var relX = Math.abs(absX - this.x)-this.w/4;
		var relY = Math.abs(absY - this.y)-this.h/4;
		if(this.held){
			return 5*strength/(Math.sqrt(relX*relX+relY*relY));
		}
		else return strength/(Math.sqrt(relX*relX+relY*relY));
	}
	
	//Returns the corner of the shape - top left, top right, bottom right, bottom left
	getCorners(){
		this.x = this.nextX || this.x;
		this.y = this.nextY || this.y; 
		this.vx = this.nextVx || this.vx;
		this.vy = this.nextVy || this.vy; 
		var dx = this.w/2;
		var dy = this.h/2;
		return [[this.x-dx, this.y-dy],[this.x+dx, this.y-dy],
					[this.x+dx, this.y+dy],[this.x-dx, this.y+dy]];
	}

	//for the given force this function calculates the average of the force and 
	//velocity vector for the new velocity vector.
	getNextLocation(force, distance, mouseX, mouseY, mouseDown, heldState){
		if(this.heldDown || mouseX>this.x && mouseX<(this.x+this.w) && mouseY>this.y && mouseY<(this.y+this.h) && (!heldState || this.held)){
			var dx = 0;
			var dy = 0;
			if(mouseDown){
				dx = mouseX - this.mouseX;
				dy = mouseY - this.mouseY;
			}
			this.mouseX = mouseX;
			this.mouseY = mouseY;
			this.nextX = this.x + dx;
			this.nextY = this.y + dy;
			if(mouseDown){
				this.heldDown = true;
			}
			else this.heldDown = false;
			this.held = true;

			return{
				x: this.nextX,
				y: this.nextY,
				w: this.w,
				h: this.h
			}	
		}
		else this.held = false;
		var sumX = force.fx * 0.0001 * distance + this.vx; 
		var sumY = force.fy * 0.0001 * distance + this.vy;
		var mag = Math.sqrt(sumX * sumX + sumY * sumY);
		this.nextVx = distance * sumX / mag;
		this.nextVy = distance * sumY / mag;
		this.nextX = this.x + (this.nextVx);
		this.nextY = this.y + (this.nextVy);
		return {
			x: this.nextX,
			y: this.nextY,
			w: this.w,
			h: this.h
		}
	}
}


class FieldBackground{
	constructor(width,height){
		this.w = width;
		this.h = height;
	}
	
	//Returns the field potential as spherical where center is zero
	getPotential(absX, absY){
			var fromCx = Math.abs(absX-this.w/2);
			var fromCy = Math.abs(absY-this.h/2);
			//return Math.pow(fromCx,2)+Math.pow(fromCy,2)
			return Math.sqrt(Math.pow(fromCx,4)+Math.pow(fromCy,4))

	}
}