// Mock iyzico service for Phase 2 implementation
// In production, you would use iyzico-node package

export async function createCheckoutForm(data: {
    userId: string
    planId: string
    price: number
    callbackUrl: string
}) {
    // Simulating an API call to iyzico
    console.log(`[iyzico] Creating checkout form for user ${data.userId}, plan ${data.planId}, price ₺${data.price}`)

    // Return a mock checkout URL or HTML form
    return {
        status: "success",
        paymentPageUrl: `${data.callbackUrl}?status=success&planId=${data.planId}`, // Simple mock redirect
        token: "mock_token_" + Math.random().toString(36).substr(2, 9)
    }
}

export async function retrievePaymentResult(token: string) {
    // Verify payment status with iyzico
    return {
        status: "success",
        paymentId: "mock_pay_" + Date.now()
    }
}
