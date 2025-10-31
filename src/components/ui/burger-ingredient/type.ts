import { TIngredient, AppLocation } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  locationState: { background: AppLocation };
  handleAdd: () => void;
};
