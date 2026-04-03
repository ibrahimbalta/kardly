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
    phone: z.string().optional().or(z.literal("")).nullable(),
    themeColor: z.string().optional().nullable(),
    bioColor: z.string().optional().nullable(),
    bioFontFamily: z.string().optional().nullable(),
    bioFontSize: z.string().optional().nullable(),
    sloganColor: z.string().optional().nullable(),
    sloganFontFamily: z.string().optional().nullable(),
    sloganFontSize: z.string().optional().nullable(),
    slogan: z.string().max(100, "Slogan 100 karakteri geçemez.").optional().or(z.literal("")).nullable(),
    bio: z.string().max(1500, "Biyografi 1500 karakteri geçemez.").optional().or(z.literal("")).nullable(),
    displayName: z.string().optional().or(z.literal("")).nullable(),
    image: z.string().optional().or(z.literal("")).nullable(),
    occupation: z.string().optional().or(z.literal("")).nullable(),
    cvUrl: z.string().optional().or(z.literal("")).nullable(),
    paymentLink: z.string().optional().or(z.literal("")).nullable(),
    paymentType: z.string().optional().or(z.literal("")).nullable(),
    youtubeVideoUrl: z.string().optional().or(z.literal("")).nullable(),
    templateId: z.string().optional().nullable(),
    tone: z.string().optional().nullable(),
    animationStyle: z.string().optional().nullable(),
    profileBgImage: z.string().optional().or(z.literal("")).nullable(),
    businessCardTemplateId: z.string().optional().nullable(),
    businessCardOrientation: z.string().optional().nullable(),
    qrColorDark: z.string().optional().nullable(),
    qrColorLight: z.string().optional().nullable(),
    hasAcceptedTerms: z.boolean().optional(),
    showInHub: z.boolean().optional(),
    timezone: z.string().optional().nullable(),
}).passthrough();

// Ürün ekleme şeması
export const ProductSchema = z.object({
    name: z.string().min(2, "Ürün adı zorunludur.").max(100),
    price: z.number().min(0, "Fiyat 0'dan küçük olamaz.").or(z.string().regex(/^\d+(\.\d+)?$/).transform(Number)),
    description: z.string().max(300).optional(),
    link: z.string().url("Geçerli bir URL giriniz.").optional().or(z.literal("")),
});
