import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    permalink: string;
}

export class Partial extends PartialType(CreateCategoryDto) {}
export class UpdateCategoryDto extends OmitType(Partial, ['permalink'] as const) {}

