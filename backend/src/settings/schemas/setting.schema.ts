import { Schema } from "mongoose";

/**
 * Generic key/value document for site + workspace settings.
 *   key:   "site.hero", "site.about", "workspace.general", ...
 *   value: arbitrary JSON object
 */
export const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true, default: {} },
  },
  {
    strict: false,
    timestamps: true,
    collection: "settings",
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>)._id;
        return ret;
      },
    },
  },
);
