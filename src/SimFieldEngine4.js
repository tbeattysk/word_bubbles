'use strict';
class SimEngine{
	constructor(width, height){
        this.w = width;
        this.h = height;
		this.background = new FieldBackground(width,height);
        this.objects = new Array;
        this.objectBeingHeld = false;
        this.objFieldX=[];//for force in x call objForce[x][y] for force in y call [y][x]
        this.objFieldY=[];
        this.range=0.4;
        this.setField();
	}
    setField(){
        this.objFieldX=[];  
        this.objFieldY=[];      
		for(let i=0; i<this.range*this.w; i++){
            this.objFieldX.push(new Array);
            this.objFieldY.push(new Array);
			for(let j=0; j<this.range*this.h; j++){
                //d/dx(1/sqrt(x^2+y^2))
				this.objFieldX[i][j]=1000*(i+1)*(i+1)*(i+1)/(Math.pow(((i+1)*(i+1)+(j+1)*(j+1)),3/2));
				this.objFieldY[i][j]=1000*(j+1)*(j+1)*(j+1)/(Math.pow(((i+1)*(i+1)+(j+1)*(j+1)),3/2));
			}
		}
    }

    resize(w,h){
        this.w=w;
        this.h=h;  
        this.background.resize(w,h);
        this.setField();
        this.objects.forEach((object)=>{
            object.fieldX=this.objFieldX;
            object.fieldY=this.objFieldY;
        })
       
    }
    //returns the next location of the objects
    getNextFrame(distance, mouseX, mouseY, mouseDown){
       // console.log(this.isAnyObjectHeld());
        this.objectBeingHeld = this.isAnyObjectHeld();
        this.objects.map(object => object.getCenter()) //get the corners for each object
            .map((centers,i) => this.measureForceField(centers,i)) // from the 4 corners get the force acting on each object (fx,fy)
            .map((force,i) => this.objects[i].getNextLocation(force, distance, mouseX, mouseY, mouseDown, this.objectBeingHeld));//get the next location of each object based on this force
    }

    isAnyObjectHeld(){
        this.objects.forEach(object=>{
            if(object.held){
                return true;
            }else return false;
        });
    }
    //adds an object
    addObject(object){
        this.objects.push(object);
    }
   
    //removes object at index i
    removeObject(i){
        this.objects.splice(i,1);
    }
    
    measureForceField(center, obj){
        let force = this.background.getField(center);
        //console.log(force);
        this.objects.forEach((object,i)=>{
           if(i!=obj){
                let objForce = object.getField(center);
                force[0] = force[0] + objForce[0]
                force[1] = force [1] + objForce[1]
            };
        })
        //console.log(force);
        return force;
    }
}