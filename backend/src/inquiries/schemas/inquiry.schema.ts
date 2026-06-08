import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type InquiryStatus = "New" | "In review" | "Replied" | "Won" | "Closed";
export type InquiryPriority = "Low" | "Medium" | "High" | "Critical";

export type InquiryDocument = HydratedDocument<Inquiry>;

@Schema({
  collection: "inquiries",
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      delete (ret as Record<string, unknown>)._id;
      return ret;
    },
  },
})
export class Inquiry {
  @Prop({ required: true, unique: true, index: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  company!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ required: true })
  budget!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, default: "New" })
  status!: InquiryStatus;

  @Prop({ required: true, default: "Medium" })
  priority!: InquiryPriority;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
