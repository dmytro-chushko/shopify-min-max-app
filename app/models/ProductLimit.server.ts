import db from '../db.server';

type NewProductLimitPayload = {
  productId: string;
  title: string;
  productHandle: string;
  shop: string;
};

type ProductLimitItem = {
  id: string;
  productId: string;
  title: string;
  productHandle: string;
  shop: string;
  minLimit: number | null;
  maxLimit: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductLimitPayload = {
  id?: string;
  productId: string;
  productHandle: string;
  title: string;
  shop: string;
  minLimit?: number;
  maxLimit?: number;
};

export async function createProductLimit(
  data: NewProductLimitPayload
): Promise<ProductLimitItem> {
  return await db.productLimit.create({ data });
}

export async function getAllProductLimits(): Promise<ProductLimitItem[]> {
  return await db.productLimit.findMany();
}

export async function updateProductLimit({
  id,
  ...payload
}: { id: string } & Partial<ProductLimitPayload>): Promise<ProductLimitItem> {
  return await db.productLimit.update({
    data: payload,
    where: { id },
  });
}

export function validateProductLimitPayload(
  data: Record<string, string | number>
): ProductLimitPayload {
  const errors: {
    id?: string;
    title?: string;
    productId?: string;
    productHandle?: string;
    shop?: string;
    minLimit?: string;
    maxLimit?: string;
  } = {};

  if (data.id && typeof data.id !== 'string') {
    errors.id = 'Id should be a string';
  }

  if (data.minLimit && typeof data.minLimit !== 'number') {
    errors.minLimit = 'MinLimit should be a number';
  }

  if (data.maxLimit && typeof data.minLimit !== 'number') {
    errors.maxLimit = 'MaxLimit should be a number';
  }

  if (!data.title) {
    errors.title = 'Title is required';
  }

  if (typeof data.title !== 'string') {
    errors.title = 'Title should be a string';
  }

  if (!data.productId) {
    errors.productId = 'Product is required';
  }

  if (typeof data.productId !== 'string') {
    errors.productId = 'PoductId should be a string';
  }

  if (!data.productHandle) {
    errors.productHandle = 'Product is required';
  }

  if (typeof data.productHandle !== 'string') {
    errors.productHandle = 'ProductHandle should be a string';
  }

  if (!data.shop) {
    errors.shop = 'Shop is required';
  }

  if (typeof data.shop !== 'string') {
    errors.shop = 'Shop should be a string';
  }

  if (Object.keys(errors).length) {
    throw new Error(JSON.stringify(errors));
  }

  return {
    ...(data.id && { id: data.id as string }),
    productId: data.productId as string,
    title: data.title as string,
    productHandle: data.productHandle as string,
    shop: data.shop as string,
    ...(data.minLimit && { minLimit: data.minLimit as number }),
    ...(data.maxLimit && { maxLimit: data.maxLimit as number }),
  };
}
