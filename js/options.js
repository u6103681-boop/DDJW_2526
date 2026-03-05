import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var pairs = $('#pairs');
var difficulty = $('#dif');

pairs.on('change', function (){
    console.log(pairs.val());
});

difficulty.on('change', function (){
    console.log(difficulty.val());
});