

export interface Category {
  catagory_id: string;
  catagory_name: string;
}

export interface Game {
  game_id: string;
  title: string;
  price: number;
  cover_img: string;
  catagory_id: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { catagory_id: 'c1', catagory_name: 'Action' },
  { catagory_id: 'c2', catagory_name: 'RPG' },
  { catagory_id: 'c3', catagory_name: 'Simulation' },
  { catagory_id: 'c4', catagory_name: 'Strategy' },
];

export const GAMES: Game[] = [
  {
    game_id: 'g1',
    title: 'Cyberpunk 2077',
    price: 9.99,
    cover_img: '/images/cyberpunk.jpg',
    catagory_id: 'c2',
    description: 'Open world action RPG set in a futuristic metropolis.'
  },
  {
    game_id: 'g2',
    title: 'Forza Horizon 6',
    price: 7.99,
    cover_img: '/images/forza_6.jpg',
    catagory_id: 'c3',
    description: 'Ultimate open-world racing simulator with realistic steering support.'
  },
  {
    game_id: 'g3',
    title: 'Minecraft Dungeons 2',
    price: 11.99,
    cover_img: '/images/Minecraft.jpg',
    catagory_id: 'c1',
    description: 'Immersive dungeon action combat designed for adventurers.'
  },
  {
    game_id: 'g4',
    title: 'Call of duty: Modern Warfare 4',
    price: 5.99,
    cover_img: '/images/MW4.jpg',
    catagory_id: 'c4',
    description: 'Competitive tactical shooter with precise gunplay.'
  }
];