import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Resend } from "resend";

import { SEED_INQUIRIES } from "../common/seed";
import { CreateInquiryDto } from "./dto/create-inquiry.dto";
import { UpdateInquiryDto } from "./dto/update-inquiry.dto";
import { Inquiry, InquiryDocument } from "./schemas/inquiry.schema";

@Injectable()
export class InquiriesService implements OnModuleInit {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectModel(Inquiry.name) private readonly model: Model<InquiryDocument>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.model.estimatedDocumentCount();
    if (count === 0) {
      await this.model.insertMany(SEED_INQUIRIES);
      this.logger.log(`Seeded ${SEED_INQUIRIES.length} inquiries`);
    }
  }

  async list(): Promise<Inquiry[]> {
    return this.model.find().sort({ date: -1 }).select({ _id: 0, __v: 0 }).lean();
  }

  async get(id: string): Promise<Inquiry> {
    const i = await this.model.findOne({ id }).select({ _id: 0, __v: 0 }).lean();
    if (!i) throw new NotFoundException(`Inquiry ${id} not found`);
    return i;
  }

  async create(dto: CreateInquiryDto): Promise<Inquiry> {
    const id = await this.nextId();
    const inquiry = {
      id,
      name: dto.name,
      company: dto.company,
      email: dto.email,
      subject: dto.subject ?? "(no subject)",
      budget: dto.budget,
      message: dto.message,
      date: new Date().toISOString(),
      status: "New" as const,
      priority:
        dto.budget === "$500k+"
          ? "Critical"
          : dto.budget === "$250k–$500k"
            ? "High"
            : "Medium",
    } satisfies Partial<Inquiry>;

    const doc = await this.model.create(inquiry);
    const saved = doc.toJSON() as unknown as Inquiry;
    void this.notify(saved);
    return saved;
  }

  async update(id: string, patch: UpdateInquiryDto): Promise<Inquiry> {
    const updated = await this.model
      .findOneAndUpdate({ id }, { $set: patch }, { new: true })
      .select({ _id: 0, __v: 0 }).lean();
    if (!updated) throw new NotFoundException(`Inquiry ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.model.deleteOne({ id });
    if (res.deletedCount === 0) throw new NotFoundException(`Inquiry ${id} not found`);
  }

  private async nextId(): Promise<string> {
    const latest = await this.model
      .findOne({ id: /^INQ-/ })
      .sort({ id: -1 })
      .select({ id: 1 })
      .lean();
    const lastNum = latest ? parseInt(latest.id.replace(/^INQ-/, ""), 10) : 2418;
    return `INQ-${lastNum + 1}`;
  }

  private async notify(inquiry: Inquiry): Promise<void> {
    const apiKey = this.config.get<string>("RESEND_API_KEY");
    const to = this.config.get<string>("CONTACT_EMAIL");
    const from = this.config.get<string>("FROM_EMAIL") ?? "Silifton <hello@silifton.com>";
    if (!apiKey || !to) {
      this.logger.warn(`Resend not configured — skipped email for ${inquiry.id}`);
      return;
    }
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: [to],
        replyTo: inquiry.email,
        subject: `[${inquiry.id}] ${inquiry.subject} — ${inquiry.company}`,
        text: [
          `New inquiry · ${inquiry.id}`,
          `From: ${inquiry.name} <${inquiry.email}> · ${inquiry.company}`,
          `Budget: ${inquiry.budget}`,
          `Priority: ${inquiry.priority}`,
          ``,
          inquiry.message,
        ].join("\n"),
      });
    } catch (err) {
      this.logger.error("Failed to send inquiry notification", err as Error);
    }
  }
}
