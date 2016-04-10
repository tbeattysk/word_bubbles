(function () {
  'use strict';

	describe('Simulation controller', function () {
		//rough start with a horrible test
		it('should be able to initiate an engine', function(){
			var controle = new SimController();

			expect(controle.getEngine()).toBe("Engine is running!");
		});

	});

	describe('Simulation engine', function(){
		it('should have a background field for the boundary conditions', function(){
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
		it('should return undefined for the field potential outside of backgound area',function(){
			expect(background.getPotential(0,0)).toBeUndefined();
		});
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
			object = new FieldObject(50,50,[0.1,0.1],5,5,10000);
		});
		it('should return a number for the field potential',function(){	
			expect(object.getPotential(45,45)).toBeGreaterThan(0);
		});
		it('should return undefined for the field potential inside the shape',function(){
			expect(object.getPotential(52,52)).toBeUndefined();
		})
	});
})();
