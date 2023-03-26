export default function isAuthenticated(req, res, next) {
    if (req.session && req.session.access_token) {
        next();
    } else {
        res.status(401).send('Unauthorized: User not logged in.');
    }
}