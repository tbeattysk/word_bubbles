"use strict";
list1 = [a,b,c,d];
list2 = [e,f,g,h];

function pairs(list1 = [], list2 = [], day){
    let result = [];
    for(let i = 0; i < day; i++){
        const from1to2 = list1.pop();
        const from2to1 = list2.splice(0,1,from1to2);
        list1.unshift(from2to1);
    }
    for(let i = 0; i<list1.length; i++){
        result.push([list1[i], list2[i]])
    }
    console.log(result)
}
pairs(list1,list2,1);

// Given two lists and the rotation number output array of pairs