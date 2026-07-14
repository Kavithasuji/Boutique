// import { normalizeProductBody } from './parse-product-form-data';

// describe('normalizeProductBody', () => {
//   it('parses stringified form values into the shapes expected by DTO validation', () => {
//     const result = normalizeProductBody({
//       categoryId: 'cat_1',
//       name: 'Test Product',
//       price: '19.99',
//       discountPrice: '9.99',
//       isFeatured: 'true',
//       isActive: 'false',
//       variants: '[{"size":"M","color":"Red","sku":"M-Red","stock":5}]',
//       images: '[{"imageUrl":"/foo.png"}]',
//     });

//     expect(result).toEqual({
//       categoryId: 'cat_1',
//       name: 'Test Product',
//       price: 19.99,
//       discountPrice: 9.99,
//       isFeatured: true,
//       isActive: false,
//       variants: [{ size: 'M', color: 'Red', sku: 'M-Red', stock: 5 }],
//       images: [{ imageUrl: '/foo.png' }],
//     });
//   });
// });

import { normalizeProductBody } from './parse-product-form-data';

describe('normalizeProductBody', () => {
  it('parses stringified form values into the shapes expected by DTO validation', () => {
    const result = normalizeProductBody({
      categoryId: 'cat_1',
      name: 'Test Product',
      price: '19.99',
      discountPrice: '9.99',
      isFeatured: 'true',
      isActive: 'false',
      variants:
        '[{"size":"M","color":"Red","sku":"M-Red","stock":5}]',
      images:
        '[{"color":"Red","imageUrl":"/red.png","isPrimary":true}]',
    });

    expect(result).toEqual({
      categoryId: 'cat_1',
      name: 'Test Product',
      price: 19.99,
      discountPrice: 9.99,
      isFeatured: true,
      isActive: false,
      variants: [
        {
          size: 'M',
          color: 'Red',
          sku: 'M-Red',
          stock: 5,
        },
      ],
      images: [
        {
          color: 'Red',
          imageUrl: '/red.png',
          isPrimary: true,
        },
      ],
    });
  });

  it('handles missing optional fields', () => {
    const result = normalizeProductBody({
      categoryId: 'cat_1',
      name: 'Product',
      price: '100',
      variants: '[]',
    });

    expect(result).toEqual({
      categoryId: 'cat_1',
      name: 'Product',
      price: 100,
      variants: [],
    });
  });

  it('handles already parsed objects', () => {
    const result = normalizeProductBody({
      categoryId: 'cat_1',
      name: 'Product',
      price: 50,
      variants: [
        {
          size: 'L',
          color: 'Black',
          sku: 'L-BLK',
          stock: 10,
        },
      ],
      images: [
        {
          color: 'Black',
          imageUrl: '/black.png',
        },
      ],
    });

    expect(result).toEqual({
      categoryId: 'cat_1',
      name: 'Product',
      price: 50,
      variants: [
        {
          size: 'L',
          color: 'Black',
          sku: 'L-BLK',
          stock: 10,
        },
      ],
      images: [
        {
          color: 'Black',
          imageUrl: '/black.png',
        },
      ],
    });
  });
});

function expect(result: { [x: string]: any; }) {
  throw new Error('Function not implemented.');
}
