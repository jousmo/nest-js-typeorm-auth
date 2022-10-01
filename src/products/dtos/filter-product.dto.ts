import { IsOptional, IsPositive, ValidateIf } from 'class-validator';
import { PaginationDto } from '../../globals/dtos/pagination.dto';

export class FilterProductDto extends PaginationDto {
  @IsOptional()
  @IsPositive()
  minPrice: number;

  @ValidateIf((item) => item.minPrice)
  @IsPositive()
  maxPrice: number;
}
