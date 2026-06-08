import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PageViewDocument = HydratedDocument<PageView>;

@Schema({
  collection: "page_views",
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      delete (ret as Record<string, unknown>)._id;
      return ret;
    },
  },
})
export class PageView {
  @Prop({ required: true, index: true })
  path!: string;

  @Prop({ default: "" })
  referrer!: string;

  // Coarse referrer bucket (e.g. "google", "github", "direct") for fast group-by.
  @Prop({ required: true, index: true, default: "direct" })
  source!: string;

  // YYYY-MM-DD bucket so we can group by day without per-doc date math.
  @Prop({ required: true, index: true })
  day!: string;

  @Prop({ default: "" })
  country!: string;

  @Prop({ default: "" })
  ua!: string;

  // Hashed visitor key (sha-256 of ip+ua+day-salt) so we can roughly de-dupe.
  @Prop({ required: true, index: true })
  visitor!: string;
}

export const PageViewSchema = SchemaFactory.createForClass(PageView);
