import jwt, { decode } from 'jsonwebtoken';
//wants to like a post 
//we dont immdiately like it
//we go to auth middleware if auth middleware says ok now 
//you are allowed to move upto the next post
//then we will go with it
//wants to like a post 
//cluck the like button=>auth middleware()=>like controller

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: Token missing' });
        }

        const isCustomAuth = token.length < 500;
        let decodedData;

        if (isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        // Proceed to the next middleware or controller
        next();

    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Authentication failed: Token invalid' });
    }
}

export default auth;