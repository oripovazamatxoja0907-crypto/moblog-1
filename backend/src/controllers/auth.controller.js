const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const register = async (req, res) => {
  try {
    const { ism, email, password } = req.body;

    const existing = await prisma.talaba.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Bu email allaqachon ro‘yxatdan o‘tgan",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.talaba.create({
      data: { ism, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.talaba.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email yoki parol noto‘g‘ri",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Email yoki parol noto‘g‘ri",
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { register, login };
