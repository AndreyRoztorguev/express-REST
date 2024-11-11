import jwt from "jsonwebtoken";
import { globalConfig } from "./config/config.js";

function checkPasswordStrength(password) {
  const strengthRegex = /^(?=.*[A-Za-z])[A-Za-z\d@$!%*#?&]{6,}$/; // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
  return strengthRegex.test(password);
}

function generateToken(data) {
  return jwt.sign(
    {
      data: data,
    },
    globalConfig.server.JWT_SECRET,
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
    const decoded = jwt.verify(accessToken, globalConfig.server.JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

function getKeyValue(object) {
  if (!isObject(object)) return undefined;
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];
      if (!isObject(value)) {
        console.log(`\x1b[32mEnvironment variable ${key}: \x1b[34m${value}\x1b[0m\x1b[0m`);
      }
      getKeyValue(value);
    }
  }
}

export { checkPasswordStrength, requireAuthentication, generateToken, isObject, getKeyValue };
