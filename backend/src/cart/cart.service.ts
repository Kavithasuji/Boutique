import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddCartDto } from "./dto/add-cart.dto";

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Add Product to Cart
  async addToCart(userId: string, dto: AddCartDto) {
    // Check variant exists
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        id: dto.variantId,
      },
      include: {
        inventory: true,
      },
    });

    if (!variant) {
      throw new NotFoundException("Product variant not found.");
    }

    if (!variant.inventory) {
      throw new BadRequestException("Inventory not found.");
    }

    if (variant.inventory.stock < dto.quantity) {
      throw new BadRequestException("Insufficient stock.");
    }

    // Check if item already exists in cart
    const existingCartItem = await this.prisma.cart.findUnique({
      where: {
        userId_variantId: {
          userId,
          variantId: dto.variantId,
        },
      },
    });

    // Update quantity
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + dto.quantity;

      if (newQuantity > variant.inventory.stock) {
        throw new BadRequestException(
          "Requested quantity exceeds available stock.",
        );
      }

      const updatedCart = await this.prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      return {
        message: "Cart updated successfully.",
        data: updatedCart,
      };
    }

    // Create new cart item
    const cart = await this.prisma.cart.create({
      data: {
        userId,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
    });

    return {
      message: "Product added to cart successfully.",
      data: cart,
    };
  }
  // Get Logged-in User Cart
async getCart(userId: string) {
  const cart = await this.prisma.cart.findMany({
    where: {
      userId,
    },
    include: {
      variant: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
          color: true,
          inventory: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    message: "Cart fetched successfully.",
    data: cart,
  };
}

async updateQuantity(
  userId: string,
  cartId: string,
  quantity: number,
) {
  const cart = await this.prisma.cart.findFirst({
    where: {
      id: cartId,
      userId,
    },
    include: {
      variant: {
        include: {
          inventory: true,
        },
      },
    },
  });

  if (!cart) {
    throw new NotFoundException("Cart item not found.");
  }

  if (!cart.variant.inventory) {
    throw new BadRequestException("Inventory not found.");
  }

  if (quantity < 1) {
    throw new BadRequestException("Quantity must be at least 1.");
  }

  if (quantity > cart.variant.inventory.stock) {
    throw new BadRequestException("Insufficient stock.");
  }

  return this.prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      quantity,
    },
  });
}
async removeItem(
  userId: string,
  cartId: string,
) {
  const cart = await this.prisma.cart.findFirst({
    where: {
      id: cartId,
      userId,
    },
  });

  if (!cart) {
    throw new NotFoundException("Cart item not found.");
  }

  await this.prisma.cart.delete({
    where: {
      id: cartId,
    },
  });

  return {
    message: "Item removed successfully.",
  };
}
}