const Validator=require("validator");
const isEmpty=require ("./is-empty");


module.exports=function validatePostInput(data){
    let errors={};



    data.text=!isEmpty(data.text)?data.text:'';
    

    if(!Validator.isLength(data.text,{min:10,max:300})){
        errors.text="text must be between 10 and 300 characters";

    }
   


if(Validator.isEmpty(data.text)){
    errors.text="text field is required";
}







console.log("hello"+isEmpty(errors));

    return{
        errors,
        // if(errors==undefined)

        isValid:isEmpty(errors)
    }
}