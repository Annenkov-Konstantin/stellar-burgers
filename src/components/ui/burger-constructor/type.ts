import { TOrder, TIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: (TIngredient & { uniqueId: string }) | null;
    ingredients: (TIngredient & { uniqueId: string })[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
