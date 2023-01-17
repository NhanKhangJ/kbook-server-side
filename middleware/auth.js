import jwt from 'jsonwebtoken';


const auth = async(req,res,next) =>{
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        // console.log({token}) 
        const isCustomAuth = token?.length < 500;

        let decodedData;
       
        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            // jwt.verify going to give us the data from each specific the token, {username, Id} // in this app we have email and he id

            req.userId = decodedData?.id
            //store the userid in req.userId and use it in the next action
            // console.log(decodedData) 
        } else {
            decodedData = jwt.decode(token); //this one is for google authentication
            req.userId = decodedData?.sub; // is google's name for a specific Id that differemtiates every single google user
        }
        next();
    } catch (error) {
        console.log(error)
    }
}

export default auth