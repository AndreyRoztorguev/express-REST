import jwt from "jsonwebtoken";

function checkPasswordStrength(password) {
  const strengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return strengthRegex.test(password);
}

function generateToken(data) {
  return jwt.sign(
    {
      data: data,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function requireAuthentication(req, res, next) {
  const token = req.headers.authentication;
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  try {
    const accessToken = token.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export { checkPasswordStrength, requireAuthentication, generateToken };
