import QRCode from "qrcode"

export async function generateQRCode(url: string) {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: {
                dark: "#0f172a",
                light: "#ffffff"
            }
        })
        return qrCodeDataUrl
    } catch (err) {
        console.error(err)
        return null
    }
}
