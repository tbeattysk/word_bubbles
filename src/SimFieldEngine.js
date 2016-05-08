class SimEngine{
	constructor(width, height){
        this.w = width;
        this.h = height;
		this.background = new FieldBackground(width,height);
        this.objects = new Array;
        this.objectBeingHeld = false;
	}
    
    //returns the next location of the objects
    getNextFrame(distance, mouseX, mouseY, mouseDown){
       // console.log(this.isAnyObjectHeld());
        this.objectBeingHeld = this.isAnyObjectHeld();

        return this.objects.map(function(object){
            return object.getCorners();
        },this).map(function(corners,i){
            return this.measureForce(corners,i);
        },this).map(function(force,i){
            return this.objects[i].getNextLocation(force, distance, mouseX, mouseY, mouseDown, this.objectBeingHeld);
        },this)

    }

    isAnyObjectHeld(){
        var held = false
        this.objects.forEach(function(object, obj){
            if(object.held){
                held = true
            }
        })
        return held;
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
        return {fx: (corners[0] + corners[3])/this.objects[obj].w - (corners[1] + corners[2])/this.objects[obj].w,
            fy: (corners[0] + corners[1])/this.objects[obj].h - (corners[2] + corners[3])/this.objects[obj].h
        }
    }
	
}