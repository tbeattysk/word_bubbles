class FieldObject{
	constructor(x,y,v,width,height,globalArea){
		this.x = x;
		this.y = y;
		this.v = v;
		this.w = width; 
		this.h = height;
		this.a = globalArea;
	}
	//Returns the field potential as the inverse
	getPotential(absX, absY){
		var relX = Math.abs(absX - this.x);
		var relY = Math.abs(absY - this.y);
		if(relX > this.w/2 && relY > this.h/2){
			return this.a/(Math.sqrt(relX*relX+relY*relY));
		}
		else return undefined
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
		else return undefined
	}
}