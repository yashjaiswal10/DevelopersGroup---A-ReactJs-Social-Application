const Validator=require("validator");
const isEmpty=require ("./is-empty");


module.exports=function validateRegisterInput(data){
    let errors={};



    data.name=!isEmpty(data.name)?data.name:'';
    data.email=!isEmpty(data.email)?data.email:'';
    data.password=!isEmpty(data.password)?data.password:'';
    data.password2=!isEmpty(data.password2)?data.password2:'';





    if(!Validator.isLength(data.name,{min:2,max:30})){
        errors.name="Name must be between 2 and 30 characters";

    }
   

 if(Validator.isEmpty(data.name)){
     errors.name="Name is required";
 }

if(!Validator.isEmail(data.email)){
    errors.email="email is invalid";
}
if(Validator.isEmpty(data.email)){
    errors.email="email is required";
}
if(!Validator.isLength(data.password,{min:6,max:30})){
    errors.password="password must be atleast 6 characters";
} 

if(Validator.isEmpty(data.password)){
    errors.password="password is required";
}


if(!Validator.equals(data.password,data.password2)){
    errors.password2="passwords must match";
}
if(Validator.isEmpty(data.password2)){
    errors.password2="Confirm password is required";
}


console.log("hello"+isEmpty(errors));

    return{
        errors,
        // if(errors==undefined)

        isValid:isEmpty(errors)
    }
}