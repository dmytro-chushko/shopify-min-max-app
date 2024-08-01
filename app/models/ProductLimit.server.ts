import db from "../db.server";

type NewProductLimitPayload = {
  productId: string;
  title: string;
  shop: string;   
}

type ProductLimitItem = {
  id: string;
  productId: string;
  title: string;
  shop: string;
  minLimit: number | null;
  maxLimit: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function createProductLimit(data: NewProductLimitPayload): Promise<ProductLimitItem> {
  return await db.productLimit.create({data});
}