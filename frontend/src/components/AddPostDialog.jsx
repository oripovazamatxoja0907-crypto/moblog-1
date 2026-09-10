import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { createPost } from "../api/posts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Sarlavha kamida 3 ta belgidan iborat bo'lishi kerak"),
  content: z
    .string()
    .min(10, "Matn kamida 10 ta belgidan iborat bo'lishi kerak"),
  authorId: z.number().int().positive("Muallifni tanlang"),
});

function AddPostDialog({ talabalar = [], onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", authorId: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleAuthorChange = (value) => {
    setForm({ ...form, authorId: value });
    if (errors.authorId) {
      setErrors({ ...errors, authorId: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const parsed = {
      ...form,
      authorId: form.authorId ? Number(form.authorId) : undefined,
    };

    const result = postSchema.safeParse(parsed);
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
      await createPost(result.data);
      toast.success("Post muvaffaqiyatli qo'shildi");
      setForm({ title: "", content: "", authorId: "" });
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
      <DialogTrigger render={<Button>+ Post qo'shish</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi post yaratish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Sarlavha</Label>
            <Input
              id="title"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="Post sarlavhasi"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Matn</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={handleChange("content")}
              placeholder="Post matni"
              rows={4}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div>
            <Label>Muallif</Label>
            <Select value={form.authorId} onValueChange={handleAuthorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Talabani tanlang" />
              </SelectTrigger>
              <SelectContent>
                {talabalar.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.ism}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.authorId && (
              <p className="text-red-500 text-sm mt-1">{errors.authorId}</p>
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

export default AddPostDialog;
