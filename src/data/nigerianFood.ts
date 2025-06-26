
export interface NigerianFood {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  restaurant: string;
}

export interface NigerianRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  specialty: string;
  foods: NigerianFood[];
}

export const nigerianFoodCategories = [
  { name: 'Rice Dishes', emoji: '🍚' },
  { name: 'Soups & Stews', emoji: '🍲' },
  { name: 'Snacks', emoji: '🥟' },
  { name: 'Drinks', emoji: '🥤' },
  { name: 'Swallow', emoji: '🍞' },
  { name: 'Grilled', emoji: '🍖' },
];

export const nigerianRestaurants: NigerianRestaurant[] = [
  {
    id: 'abula-spot',
    name: "Abula Spot",
    cuisine: 'Nigerian • Traditional',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
    specialty: 'Authentic Abula & Rice Dishes',
    foods: [
      {
        id: '1',
        name: 'Jollof Rice + Chicken',
        price: 800,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
        category: 'Rice Dishes',
        description: 'Perfectly spiced Jollof rice with tender grilled chicken',
        restaurant: "Abula Spot"
      },
      {
        id: '2',
        name: 'Pounded Yam + Egusi',
        price: 1000,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        category: 'Swallow',
        description: 'Fresh pounded yam with rich egusi soup and assorted meat',
        restaurant: "Abula Spot"
      }
    ]
  },
  {
    id: 'attees',
    name: 'Attees',
    cuisine: 'Nigerian • Grilled',
    rating: 4.6,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    specialty: 'Premium Grilled Meals',
    foods: [
      {
        id: '3',
        name: 'Beef Suya',
        price: 500,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
        category: 'Grilled',
        description: 'Spicy grilled beef skewers with suya spice',
        restaurant: 'Attees'
      },
      {
        id: '4',
        name: 'Chicken Suya',
        price: 600,
        image: 'https://images.unsplash.com/photo-1598515213692-d872febc8eda?w=400&h=300&fit=crop',
        category: 'Grilled',
        description: 'Tender grilled chicken with traditional suya seasoning',
        restaurant: 'Attees'
      }
    ]
  },
  {
    id: 'stomach-option',
    name: 'Stomach Option',
    cuisine: 'Nigerian • Snacks',
    rating: 4.4,
    deliveryTime: '10-20 min',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    specialty: 'Quick Bites & Snacks',
    foods: [
      {
        id: '5',
        name: 'Moi Moi',
        price: 300,
        image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop',
        category: 'Snacks',
        description: 'Steamed bean pudding with eggs and fish',
        restaurant: 'Stomach Option'
      },
      {
        id: '6',
        name: 'Fried Plantain',
        price: 400,
        image: 'https://images.unsplash.com/photo-1571506165871-899d4d226cd7?w=400&h=300&fit=crop',
        category: 'Snacks',
        description: 'Sweet fried plantain slices, perfectly golden',
        restaurant: 'Stomach Option'
      }
    ]
  },
  {
    id: 'zoey',
    name: 'Zoey',
    cuisine: 'Nigerian • Beverages',
    rating: 4.3,
    deliveryTime: '5-15 min',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    specialty: 'Fresh Drinks & Smoothies',
    foods: [
      {
        id: '7',
        name: 'Zobo Drink',
        price: 250,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
        category: 'Drinks',
        description: 'Refreshing hibiscus drink with natural spices',
        restaurant: 'Zoey'
      },
      {
        id: '8',
        name: 'Bottled Water',
        price: 150,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
        category: 'Drinks',
        description: 'Pure bottled water, ice cold',
        restaurant: 'Zoey'
      }
    ]
  },
  {
    id: 'italian-hut',
    name: 'Italian Hut',
    cuisine: 'Italian • Fusion',
    rating: 4.5,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    specialty: 'Italian-Nigerian Fusion',
    foods: [
      {
        id: '9',
        name: 'Jollof Pasta',
        price: 900,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        category: 'Rice Dishes',
        description: 'Italian pasta with Nigerian Jollof spices',
        restaurant: 'Italian Hut'
      },
      {
        id: '10',
        name: 'Pepperoni Pizza',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        category: 'Snacks',
        description: 'Classic pepperoni pizza with Nigerian pepper twist',
        restaurant: 'Italian Hut'
      }
    ]
  }
];

export const getAllNigerianFoods = (): NigerianFood[] => {
  return nigerianRestaurants.flatMap(restaurant => restaurant.foods);
};

export const getFoodsByCategory = (category: string): NigerianFood[] => {
  return getAllNigerianFoods().filter(food => food.category === category);
};

export const getFoodsByRestaurant = (restaurantId: string): NigerianFood[] => {
  const restaurant = nigerianRestaurants.find(r => r.id === restaurantId);
  return restaurant ? restaurant.foods : [];
};
