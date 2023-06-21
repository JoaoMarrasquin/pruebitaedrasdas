import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCorredorInput } from './dto/create-corredor.input';
import { UpdateCorredorInput } from './dto/update-corredor.input';
import { Corredor } from './entities/corredor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CorredorService {
 
  constructor( 
    @InjectRepository(Corredor)
    private readonly corredorsRepository:Repository<Corredor> ){}

  async create(createCorredorInput: CreateCorredorInput): Promise<Corredor>  {
    const newCorredor= this.corredorsRepository.create(createCorredorInput);
    return await this.corredorsRepository.save(newCorredor); 
  }

  async findAll(): Promise<Corredor[]> {
    return this.corredorsRepository.find();
  }

  async findOne(id: string): Promise<Corredor> {
     const corredor= await  this.corredorsRepository.findOneBy({id});
     if (!corredor) throw new NotFoundException(`Not found`)
     return corredor;
  }

  async update(id: string, updateCorredorInput: UpdateCorredorInput): Promise<Corredor> {
    
    const corredor = await this.corredorsRepository.preload(updateCorredorInput);
    if (!corredor) throw new NotFoundException(`Not found`)
    return this.corredorsRepository.save(corredor);

  }

  async remove(id: string): Promise<Corredor> {

    const corredor= await  this.findOne(id);

    // await this.corredorRepository.update({id:id},{estado:true  });

    await this.corredorsRepository.remove(corredor);

    return {...corredor, id};

  }
}
