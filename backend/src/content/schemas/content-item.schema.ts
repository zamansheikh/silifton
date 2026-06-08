import { Schema } from "mongoose";

/**
 * Generic schema used for every content collection (services, portfolio, posts,
 * team, testimonials, careers, users). Each item carries a human-readable `id`
 * string as its primary key; arbitrary other fields are stored verbatim.
 */
export function buildContentSchema() {
  const schema = new Schema(
    {
      id: { type: String, required: true, unique: true, index: true },
    },
    {
      strict: false,
      timestamps: true,
      toJSON: {
        versionKey: false,
        transform: (_doc, ret) => {
          delete (ret as Record<string, unknown>)._id;
          return ret;
        },
      },
    },
  );
  return schema;
}

export const ContentSchema = buildContentSchema();

export type Collection =
  | "services"
  | "portfolio"
  | "posts"
  | "team"
  | "testimonials"
  | "careers"
  | "users";

export const COLLECTIONS: readonly Collection[] = [
  "services",
  "portfolio",
  "posts",
  "team",
  "testimonials",
  "careers",
  "users",
] as const;

// Mongoose model token names (one per collection).
export const MODEL_NAMES: Record<Collection, string> = {
  services: "ContentService",
  portfolio: "ContentPortfolio",
  posts: "ContentPost",
  team: "ContentTeam",
  testimonials: "ContentTestimonial",
  careers: "ContentCareer",
  users: "ContentUser",
};
