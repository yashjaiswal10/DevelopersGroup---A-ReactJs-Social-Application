const Validator=require("validator");
const isEmpty=require ("./is-empty");


module.exports=function validateLoginInput(data){
    let errors={};



    data.name=!isEmpty(data.name)?data.name:'';
    data.email=!isEmpty(data.email)?data.email:'';
    data.password=!isEmpty(data.password)?data.password:'';





if(!Validator.isEmail(data.email)){
    errors.email="email is invalid";
}
if(Validator.isEmpty(data.email)){
    errors.email="email is required";
}


if(Validator.isEmpty(data.password)){
    errors.password="password is required";
}




console.log("hello"+isEmpty(errors));

    return{
        errors,
        // if(errors==undefined)

        isValid:isEmpty(errors)
    }
}