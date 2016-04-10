'use strict'
class SimController{
	constructor(){
		this.engine = new SimEngine();
	}
	
	getEngine(){
		return "Engine is running!";
	}
}