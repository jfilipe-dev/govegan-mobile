import React, { useEffect, useState, useCallback } from 'react';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  async function loadFavorites(): Promise<void> {
    const response = await api.get<Food[]>('favorites');

    const listFavorites = response.data.map(favorite => {
      return {
        ...favorite,
        formattedPrice: formatValue(favorite.price),
      };
    });

    setFavorites(listFavorites);
    setRefreshing(false);
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, []);

  const handleNavigateFood = useCallback(
    (id: number) => {
      navigation.navigate('FoodDetails', {
        id,
      });
    },
    [navigation],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          refreshing={refreshing}
          onRefresh={refresh}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              activeOpacity={0.6}
              onPress={() => handleNavigateFood(item.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
