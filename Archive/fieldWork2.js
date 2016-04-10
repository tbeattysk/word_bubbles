Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i++) {
        a = [];
        for (j = 0; j < n; j++) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
}

	var paper;
window.onload = function(){
	paper = Raphael("container",1000,600);
	newField = Field(BackgroundField(1000,600,0.000001));
	document.getElementById("clickme").onclick = addNewTextItem;

}
function addNewTextItem(){
	var desiredText=document.getElementById('nameme').value;
	if(desiredText!==""){
		newField.addItem(desiredText);
	}
	document.getElementById('nameme').value="";
}
function BackgroundField(w,h,c){
		base = paper.rect(0,0,w,h);
	var backgroundFieldAPI={
		getPotential:getPotential,
		update:backgroundUpdate,
		getC: function(){return c},
		getH: function(){return h},
		getW: function(){return w}
	}
	function getPotential(absX,absY){
		var fromCx = absX-w/2;
		var fromCy = absY-h/2;
		return 0.001*(fromCx*fromCx+fromCy*fromCy)
	}
	return backgroundFieldAPI;
}
function backgroundUpdate() {
		base.animate({stroke:"000"},0,newField.start);
}
function Field(backgroundField){
	var fieldAPI={
		start:update,
		addItem: addItem,
		//getItem: getItem
		removeItem: removeItem
	}
	var w = backgroundField.getW(), h = backgroundField.getH();
	var spreadX = w, spreadY = h, delay=200;
	var item = [];
	
	function addItem(text){
		var newItem=Item(Math.round(w*Math.random()),
			Math.round(h*Math.random()),[Math.random(),Math.random()],1,text);
		newItem.setup(1);
		item.push(newItem);
		if(item.length==1){
			update();
		}
	}
	/*function addItem(x,y,c,type){
		var newItem=Item(x,y,c);
		newItem.setup(type);
		item.push(newItem);	
		
	}*/
	function removeItem(container){
		for (var i = item.length-1; i >= 0 ; i--) {
			if(item[i].container()===container){
				item[i].container().remove();
				item.splice(i,1);
				if(i==0){update(); //when the first object is deleted need to keep animation running
				}
			}
		}
	}
	function getItme(itemNum){
		return item[i].container();
	}
	function update() {
		for (var i = 0; i < item.length ; i++) {
				item[i].getBehavior(getPotDiff(i));
		}
		if (item.length>0){
			item[0].move();
			item[0].container().animate(item[0].motion());
			if (item.length>1){
				for (var i = 0; i < item.length ; i++) {
					item[i].move();
					item[i].container().animateWith(item[0].container(),item[0].motion(),item[i].motion());
				}
			}
			item[0].container().animate({"fill-opapcity":"1"},delay,backgroundUpdate);
		}
	}
	
	function getPotDiff(fieldItem) {
	    var x = item[fieldItem].getX(),
	        y = item[fieldItem].getY(),
	        c = item[fieldItem].getC();
	    var totalPot = [0, 0, 0, 0]; //potential at l,r,t,b
	    var d = 3; //distance from center tocorners
	    for (var j = 0; j < item.length; j++) {
	        if (j != fieldItem) {
				calcPotFrom(totalPot,item[j]);
        	}	
    	}
		calcPotFrom(totalPot,backgroundField);
		function calcPotFrom(totalPot,fieldItem){
				totalPot[0] = totalPot[0] + fieldItem.getC()*fieldItem.getPotential(x - d, y);
	            totalPot[1] = totalPot[1] + fieldItem.getC()*fieldItem.getPotential(x + d, y);
	            totalPot[2] = totalPot[2] + fieldItem.getC()*fieldItem.getPotential(x , y - d);
	            totalPot[3] = totalPot[3] + fieldItem.getC()*fieldItem.getPotential(x , y + d);
		}
		potDiff = [totalPot[0] - totalPot[1], totalPot[2] - totalPot[3]];
    	return potDiff;
    }
	
	function Item(x,y,v,c,text){
		
		var container = paper.text(x,y,text).attr({	fill:"blue","font-size":30});
		var m=3;
		var newX=x,newY=y;
		var motion;
		var itemAPI={
			getBehavior: constVel,
			getPotential: invSqPotential,
			setup: setup,
			move: move,
			motion: function(){return motion},
			container: function(){return container;},
			getX: function(){return x},
			getY: function(){return y},
			getC: function(){return c},
		};
		function setup(type){
			switch (type){
				case 1:
					container.mouseover(function(e){this.attr("fill","blue");this.toFront();setup(2)});
					itemAPI.getBehavior=constVel;	
					break;
			}
			switch (type){
				case 2:
					itemAPI.getBehavior=motionless;
					container.mouseout(function(e){this.attr("fill","orange");setup(1)})
					container.mouseup(function(e){removeItem(this)})
					break;
			}
		}
		var invSqMat = function invSqrMatrixGen() {
			var w = spreadX, h = spreadY;
			var mat = Array.matrix(w, h, 0);
			for (var i = 0; i < w / 2; i++) {
				for (var j = 0; j < h / 2; j++) {
					var r = (i + 0.5) * (i + 0.5) + (j + 0.5) * (j + 0.5);
					mat[i][j] = 1 / r;
				}
			}
		return mat;
		}()
		function invSqPotential(absX, absY) {
			var spread = [spreadX, spreadY];
			var relX = Math.abs(absX - x);
			var relY = Math.abs(absY - y);
			//only send values if it is within area of influence
			if (relX < spread[0] && relY < spread[1]) {
				return invSqMat[Math.round(relX)][Math.round(relY)];
			} else {
				return 0;
			}
		}
			

		var invSq = [0];
		for(var i=1; i<h/2;i++){
			invSq[i]= 1/(i*i);
		}
		function invSqBox(absX,absY){
			var fromCx = absX-w/2;
			var fromCy = absY-h/2;
			return (fromCx*fromCx+fromCy*fromCy) 
			/*var yPrime = h/2-Math.abs(absY-h/2);
			//console.log(absX+","+absY+"  into "+yPrime);
			if(absX<=yPrime){
			  // console.log("Zone1");
			   return invSq[absX];
			}
			else if((w-absX)<=yPrime){
			   //console.log("Zone2");
			   return invSq[w-absX];
			}
			else if(absY<=h/2){
				//console.log("Zone3");
				return invSq[absY];
			}
			else{
				//console.log("Zone4");
				return invSq[h-absY];
			}*/
		}
		

		function constVel(forceVector) {
			//TODO: when vel and force are in same direction, no perpendicular force is add.
			if(forceVector[0] + forceVector[1] != 0){
				v = vectBallance(unitVect(forceVector), v,5); //between force angle and velocity angle weighted by force strength
			}
			newX = Math.round(v[0]*m+x);
			newY = Math.round(v[1]*m+y);
			motion = Raphael.animation({x:newX, y:newY},delay);
			
			function vectMag(vect) {
				return Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1]);
			}
			function unitVect(vect) {
				var mag = vectMag(vect);
				return [vect[0] / mag, vect[1] / mag];
			}
			function vectBallance(vect1, vect2, div) {
				//console.log(vect1 + "   " +vect2);
				return unitVect([vect1[0] + vect2[0]*div, vect1[1] + vect2[1]*div]);
			}
			//console.log("Pos: "+ x +", "+y+" Vel " +v[0] +", "+v[1]);
		}
		function motionless(){
				motion = Raphael.animation({x:newX,y:newY},delay);
		}
		function move(){
			x=newX;
			y=newY;
		}
		return itemAPI;
	}
	return fieldAPI;
}
