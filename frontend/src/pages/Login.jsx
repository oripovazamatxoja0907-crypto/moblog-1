import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { z } from "zod";
import { toast } from "sonner";
import { loginUser } from "../api/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Email noto'g'ri formatda"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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

    const result = loginSchema.safeParse(form);
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
      const data = await loginUser(result.data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin?.(data.user);
      toast.success(`Xush kelibsiz, ${data.user.ism}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kirish</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Parolingiz"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Kirilmoqda..." : "Kirish"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Akkountingiz yo'qmi?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Ro'yxatdan o'tish
        </Link>
      </p>
    </div>
  );
}

export default Login;
