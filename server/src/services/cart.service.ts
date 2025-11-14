import { Cart, ICartDocument } from '../models/cart.model.ts'; // Assuming you put the cart model here
import { Product } from '../models/product.model.ts'; // Assuming product model is imported
import { AddToCartDto } from '../_shared/dtos/add-to-cart.dto.ts';
import { ApiError } from '../utils/ApiError';

export class CartService {
    
    /**
     * Finds the user's cart or creates a new one if it doesn't exist.
     * @param userId The ID of the authenticated user.
     * @returns The user's cart document.
     */
    private async getCartByUserId(userId: string): Promise<ICartDocument> {
        // Use populate to get product details, ensuring we get the price/stock, etc.
        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }
        return cart;
    }

    // --- Controller-Facing Methods ---

    public async getCart(userId: string): Promise<ICartDocument> {
        return this.getCartByUserId(userId);
    }

    public async addItem(userId: string, itemData: AddToCartDto): Promise<ICartDocument> {
        const { productId, quantity } = itemData;

        // Check if product exists and has enough stock (Business Logic)
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
            throw new ApiError(400, 'Product not found or insufficient stock.');
        }

        const cart = await this.getCartByUserId(userId);
        
        const existingItemIndex = cart.items.findIndex(
            // Use .toString() to safely compare ObjectId with string ID
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item (we cast product ID to any because Mongoose handles the ObjectId conversion)
            cart.items.push({ product: productId as any, quantity });
        }
        
        await cart.save();
        return cart.populate('items.product');
    }
    
    /**
     * Removes a product from the cart using the $pull operator.
     */
    public async removeItem(userId: string, productId: string): Promise<ICartDocument> {
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } }, // $pull removes all array elements matching criteria
            { new: true } // Return the updated document
        ).populate('items.product');

        if (!cart) {
            // If the cart somehow doesn't exist, return a new one or null
            throw new ApiError(404, 'Cart not found for this user.');
        }

        return cart;
    }

    /**
     * Clears all items from the cart.
     */
    public async clearCart(userId: string): Promise<void> {
        const result = await Cart.updateOne(
            { user: userId },
            { $set: { items: [] } }
        );
        
        if (result.matchedCount === 0) {
            throw new ApiError(404, 'Cart not found to clear.');
        }
    }
}