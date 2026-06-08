import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SEED_APPLICATIONS } from "../common/seed";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { Application, ApplicationDocument } from "./schemas/application.schema";

@Injectable()
export class ApplicationsService implements OnModuleInit {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private readonly model: Model<ApplicationDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.model.estimatedDocumentCount();
    if (count === 0) {
      await this.model.insertMany(SEED_APPLICATIONS);
      this.logger.log(`Seeded ${SEED_APPLICATIONS.length} applications`);
    }
  }

  async list(): Promise<Application[]> {
    return this.model.find().sort({ date: -1 }).select({ _id: 0, __v: 0 }).lean();
  }

  async get(id: string): Promise<Application> {
    const a = await this.model.findOne({ id }).select({ _id: 0, __v: 0 }).lean();
    if (!a) throw new NotFoundException(`Application ${id} not found`);
    return a;
  }

  async create(dto: CreateApplicationDto): Promise<Application> {
    const id = await this.nextId();
    const app = {
      id,
      candidate: dto.candidate,
      email: dto.email,
      role: dto.roleId,
      stage: "New" as const,
      score: 0,
      date: new Date().toISOString().slice(0, 10),
      source: dto.source ?? "Careers page",
    } satisfies Partial<Application>;
    const doc = await this.model.create(app);
    return doc.toJSON() as unknown as Application;
  }

  async update(id: string, patch: UpdateApplicationDto): Promise<Application> {
    const updated = await this.model
      .findOneAndUpdate({ id }, { $set: patch }, { new: true })
      .select({ _id: 0, __v: 0 }).lean();
    if (!updated) throw new NotFoundException(`Application ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.model.deleteOne({ id });
    if (res.deletedCount === 0) throw new NotFoundException(`Application ${id} not found`);
  }

  private async nextId(): Promise<string> {
    const latest = await this.model
      .findOne({ id: /^APP-/ })
      .sort({ id: -1 })
      .select({ id: 1 })
      .lean();
    const lastNum = latest ? parseInt(latest.id.replace(/^APP-/, ""), 10) : 1042;
    return `APP-${lastNum + 1}`;
  }
}
