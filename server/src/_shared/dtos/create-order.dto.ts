import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// --- Sub-DTO for Shipping Address ---

/**
 * Defines the required format for the shipping address component of the order.
 */
export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsOptional()
  country?: string; // Optional field
}

// --- Main Order DTO ---

/**
 * Defines the data required to initiate the checkout process.
 */
export class CreateOrderDto {
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsString()
  @IsOptional()
  // This would hold a token from a payment gateway (e.g., Stripe, PayPal)
  paymentToken?: string; 
  
  @IsString()
  @IsOptional()
  // If the user chooses to apply a coupon during checkout
  couponCode?: string; 
}