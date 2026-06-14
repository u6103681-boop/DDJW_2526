import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
        groupSize: 2,
        difficulty: 'normal'
    } 

    var pairs = $('#pairs');
    var groupSize = $('#groupSize');
    var difficulty = $('#dif');
    
    var savedOptions = localStorage.options && JSON.parse(localStorage.options);
    var options = Object.create(default_options);

    if (savedOptions){
        if (savedOptions.pairs) options.pairs = savedOptions.pairs;
        if (savedOptions.groupSize) options.groupSize = savedOptions.groupSize;
        if (savedOptions.difficulty) options.difficulty = savedOptions.difficulty;
    }

    pairs.val(options.pairs);
    groupSize.val(options.groupSize);
    difficulty.val(options.difficulty);

    pairs.on('change', () => options.pairs = pairs.val());
    groupSize.on('change', () => options.groupSize = groupSize.val());
    difficulty.on('change', () => options.difficulty = difficulty.val());

    return {
        applyChanges: function(){
            localStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.groupSize = default_options.groupSize;
            options.difficulty = default_options.difficulty;
            
            pairs.val(options.pairs);
            groupSize.val(options.groupSize);
            difficulty.val(options.difficulty);
        }
    }
}();

$('#default').on('click', function(){
    options.defaultValues();
})

$('#apply').on('click', function(){
    options.applyChanges();
    location.assign("../");
});
