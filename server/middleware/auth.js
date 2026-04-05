const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token required." });
    }

    const token = authHeader.slice(7);

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET not set." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}

module.exports = { verifyToken };
