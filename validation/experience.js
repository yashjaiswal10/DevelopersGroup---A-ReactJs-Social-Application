const Validator=require("validator");
const isEmpty=require ("./is-empty");


module.exports=function validateExperienceInput(data){
    let errors={};



    data.title=!isEmpty(data.title)?data.title:'';
    data.company=!isEmpty(data.company)?data.company:'';
    data.from=!isEmpty(data.from)?data.from:'';





if(Validator.isEmpty(data.title)){
    errors.title="title field is required";
}


if(Validator.isEmpty(data.company)){
    errors.company="company field is required";
}

if(Validator.isEmpty(data.from)){
    errors.from="from field  is required";
}



console.log("hello"+isEmpty(errors));

    return{
        errors,
        // if(errors==undefined)

        isValid:isEmpty(errors)
    }
}