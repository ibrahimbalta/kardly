export function generateVCard(profile: any) {
    const phone = (profile.socialLinks as any[])?.find((l: any) => l.platform === 'phone')?.url || profile.phone || ""
    const email = profile.user.email || ""

    const vCard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${profile.user.name}`,
        `N:${profile.user.name.split(" ").reverse().join(";")}`,
        `TITLE:${profile.occupation || ""}`,
        `ORG:${profile.user.name}`,
        `TEL;TYPE=CELL:${phone}`,
        `EMAIL:${email}`,
        `URL:${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${profile.username}`,
        `NOTE:${profile.bio || profile.slogan || ""}`,
        "END:VCARD"
    ].join("\n")

    return vCard
}
