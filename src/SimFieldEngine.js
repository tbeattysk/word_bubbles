class SimEngine{
	constructor(width, height){
        this.w = width;
        this.h = height;
		this.background = new FieldBackground(width,height);
        this.objects = new Array;
	}
    
    //returns the next location of the objects
    getNextFrame(distance){
        return this.objects.map(function(object){
            return object.getCorners();
        },this).map(function(corners,i){
            return this.measureForce(corners,i);
        },this).map(function(force,i){
            return this.objects[i].getNextLocation(force, distance);
        },this)
    }

    //adds an object
    addObject(object){
        this.objects.push(object);
    }
   
    //removes object at index i
    removeObject(i){
        this.objects.splice(i,1);
    }
    
    //finds the forces acting on an object given the location of it's corners
    measureForce(corners, obj){
        corners.forEach(function(corner,i,a){
             var potential = this.background.getPotential(corner[0],corner[1]);
             this.objects.forEach(function(object,j){
                if(j!=obj){
                    potential = potential + object.getPotential(corner[0],corner[1], this.w*this.h);
                };
             },this);
             a[i] = potential;
        },this);
        return {fx: 0.5*(corners[0] + corners[3]) - 0.5*(corners[1] + corners[2]),
            fy: 0.5*(corners[0] + corners[1]) - 0.5*(corners[2] + corners[3])
        }
    }
	
}