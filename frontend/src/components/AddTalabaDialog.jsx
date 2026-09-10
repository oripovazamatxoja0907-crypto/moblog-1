import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { createTalaba } from "../api/talabalar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const talabaSchema = z.object({
  ism: z.string().min(3, "Ism kamida 3 ta belgidan iborat bo'lishi kerak"),
  email: z.string().email("Email noto'g'ri formatda"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

function AddTalabaDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
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

    const result = talabaSchema.safeParse(form);
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
      await createTalaba(result.data);
      toast.success("Talaba muvaffaqiyatli qo'shildi");
      setForm({ ism: "", email: "", password: "" });
      setOpen(false);
      onSuccess?.();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>+ Talaba qo'shish</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi talaba qo'shish</DialogTitle>
        </DialogHeader>
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
            {loading ? "Yuborilmoqda..." : "Qo'shish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTalabaDialog;
