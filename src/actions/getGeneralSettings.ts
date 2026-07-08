"use server";

export async function getGeneralSettings(userId: string) {
    // Talk to your DB securely here
    // Adding a fake delay so Suspense triggers visually
    await new Promise(resolve => setTimeout(resolve, 5000));
    return { id: userId, tags: ["Figma", "Design", "Logo", "Branding"] };
}