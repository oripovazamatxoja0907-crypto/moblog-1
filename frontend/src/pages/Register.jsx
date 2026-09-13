import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { z } from "zod";
import { toast } from "sonner";
import { registerUser } from "../api/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const registerSchema = z.object({
  ism: z.string().min(3, "Ism kamida 3 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Email noto'g'ri formatda"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ism: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await registerUser(result.data);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi kiring.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      if (err.details && err.details.length > 0) {
        const fieldErrors = {};
        err.details.forEach((d) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Ro'yxatdan o'tish
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="ism">Ism</Label>
          <Input
            id="ism"
            value={form.ism}
            onChange={handleChange("ism")}
            placeholder="Ismingiz"
          />
          {errors.ism && (
            <p className="text-red-500 text-sm mt-1">{errors.ism}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Parol</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Kamida 6 ta belgi"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Akkountingiz bormi?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  );
}

export default Register;
