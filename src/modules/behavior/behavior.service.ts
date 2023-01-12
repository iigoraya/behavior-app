import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { CreateBehaviorDTO } from './dtos/create-behavior.dto';
import { Behavior, BehaviorDocument } from './entities/behavior.entity';

@Injectable()
export class BehaviorService {
  constructor(
    @InjectModel(Behavior.name)
    private behaviorModal: Model<BehaviorDocument>,
  ) {}

  public readonly create = async (body: CreateBehaviorDTO) => {
    const createdDocument = new this.behaviorModal(body);
    return await createdDocument.save();
  };

  public readonly remove = async (id: string) => {
    if (id === '') {
      throw new BadRequestException("Missing required 'id' query parameter");
    }

    const removedBehavior = await this.behaviorModal.findByIdAndDelete(id);

    if (!removedBehavior) {
      throw new NotFoundException(`Good id ${id} not found`);
    }

    return removedBehavior;
  };

  public readonly upload = async (buffer: Buffer, fileName: string) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e7)}`;
    try {
      if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images');
      }

      fs.writeFile(`./images/${suffix}-${fileName}`, buffer, (error) => {
        if (!!error) {
          console.log(error);
          throw new HttpException('Failed to upload file', 500);
        }
      });
    } catch (error) {
      console.error(`Got an error trying to write to a file: ${error.message}`);
      throw new HttpException('Failed to upload file', 500);
    }
  };

  public readonly update = async (behavior: Behavior, id: string) => {
    if (id === '') {
      throw new BadRequestException("Missing required 'id' query parameter");
    }

    const updatedBehavior = await this.behaviorModal.findOneAndUpdate(
      { _id: id },
      { $set: behavior },
      { new: true },
    );

    if (!updatedBehavior) {
      throw new NotFoundException(`Behavior with id ${id} not found`);
    }
    return updatedBehavior;
  };

  public readonly getRecords = async (pagination = ''): Promise<Behavior[]> => {
    switch (pagination.toLowerCase()) {
      case '': {
        return await this.findAll();
      }
      case 'today': {
        return await this.findForToday();
      }
      case 'week': {
        return await this.findForWeek();
      }
      case 'month': {
        return await this.findForMonth();
      }
      default: {
        throw new BadRequestException('Please provide a valid pagination key');
      }
    }
  };

  private readonly findAll = async (): Promise<Behavior[]> =>
    await this.behaviorModal.find({});

  private readonly findForToday = async (): Promise<Behavior[]> => {
    return await this.behaviorModal.find({
      createdAt: {
        $gte: new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000),
      },
    });
  };

  private readonly findForWeek = async (): Promise<Behavior[]> => {
    return await this.behaviorModal.find({
      createdAt: {
        $gte: new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000),
      },
    });
  };

  private readonly findForMonth = async (): Promise<Behavior[]> => {
    return await this.behaviorModal.find({
      createdAt: {
        $gte: new Date(new Date().getTime() - 30 * 60 * 60 * 24 * 1000),
      },
    });
  };
}
