import { z } from "zod";

// Kayıt şeması
export const RegisterSchema = z.object({
    email: z.string()
        .email({ message: "Geçerli bir e-posta adresi giriniz." }),
    password: z.string()
        .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
        .max(50, { message: "Şifre çok uzun." }),
});

// Profil güncelleme şeması
export const ProfileUpdateSchema = z.object({
    username: z.string()
        .min(3, { message: "Kullanıcı adı en az 3 karakter olmalıdır." })
        .regex(/^[a-zA-Z0-9_-]+$/, { message: "Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir." })
        .optional(),
    phone: z.string()
        .regex(/^\+?[0-9\s-]{10,20}$/, { message: "Geçerli bir telefon numarası giriniz." })
        .optional()
        .or(z.literal("")),
    themeColor: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Geçerli bir HEX renk kodu giriniz." })
        .optional(),
    slogan: z.string().max(100, "Slogan 100 karakteri geçemez.").optional(),
    bio: z.string().max(500, "Biyografi 500 karakteri geçemez.").optional(),
});

// Ürün ekleme şeması
export const ProductSchema = z.object({
    name: z.string().min(2, "Ürün adı zorunludur.").max(100),
    price: z.number().min(0, "Fiyat 0'dan küçük olamaz.").or(z.string().regex(/^\d+(\.\d+)?$/).transform(Number)),
    description: z.string().max(300).optional(),
    link: z.string().url("Geçerli bir URL giriniz.").optional().or(z.literal("")),
});
