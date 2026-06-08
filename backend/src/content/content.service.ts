import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  SEED_CAREERS,
  SEED_PORTFOLIO,
  SEED_POSTS,
  SEED_SERVICES,
  SEED_TEAM,
  SEED_TESTIMONIALS,
  SEED_USERS,
} from "../common/seed";
import { Collection, MODEL_NAMES } from "./schemas/content-item.schema";

type Record_ = Record<string, unknown>;

@Injectable()
export class ContentService implements OnModuleInit {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectModel(MODEL_NAMES.services) private readonly services: Model<Record_>,
    @InjectModel(MODEL_NAMES.portfolio) private readonly portfolio: Model<Record_>,
    @InjectModel(MODEL_NAMES.posts) private readonly posts: Model<Record_>,
    @InjectModel(MODEL_NAMES.team) private readonly team: Model<Record_>,
    @InjectModel(MODEL_NAMES.testimonials) private readonly testimonials: Model<Record_>,
    @InjectModel(MODEL_NAMES.careers) private readonly careers: Model<Record_>,
    @InjectModel(MODEL_NAMES.users) private readonly users: Model<Record_>,
  ) {}

  async onModuleInit(): Promise<void> {
    await Promise.all([
      this.seedIfEmpty("services", normalizeServices(SEED_SERVICES)),
      this.seedIfEmpty("portfolio", SEED_PORTFOLIO as unknown as Record_[]),
      this.seedIfEmpty("posts", SEED_POSTS as unknown as Record_[]),
      this.seedIfEmpty("team", normalizeTeam(SEED_TEAM)),
      this.seedIfEmpty("testimonials", SEED_TESTIMONIALS as unknown as Record_[]),
      this.seedIfEmpty("careers", SEED_CAREERS as unknown as Record_[]),
      this.seedIfEmpty("users", SEED_USERS as unknown as Record_[]),
    ]);
    // Backfills add seed-defined fields that pre-existing Mongo docs
    // didn't have when they were first inserted (e.g. image/summary/body
    // added later). Never overwrites a field the admin has filled in.
    await this.backfillFromSeed("portfolio", SEED_PORTFOLIO as unknown as Record_[]);
    await this.backfillFromSeed("posts", SEED_POSTS as unknown as Record_[]);
  }

  /**
   * For every Mongo doc in `c`, copy any seed-defined field that the doc
   * is currently missing (undefined / null / empty string). Matches by
   * `id`. Existing non-empty values are preserved.
   *
   * Cheap to keep around — once everything is filled in, subsequent boots
   * do a single read and zero writes.
   */
  private async backfillFromSeed(c: Collection, seed: Record_[]): Promise<void> {
    const m = this.model(c);
    const seedById = new Map(seed.map((s) => [s.id as string, s]));
    const items = await m.find().lean();
    const ops: Array<{ updateOne: { filter: Record_; update: Record_ } }> = [];
    let fieldsAdded = 0;
    for (const item of items) {
      const seedDoc = seedById.get(item.id as string);
      if (!seedDoc) continue;
      const additions: Record_ = {};
      for (const [k, v] of Object.entries(seedDoc)) {
        const cur = (item as Record_)[k];
        if (cur === undefined || cur === null || cur === "") {
          additions[k] = v;
        }
      }
      const keys = Object.keys(additions);
      if (keys.length > 0) {
        ops.push({
          updateOne: { filter: { id: item.id }, update: { $set: additions } },
        });
        fieldsAdded += keys.length;
      }
    }
    if (ops.length > 0) {
      await m.bulkWrite(ops);
      this.logger.log(
        `Backfilled ${fieldsAdded} field(s) across ${ops.length} ${c} item(s)`,
      );
    }
  }

  private model(c: Collection): Model<Record_> {
    switch (c) {
      case "services":     return this.services;
      case "portfolio":    return this.portfolio;
      case "posts":        return this.posts;
      case "team":         return this.team;
      case "testimonials": return this.testimonials;
      case "careers":      return this.careers;
      case "users":        return this.users;
    }
  }

  private async seedIfEmpty(c: Collection, docs: Record_[]): Promise<void> {
    const m = this.model(c);
    const count = await m.estimatedDocumentCount();
    if (count === 0 && docs.length) {
      await m.insertMany(docs);
      this.logger.log(`Seeded ${docs.length} ${c}`);
    }
  }

  async list(c: Collection): Promise<Record_[]> {
    return this.model(c).find().sort({ createdAt: 1 }).select({ _id: 0, __v: 0, passwordHash: 0 }).lean();
  }

  async get(c: Collection, id: string): Promise<Record_> {
    // For services, `num` is the natural ID; allow lookup by either field.
    const m = this.model(c);
    const item = await m.findOne({ $or: [{ id }, { num: id }] }).select({ _id: 0, __v: 0, passwordHash: 0 }).lean();
    if (!item) throw new NotFoundException(`${c}/${id} not found`);
    return item;
  }

  async create(c: Collection, payload: Record_): Promise<Record_> {
    const id = (payload.id as string) ?? `${c.slice(0, 3)}-${Date.now()}`;
    const doc = await this.model(c).create({ ...payload, id });
    return doc.toJSON() as Record_;
  }

  async update(c: Collection, id: string, patch: Record_): Promise<Record_> {
    const updated = await this.model(c)
      .findOneAndUpdate({ id }, { $set: patch }, { new: true })
      .select({ _id: 0, __v: 0, passwordHash: 0 }).lean();
    if (!updated) throw new NotFoundException(`${c}/${id} not found`);
    return updated;
  }

  async remove(c: Collection, id: string): Promise<void> {
    const res = await this.model(c).deleteOne({ id });
    if (res.deletedCount === 0) throw new NotFoundException(`${c}/${id} not found`);
  }
}

// Services use `num` ("01", "02"...) as their natural key — mirror to `id`.
function normalizeServices(items: typeof SEED_SERVICES): Record_[] {
  return items.map((s) => ({ ...s, id: s.num })) as Record_[];
}

// Team members don't have explicit IDs in the seed — derive a slug from name.
function normalizeTeam(items: typeof SEED_TEAM): Record_[] {
  return items.map((t) => ({
    ...t,
    id: `team-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  })) as Record_[];
}
