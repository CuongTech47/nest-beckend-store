import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {Address} from "./entities/address.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class AddressesService {

  constructor(
      @InjectRepository(Address)
      private readonly addRessReposipory : Repository<Address>
  ) {
  }
  async create(createAddressDto: CreateAddressDto) {
    const {  address , city } = createAddressDto

    const newAddress = await this.addRessReposipory.create({
      address : address ,
      city : city
    })

    await this.addRessReposipory.save(newAddress)
    return newAddress;
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
