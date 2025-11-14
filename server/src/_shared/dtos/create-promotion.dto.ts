import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  Min, 
  IsDateString, 
  IsEnum, 
  IsBoolean 
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  // The unique code customers will enter (e.g., "SUMMER25")
  code: string; 

  @IsEnum(['percentage', 'fixed'])
  @IsNotEmpty()
  // Type of discount to apply
  discountType: 'percentage' | 'fixed';

  @IsNumber()
  @Min(0.01)
  // The value of the discount (e.g., 25 for percentage, 10 for fixed $10)
  discountValue: number;

  @IsDateString()
  @IsNotEmpty()
  // The date the promotion expires
  expiresAt: string; 

  @IsBoolean()
  @IsNotEmpty()
  // Whether the code is immediately active
  isActive: boolean;
}