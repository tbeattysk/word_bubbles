'use strict'
class SimController{
	constructor(ctx){

		this.ctx = ctx;
		this.w = ctx.canvas.clientWidth;
		this.h = ctx.canvas.clientHeight
		this.objects = new Array;
		this.engine = new SimEngine(this.w,this.h);
	}
	
	getEngine(){
		return "Engine is running!";
	}

	addObject(){
		var x = this.w * Math.random(); //Uh Oh
		var y = this.h * Math.random();
		this.engine.addObject(new FieldObject(x,y,0,1,5,5));
		this.objects.push({x:x-2.5,y:y-2.5});
	}

	draw(){
		this.ctx.clearRect(0,0,this.w,this.h);
		this.ctx.beginPath();
		this.objects.forEach(function(object,i,a){
			this.ctx.rect(object.x, object.y, 5, 5);
		}, this);
		this.ctx.closePath();
		this.ctx.stroke();
		this.objects =  this.engine.getNextFrame(1)
	}
}