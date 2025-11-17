import mongoose, { Schema, Document, Types } from 'mongoose';
import { IOrder, IOrderItem, IAddress } from '../types/order.types';

interface IOrderItemSchema {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrderSchema {
  userId: Types.ObjectId;
  items: IOrderItemSchema[];
  totalAmount: number;
  shippingAddress: IAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
}

export interface IOrderDocument extends Omit<IOrderSchema, '_id'>, Document {}

const orderItemSchema = new Schema<IOrderItemSchema>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
}, { _id: false });

const addressSchema = new Schema<IAddress>({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const orderSchema = new Schema<IOrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items: IOrderItem[]) {
        return items.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: '{VALUE} is not a valid order status'
    },
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      message: '{VALUE} is not a valid payment method'
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, { 
  timestamps: true 
});

// Indexes for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order number
orderSchema.virtual('orderNumber').get(function(this: IOrderDocument) {
  return `ORD-${(this._id as any).toString().slice(-8).toUpperCase()}`;
});

// Method to calculate order summary
orderSchema.methods.calculateSummary = function(this: IOrderDocument) {
  const subtotal = this.totalAmount;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

// Static method to get orders by date range
orderSchema.statics.getOrdersByDateRange = async function(startDate: Date, endDate: Date) {
  return await this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('userId', 'firstName lastName email')
    .populate('items.productId', 'name brand price');
};

// Static method to get revenue by date range
orderSchema.statics.getRevenueByDateRange = async function(startDate: Date, endDate: Date) {
  const result = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { totalRevenue: 0, orderCount: 0 };
};

// Pre-save middleware to validate order items
orderSchema.pre('save', async function(this: IOrderDocument, next) {
  if (this.isModified('items')) {
    // Recalculate total amount
    let calculatedTotal = 0;
    for (const item of this.items) {
      calculatedTotal += item.price * item.quantity;
    }
    
    // Update total if modified
    if (Math.abs(this.totalAmount - calculatedTotal) > 0.01) {
      this.totalAmount = calculatedTotal;
    }
  }
  next();
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete (ret as any).__v;
    return ret;
  }
});

orderSchema.set('toObject', { virtuals: true });

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);