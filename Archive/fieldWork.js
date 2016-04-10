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
};
var w = 200, h = 200, spreadX = 200, spreadY = 200;
var invSqrMatrix = invSqrMatrixGen(1);
//Required to work with Matices
var item = [{
    x: 20,
    y: 50,
    v: [0, 1],
    m: 3,
    c: 1,
    
    pot: invSqPotential(this.x, this.y, this.c),
    behavior: constVelocity()
}, /*{
    x: 50,
    y: 100,
    v: [0, 1],
    m: 3,
    c: 1,
    pot: invSqPotential(this.x, this.y, this.c),
    behavior: constVelocity()
},*/ 
{
    x:0,
    y:0,
    newX:0,
    newY:0,
    v:[0,0],
    m: 0,
    c:10000,
    pot: invSqBox(h, w, this.c),
    behavior: motionless()
}
    
];
for(var i=0; i<100;i++){update(item)};

function update(item) {
        console.log("Item 1: Pos: "+ item[0].x +", "+item[0].y+" Vel " +item[0].v[0] +", "+item[0].v[1]+" Item 2: Pos: "+ item[1].x +", "+item[1].y+" Vel " +item[1].v[0] +", "+item[1].v[1]);

    for (var i = 0; i < item.length; i++) {
        item[i].behavior(getPotDiff(i));
    }
    for (var i = 0; i < item.length; i++){
        item[i].x=item[i].newX;
        item[i].y=item[i].newY;
    }
}

//Field calculations for potentials.
function getPotDiff(fieldItem) {
    var x = item[fieldItem].x,
        y = item[fieldItem].x,
        c = item[fieldItem].c;
    var totalPot = [0, 0, 0, 0]; //potential at l,r,t,b
    var d = 10; //distance from center tocorners
    for (var j = 0; j < item.length; j++) {
        if (j != fieldItem) {
            totalPot[0] = totalPot[0] + item[j].c*item[j].pot(x - d, y);
            totalPot[1] = totalPot[1] + item[j].c*item[j].pot(x + d, y);
            totalPot[2] = totalPot[2] + item[j].c*item[j].pot(x , y - d);
            totalPot[3] = totalPot[3] + item[j].c*item[j].pot(x , y + d);
            console.log(totalPot + "  " + j+" for "+fieldItem)
        }
    }
    
    potDiff = [
    totalPot[1] - totalPot[0], totalPot[3] - totalPot[2]]
    return potDiff;
}

//behaviors
function constVelocity() {
    return function action(forceVector) {
        this.v = vectBallance(unitVect(forceVector), this.v,1); //between force angle and velocity angle weighted by force strength
        this.newX = Math.round(this.v[0]*this.m+this.x);
        this.newY = Math.round(this.v[1]*this.m+this.y);
    }
}
function motionless(){
    return function action(forceVector){
    }
}

//field types
function invSqPotential(x, y, c) {
    var spread = [spreadX, spreadY];
    var mat = invSqrMatrix;

    function getPotential(absX, absY) {
            var relX = Math.abs(absX - this.x);
            
            var relY = Math.abs(absY - this.y);
            //only send values if it is within area of influence
            if (relX < spread[0] && relY < spread[1]) {
                return mat[Math.round(relX)][Math.round(relY)];
            } else {
                return 0;
            }
    }
    return getPotential;
}

function invSqBox(h,w,c){
    var invSq = [0];
    for(var i=1; i<h/2;i++){
        invSq[i]= 1/(i*i);
    }
    function getPotential(absX,absY){
        yPrime = h/2-Math.abs(absY-h/2);
        if(yPrime<=absX){
           return invSq[absX];
        }
        else if(yPrime>(w-absX)){
           return invSq[w-absX];
        }
        else if(absY<=h/2){
            return invSq[absY];
        }
        else{
            return invSq[w-absY];
        }
    }
    return getPotential;
}
//vector helpers
function rad2rect(rad, mag) {
    return [mag * math.cos(rad), mag * math.sin(rad)];
}

function vect2rad(vect) {
    if (vect[0] >= 0) {
        return math.atan(vect[1] / vect[2]);
    } else if (vect[1] >= 0) {
        return math.pi + math.atan(vect[1] / vect[2]);
    } else {
        return -math.pi + math.atan(vect[1] / vect[2])
    };
}

function vectMag(vect) {
    return Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1]);
}

function unitVect(vect) {
    var mag = vectMag(vect);
    return [vect[0] / mag, vect[1] / mag];
}

function vectSum(vect1, vect2) {
    return unitVect([vect1[0] + vect2[0], vect1[1] + vect2[1]]);
}

function vectBallance(vect1, vect2, div) {
    return unitVect([vect1[0] + vect2[0], vect1[1] + vect2[1]]);
}

function invSqrMatrixGen(c) {
    var w = spreadX, h = spreadY;
    var mat = Array.matrix(w, h, 0);
    for (var i = 0; i < w / 2; i++) {
        for (var j = 0; j < h / 2; j++) {
            var r = (i + 0.5) * (i + 0.5) + (j + 0.5) * (j + 0.5);
            mat[i][j] = c / r;
        }
    }
    return mat;
}