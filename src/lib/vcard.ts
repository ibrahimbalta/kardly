export function generateVCard(profile: any) {
    const vCard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${profile.user.name}`,
        `N:${profile.user.name.split(" ").reverse().join(";")}`,
        `TITLE:${profile.occupation}`,
        `NOTE:${profile.bio}`,
        `URL:${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${profile.username}`,
        "END:VCARD"
    ].join("\n")

    return vCard
}
