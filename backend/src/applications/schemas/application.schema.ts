import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ApplicationStage =
  | "New"
  | "Tech screen"
  | "Portfolio review"
  | "Hiring manager"
  | "Onsite"
  | "Offer"
  | "Hired"
  | "Rejected";

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({
  collection: "applications",
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      delete (ret as Record<string, unknown>)._id;
      return ret;
    },
  },
})
export class Application {
  @Prop({ required: true, unique: true, index: true })
  id!: string;

  @Prop({ required: true })
  candidate!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  role!: string;

  @Prop({ required: true, default: "New" })
  stage!: ApplicationStage;

  @Prop({ required: true, default: 0 })
  score!: number;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  source!: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
