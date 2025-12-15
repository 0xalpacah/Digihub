import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { generateImage } from "../_core/imageGeneration";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

/**
 * Blog Images Router
 * Handles AI-powered image generation for blog post covers
 */
export const blogImagesRouter = router({
  /**
   * Generate a cover image for a blog post
   * Uses AI image generation with cyberpunk aesthetic
   */
  generateCover: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(200),
        category: z.string().min(3).max(50),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create a cyberpunk-themed prompt for the image
        const prompt = generateCyberpunkPrompt(input.title, input.category, input.description);

        // Generate the image using AI
        const { url: imageUrl } = await generateImage({
          prompt,
        });

        // Upload to S3
        const fileKey = `blog-covers/${ctx.user.id}/${nanoid()}.jpg`;
        const { url: s3Url } = await storagePut(fileKey, imageUrl || "", "image/jpeg");

        return {
          success: true,
          imageUrl: s3Url,
          fileKey,
          generatedAt: new Date(),
        };
      } catch (error) {
        console.error("Error generating cover image:", error);
        return {
          success: false,
          error: "Failed to generate cover image",
        };
      }
    }),

  /**
   * Generate multiple cover image variations
   */
  generateCoverVariations: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(200),
        category: z.string().min(3).max(50),
        description: z.string().optional(),
        count: z.number().int().min(1).max(3).default(2),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const variations = [];

        for (let i = 0; i < input.count; i++) {
          const prompt = generateCyberpunkPrompt(
            input.title,
            input.category,
            input.description,
            i
          );

          const { url: imageUrl } = await generateImage({
            prompt,
          });

          const fileKey = `blog-covers/${ctx.user.id}/${nanoid()}.jpg`;
          const { url: s3Url } = await storagePut(fileKey, imageUrl || "", "image/jpeg");

          variations.push({
            imageUrl: s3Url,
            fileKey,
            prompt,
          });
        }

        return {
          success: true,
          variations,
          generatedAt: new Date(),
        };
      } catch (error) {
        console.error("Error generating cover variations:", error);
        return {
          success: false,
          error: "Failed to generate cover variations",
        };
      }
    }),

  /**
   * Regenerate a cover image with a different style
   */
  regenerateCover: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5).max(200),
        category: z.string().min(3).max(50),
        description: z.string().optional(),
        style: z.enum(["cyberpunk", "neon", "glitch", "tech"]).default("cyberpunk"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const prompt = generateStyledCyberpunkPrompt(
          input.title,
          input.category,
          input.description,
          input.style
        );

        const { url: imageUrl } = await generateImage({
          prompt,
        });

        const fileKey = `blog-covers/${ctx.user.id}/${nanoid()}.jpg`;
        const { url: s3Url } = await storagePut(fileKey, imageUrl || "", "image/jpeg");

        return {
          success: true,
          imageUrl: s3Url,
          fileKey,
          style: input.style,
          generatedAt: new Date(),
        };
      } catch (error) {
        console.error("Error regenerating cover image:", error);
        return {
          success: false,
          error: "Failed to regenerate cover image",
        };
      }
    }),
});

/**
 * Generate a cyberpunk-themed prompt for image generation
 */
function generateCyberpunkPrompt(
  title: string,
  category: string,
  description?: string,
  variation: number = 0
): string {
  const cyberpunkElements = [
    "neon cyan and magenta glitch art",
    "high-tech cyberpunk aesthetic",
    "digital aberration and RGB shift",
    "futuristic terminal interface",
    "retro-futuristic neon glow",
  ];

  const categoryThemes: Record<string, string> = {
    announcement: "breaking news hologram, digital explosion",
    tutorial: "code terminal, digital blueprint, tech schematic",
    discussion: "chat bubbles, network nodes, interconnected nodes",
    news: "newspaper hologram, digital headlines, breaking news",
    project: "3D geometric shapes, tech innovation, futuristic design",
  };

  const theme = categoryThemes[category.toLowerCase()] || "digital technology";
  const element = cyberpunkElements[variation % cyberpunkElements.length];

  const basePrompt = `
    ${element}, 
    Arc Network blockchain theme,
    ${theme},
    Title: "${title}",
    ${description ? `Description: "${description}",` : ""}
    Dark background with cyan and magenta neon accents,
    High contrast, sharp details,
    Professional blog cover art,
    1920x1080 resolution,
    Cyberpunk 2077 inspired aesthetic,
    Digital glitch effects,
    Holographic elements,
    Tech-forward design
  `;

  return basePrompt.replace(/\s+/g, " ").trim();
}

/**
 * Generate a styled cyberpunk prompt
 */
function generateStyledCyberpunkPrompt(
  title: string,
  category: string,
  description: string | undefined,
  style: "cyberpunk" | "neon" | "glitch" | "tech"
): string {
  const stylePrompts: Record<string, string> = {
    cyberpunk:
      "cyberpunk 2077 aesthetic, neon city, digital rain, high-tech",
    neon: "neon lights, glowing signs, retro-futuristic, bright colors",
    glitch:
      "digital glitch art, RGB aberration, pixel displacement, corrupted data",
    tech: "technical blueprint, circuit board, digital schematic, clean tech design",
  };

  const styleDescription = stylePrompts[style];

  return `
    ${styleDescription},
    Arc Network blockchain,
    Title: "${title}",
    Category: ${category},
    ${description ? `"${description}"` : ""}
    Professional blog cover,
    1920x1080 resolution,
    High quality, detailed, sharp focus
  `
    .replace(/\s+/g, " ")
    .trim();
}
