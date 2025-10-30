import { TConstructorIngredient, TIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TIngredient & { uniqueId: string };
  index: number;
  totalItems: number;
};
