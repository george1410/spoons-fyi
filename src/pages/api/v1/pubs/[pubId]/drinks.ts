import type { NextApiHandler } from 'next';
import { getMenus } from '../../../../../lib/wetherspoonsApi';

const PINT = 568;
const HALF_PINT = PINT / 2;
const SINGLE_MEASURE = 25;
const DOUBLE_MEASURE = 50;

const getMeasure = (portionName: string | undefined) => {
  switch (portionName) {
    case 'Pint':
      return PINT;

    case 'Half pint':
    case 'Half Pint':
    case 'Half':
      return HALF_PINT;

    case 'Single':
      return SINGLE_MEASURE;

    case 'Double':
      return DOUBLE_MEASURE;

    default:
      return Number(portionName?.match(/(\d+)ml/)?.[1]);
  }
};

type Category = 'Beer' | 'Cider' | 'Wine' | 'Other';
const getCategory = (product: { menu: string; group: string }): Category => {
  if (
    product.menu === 'Real ale' ||
    product.menu === 'Craft and world beers | Bottles & cans' ||
    (product.menu === 'Lager, beer, craft and cider | Draught' &&
      product.group === 'Lager and beer') ||
    product.group === 'Craft' ||
    product.menu === 'World beers & craft | Bottles & cans'
  ) {
    return 'Beer';
  }

  if (
    (product.menu === 'Lager, beer, craft and cider | Draught' &&
      product.group === 'Cider') ||
    product.menu === 'Cider | Bottles'
  ) {
    return 'Cider';
  }

  if (product.menu === 'Wine, prosecco & sparkling') {
    return 'Wine';
  }

  return 'Other';
};

type Drink = {
  name: string;
  abv: number;
  price: number;
  volume: number;
  group: string;
  menu: string;
  serveSizeName: string;
  alcoholMl: number;
  pricePerMlAlcohol: number;
  category: Category;
};
export type DrinksResponse = Drink[];

const handler: NextApiHandler<DrinksResponse> = async (req, res) => {
  const pubId = req.query.pubId as string;

  const menus = await getMenus(pubId);

  const drinksMenu = menus.find((menu) => menu.name === 'Drinks');

  const products = drinksMenu?.subMenu.flatMap((subMenu) =>
    subMenu.headerText === 'Includes a drink' ||
    /\d+ for £(.*)/.test(subMenu.headerText)
      ? []
      : subMenu.productGroups
          .flatMap((productGroup) =>
            productGroup.products.flatMap((product) =>
              product.portions?.length
                ? product.portions.map((portion) => ({
                    name: product.displayName,
                    abv: Number(
                      product.description.match(/((?:\d+\.)?\d+)% ABV/)?.[1]
                    ),
                    price: portion.price,
                    volume: getMeasure(portion.name),
                    serveSizeName: portion.name.replace(/\(.*\)/, ''),
                    group: productGroup.groupHeader,
                    menu: subMenu.headerText,
                  }))
                : {
                    name: product.displayName,
                    abv: Number(
                      product.description.match(/((?:\d+\.)?\d+)% ABV/)?.[1]
                    ),
                    price: product.priceValue,
                    volume:
                      Number(product.description.match(/(\d+)ml/)?.[1]) ||
                      getMeasure(product.defaultPortionName),
                    serveSizeName: Number(
                      product.description.match(/(\d+)ml/)?.[1]
                    )
                      ? `${Number(product.description.match(/(\d+)ml/)?.[1])}ml`
                      : product.defaultPortionName?.replace(/\(.*\)/, ''),
                    group: productGroup.groupHeader,
                    menu: subMenu.headerText,
                  }
            )
          )
          .map((product) => ({
            ...product,
            alcoholMl: product.volume * (product.abv / 100),
            pricePerMlAlcohol:
              product.price / (product.volume * (product.abv / 100)),
            category: getCategory(product),
          }))
          .filter(
            (product): product is Drink =>
              !!(
                product.abv &&
                product.volume &&
                product.price &&
                product.name &&
                !product.name.includes('Alcohol free') &&
                product.serveSizeName &&
                product.category
              )
          )
  );

  res
    .status(200)
    .json(
      products?.sort((a, b) => a.pricePerMlAlcohol - b.pricePerMlAlcohol) ?? []
    );
};

export default handler;
