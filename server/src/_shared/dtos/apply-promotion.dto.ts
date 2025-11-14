import { IsString, IsNotEmpty } from 'class-validator';

export class ApplyPromotionDto {
  @IsString()
  @IsNotEmpty({ message: 'The couponCode field is required.' })
  // The promotion code submitted by the user (e.g., "GET25OFF")
  couponCode: string; 
}