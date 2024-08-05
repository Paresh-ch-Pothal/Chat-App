const JWT=require("jsonwebtoken");
const JWT_SECRET = "^&*c#h#@!@pp%$%&&&"

const fetchuser=(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){
        return res.status(401).send("Please provide the correct token")
    }
    try {
        const data=JWT.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        return res.status(401).send("Some error has been occured");
    }
}

module.exports=fetchuser;