const usermodel=require('../model/userschema')

const auth= async(req,res,next)=>{
    try{
        if (!req.session.user){
return res.json({success:false,message:"please login and try again later"})
        }

        const regauth=await usermodel.findOne({email:req.session.user.email})
        if(!regauth){
            return res.json({success:false,message:"user not found"})
        }
        next();
    }

    catch(err){
        console.log("error in the auth backend",err)
    }
}
 module.exports=auth