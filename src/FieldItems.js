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
		const HELD_STRENGTH_MULT = 5
		let relX = Math.abs(absX - this.x)-this.w/4;
		let relY = Math.abs(absY - this.y)-this.h/4;
		if(this.held){
			return HELD_STRENGTH_MULT*strength/(Math.sqrt(relX*relX+relY*relY));
		}
		else return strength/(Math.sqrt(relX*relX+relY*relY));
	}
	
	//Returns the corner of the shape - top left, top right, bottom right, bottom left
	getCorners(){
		this.x = this.nextX || this.x;
		this.y = this.nextY || this.y; 
		this.vx = this.nextVx || this.vx;
		this.vy = this.nextVy || this.vy; 
		const dx = this.w/2;
		const dy = this.h/2;
		return [[this.x-dx, this.y-dy],[this.x+dx, this.y-dy],
					[this.x+dx, this.y+dy],[this.x-dx, this.y+dy]];
	}

	//for the given force this function calculates the average of the force and 
	//velocity vector for the new velocity vector.
	getNextLocation(force, distance, mouseX, mouseY, mouseDown, heldState){
		//check if user has clicked and held this object
		//if it was held down on the last loop, or if there is a new click
		//how we update this.mouseX will change position only if mouse down
		if(this.heldDown || (!heldState || this.held) && mouseX>this.x && mouseX<(this.x+this.w) && mouseY>this.y && mouseY<(this.y+this.h) ){
			let dx = 0;
			let dy = 0;
			if(mouseDown){
				dx = mouseX - this.mouseX;
				dy = mouseY - this.mouseY;
				this.nextX = this.x + dx;
			    this.nextY = this.y + dy;
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
		const sumX = force.fx * 0.0001 * distance + this.vx; 
		const sumY = force.fy * 0.0001 * distance + this.vy;
		const mag = Math.sqrt(sumX * sumX + sumY * sumY);
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
			const fromCx = Math.abs(absX-this.w/2);
			const fromCy = Math.abs(absY-this.h/2);
			//return Math.pow(fromCx,2)+Math.pow(fromCy,2)
			return Math.sqrt(Math.pow(fromCx,4)+Math.pow(fromCy,4))

	}
}