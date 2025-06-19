
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
    id: 'mama-put-1',
    name: "Mama Ngozi's Kitchen",
    cuisine: 'Nigerian • Traditional',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    specialty: 'Authentic Nigerian Home Cooking',
    foods: [
      {
        id: '1',
        name: 'Jollof Rice + Chicken',
        price: 800,
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
        category: 'Rice Dishes',
        description: 'Perfectly spiced Jollof rice with tender grilled chicken',
        restaurant: "Mama Ngozi's Kitchen"
      },
      {
        id: '2',
        name: 'Pounded Yam + Egusi',
        price: 1000,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        category: 'Swallow',
        description: 'Fresh pounded yam with rich egusi soup and assorted meat',
        restaurant: "Mama Ngozi's Kitchen"
      },
      {
        id: '6',
        name: 'Efo Riro',
        price: 700,
        image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400&h=300&fit=crop',
        category: 'Soups & Stews',
        description: 'Delicious spinach stew with assorted meat and fish',
        restaurant: "Mama Ngozi's Kitchen"
      }
    ]
  },
  {
    id: 'suya-spot',
    name: 'Abuja Suya Spot',
    cuisine: 'Nigerian • Grilled',
    rating: 4.6,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    specialty: 'Best Suya in Town',
    foods: [
      {
        id: '9',
        name: 'Beef Suya',
        price: 500,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
        category: 'Grilled',
        description: 'Spicy grilled beef skewers with suya spice',
        restaurant: 'Abuja Suya Spot'
      },
      {
        id: '10',
        name: 'Chicken Suya',
        price: 600,
        image: 'https://images.unsplash.com/photo-1598515213692-d872febc8eda?w=400&h=300&fit=crop',
        category: 'Grilled',
        description: 'Tender grilled chicken with traditional suya seasoning',
        restaurant: 'Abuja Suya Spot'
      }
    ]
  },
  {
    id: 'snack-palace',
    name: 'Lagos Snack Palace',
    cuisine: 'Nigerian • Snacks',
    rating: 4.4,
    deliveryTime: '10-20 min',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    specialty: 'Fresh Nigerian Snacks Daily',
    foods: [
      {
        id: '3',
        name: 'Moi Moi',
        price: 300,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
        category: 'Snacks',
        description: 'Steamed bean pudding with eggs and fish',
        restaurant: 'Lagos Snack Palace'
      },
      {
        id: '4',
        name: 'Fried Plantain',
        price: 400,
        image: 'https://images.unsplash.com/photo-1571506165871-899d4d226cd7?w=400&h=300&fit=crop',
        category: 'Snacks',
        description: 'Sweet fried plantain slices, perfectly golden',
        restaurant: 'Lagos Snack Palace'
      },
      {
        id: '5',
        name: 'Puff Puff',
        price: 200,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        category: 'Snacks',
        description: 'Deep-fried dough balls, soft and fluffy',
        restaurant: 'Lagos Snack Palace'
      }
    ]
  },
  {
    id: 'drink-hub',
    name: 'Refreshing Naija Drinks',
    cuisine: 'Nigerian • Beverages',
    rating: 4.3,
    deliveryTime: '5-15 min',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    specialty: 'Fresh Local Drinks',
    foods: [
      {
        id: '7',
        name: 'Bottled Water',
        price: 150,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
        category: 'Drinks',
        description: 'Pure bottled water, ice cold',
        restaurant: 'Refreshing Naija Drinks'
      },
      {
        id: '8',
        name: 'Zobo Drink',
        price: 250,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
        category: 'Drinks',
        description: 'Refreshing hibiscus drink with natural spices',
        restaurant: 'Refreshing Naija Drinks'
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
