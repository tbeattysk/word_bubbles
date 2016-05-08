 (function () {
  'use strict';

	describe('Simulation controller', function () {
		//need some sort of ficture to test the canvas
		// it('should be able to initiate an engine for a canvas element', function(){
		// 	var controle = new SimController();

		// 	expect(controle.getEngine()).toBe("Engine is running!");
		// });
		// it('should add object to engine', function(){
		// 	var controle = new SimController();

		// 	controle.addObject();
		// })

	});

	describe('Simulation engine', function(){
		var engine;
		beforeEach(function(){
			engine = new SimEngine(100,100)
		})
		it('should have a background field for the boundary conditions', function(){
			expect(engine.background.getPotential(50,50)).toBe(0);
		});
		it('should be able to add and remove objects', function(){
			engine.addObject(new FieldObject(50,50,1,0,5,5));
			expect(engine.objects[0].getPotential(10,10,10000)).toBeGreaterThan(0);
			engine.removeObject(0);
			expect(engine.objects[0]).toBeUndefined();
		});
		it('should be able to calculate the x and y forces on an object given four corners on a potential plane', function(){
			engine.addObject(new FieldObject(41,66,1,0,5,5));
			engine.addObject(new FieldObject(41,50,0,1,5,5));
			var force = engine.measureForce(engine.objects[0].getCorners(),0);
			expect(force.fx).toBeTruthy();
			expect(force.fy).toBeTruthy();
			//engine.update();
		});

	});
	describe('Field Background', function(){
		var background;
		beforeEach(function(){
			background = new FieldBackground(100,100);
		});
		it('should return a number for the field potential',function(){	
			expect(background.getPotential(10,10)).toBeGreaterThan(0);
		});
		// collision detection isn't necessary yet
		// it('should return undefined for the field potential outside of backgound area',function(){
		// 	expect(background.getPotential(0,0,10000)).toBeUndefined();
		// });
		it('should return zero for the field potential at center',function(){
			expect(background.getPotential(50,50)).toBe(0);
		});
		it('should get and set width and height of background', function(){
			background.h=80;
			expect(background.h).toBe(80);
			background.w=80;
			expect(background.w).toBe(80);
		});
	});
	describe('Field Item', function(){
		var object;
		beforeEach(function(){
			object = new FieldObject(50,50,1,0,5,5);
		});
		it('should return a number for the field potential',function(){	
			expect(object.getPotential(45,45,10000)).toBeGreaterThan(0);
		});
		// collision detection isn't necessary yet
		// it('should return undefined for the field potential inside the shape',function(){
		// 	expect(object.getPotential(52,52,10000)).toBeUndefined();
		// });
		it('should return the four corners that will allow the force vector to be calculated', function(){
			//Order of points should be top left, top right, bottom right, bottom left
			expect(object.getCorners()).toEqual([[50-2.5, 50-2.5],[50+2.5, 50-2.5],[50+2.5, 50+2.5],[50-2.5, 50+2.5]])
		});
		it('should calculate its future posisition based on a force input', function(){
			object.getNextLocation({fx:0,fy:1}, 5);
			expect(object.nextX).toBeGreaterThan(50);
			expect(object.nextY).toBeGreaterThan(50);
		});
	});
})();
