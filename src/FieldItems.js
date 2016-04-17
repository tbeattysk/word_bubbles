class FieldObject{
	constructor(x,y,vx,vy,width,height){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy
		this.w = width; 
		this.h = height;
	}
	
	//Returns the field potential as the inverse
	getPotential(absX, absY, strength){
		var relX = Math.abs(absX - this.x);
		var relY = Math.abs(absY - this.y);
		if(relX > this.w/2 || relY > this.h/2){
			return strength/(Math.sqrt(relX*relX+relY*relY));
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
	getNextLocation(force, distance){
		var sumX = force.fx * 0.0001 * distance + this.vx; 
		var sumY = force.fy * 0.0001 * distance + this.vy;
		var mag = Math.sqrt(sumX * sumX + sumY * sumY);
		this.nextVx = distance * sumX / mag;
		this.nextVy = distance * sumY / mag;
		this.nextX = this.x + (this.nextVx);
		this.nextY = this.y + (this.nextVy);
		return {
			x: this.nextX,
			y: this.nextY
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
		if(absX > 0 && absX < this.w && absY > 0 && absY< this.h){
			var fromCx = absX-this.w/2;
			var fromCy = absY-this.h/2;
			return (fromCx*fromCx+fromCy*fromCy)
		}
		else return (fromCx*fromCx+fromCy*fromCy)
	}
}