import { Request, Response, NextFunction } from 'express'
import { CartService } from '../services/cart.service'
import { AddToCartDto } from '../_shared/dtos/add-to-cart.dto'
import { IUserDocument } from '../modules/auth/model/auth.model' // Needed for req.user type
import { ApiError } from '../utils/ApiError'

// Define a type for the request after authentication
interface AuthRequest extends Request {
  user?: IUserDocument
}

const cartService = new CartService()

export class CartController {
  /**
   * Retrieves the current cart for the authenticated user.
   * GET /api/v1/cart
   */
  public async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          'Authentication failed. User information missing.'
        )
      }

      const cart = await cartService.getCart(req.user.id)

      // 200 OK
      res.status(200).json(cart)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Adds a product to the cart or updates its quantity.
   * POST /api/v1/cart/item
   */
  public async addItemToCart(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          'Authentication failed. User information missing.'
        )
      }

      // DTO validation handled by middleware
      const itemData: AddToCartDto = req.body
      const userId = req.user.id

      const updatedCart = await cartService.addItem(userId, itemData)

      // 200 OK (or 201 Created, but 200 is common for updates)
      res.status(200).json(updatedCart)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Removes a product from the cart.
   * DELETE /api/v1/cart/item/:productId
   */
  public async removeItemFromCart(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          'Authentication failed. User information missing.'
        )
      }

      const { productId } = req.params
      const userId = req.user.id

      const updatedCart = await cartService.removeItem(userId, productId)

      // 200 OK
      res.status(200).json({
        message: 'Item successfully removed from cart.',
        cart: updatedCart,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Clears all items from the cart.
   * DELETE /api/v1/cart
   */
  public async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          'Authentication failed. User information missing.'
        )
      }

      await cartService.clearCart(req.user.id)

      // 204 No Content (Standard for successful deletion/clearance)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
