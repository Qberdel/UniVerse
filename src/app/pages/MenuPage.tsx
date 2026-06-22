import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Coins, Search, ShoppingCart, Plus } from 'lucide-react';
import { MENU_CATEGORIES } from '../lib/menu-items';
import { addToCart, getCartCount, getCartTotal, subscribeCartUpdated } from '../lib/cart';
import { fetchStoreItemsRequest, type StoreItem } from '../lib/api';
import { getPersonalPoints, subscribeProfileUpdated } from '../lib/profile';
import type { MenuItem } from '../lib/menu-items';

type DisplayMenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryLabel: string;
  university: string;
  image: string;
  tags: string[];
};

function mapStoreItem(item: StoreItem): DisplayMenuItem & MenuItem {
  const category = item.categories?.[0]?.toLowerCase() ?? 'other';
  const categoryLabel = item.categories?.[0] ?? 'Прочее';
  return {
    id: item.item_id,
    name: item.name,
    price: item.value,
    category,
    categoryLabel,
    university: item.university_name ?? '—',
    image: item.image_url ? '🖼️' : '🛍️',
    tags: item.categories ?? [],
  };
}

export function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [cartTotal, setCartTotal] = useState(() => getCartTotal());
  const [userAK, setUserAK] = useState(() => getPersonalPoints());
  const [menuItems, setMenuItems] = useState<DisplayMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const refreshCart = () => {
      setCartCount(getCartCount());
      setCartTotal(getCartTotal());
    };
    const refreshPoints = () => setUserAK(getPersonalPoints());
    const unsubCart = subscribeCartUpdated(refreshCart);
    const unsubProfile = subscribeProfileUpdated(refreshPoints);
    return () => {
      unsubCart();
      unsubProfile();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchStoreItemsRequest().then((result) => {
      if (cancelled) return;
      if (!result.ok || !result.data) {
        setLoadError(result.error ?? 'Не удалось загрузить товары');
        setMenuItems([]);
      } else {
        setMenuItems(result.data.map(mapStoreItem));
        setLoadError(null);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const fromApi = Array.from(
      new Set(menuItems.map((item) => item.categoryLabel).filter(Boolean)),
    );
    if (fromApi.length === 0) return MENU_CATEGORIES;
    return fromApi.map((name, index) => ({
      id: name.toLowerCase(),
      name,
      icon: MENU_CATEGORIES[index % MENU_CATEGORIES.length]?.icon ?? '🛍️',
    }));
  }, [menuItems]);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory || item.categoryLabel.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: DisplayMenuItem & MenuItem) => {
    if (userAK - cartTotal < item.price) return;
    addToCart(item);
  };

  const availableAK = userAK - cartTotal;
  const remainingAfterCart = availableAK;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 text-xl sm:text-2xl">Товары</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Обменяйте ваши АК на полезные товары и услуги
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Доступно АК</p>
                  <p className="text-xl sm:text-2xl">{userAK.toLocaleString()}</p>
                  {cartTotal > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      В корзине: {cartTotal.toLocaleString()} АК · останется {Math.max(0, remainingAfterCart).toLocaleString()} АК
                    </p>
                  )}
                </div>
              </div>
            </Card>
            <Button asChild variant="outline" className="w-full sm:w-auto relative">
              <Link to="/cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Корзина
                {cartCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 min-w-5 h-5 px-1.5 text-xs rounded-full"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск товара по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Сетка с жанрами</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="h-auto flex-col py-3 sm:py-4"
          >
            <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">📦</span>
            <span className="text-xs sm:text-sm">Все</span>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="h-auto flex-col py-3 sm:py-4"
            >
              <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.icon}</span>
              <span className="text-xs sm:text-sm">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg">Товары ({filteredItems.length})</h3>
        </div>

        {loadError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
            {loadError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {loading ? (
            <p className="text-sm text-muted-foreground col-span-full text-center py-8">Загрузка товаров...</p>
          ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-3 sm:p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col h-full">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.image}</div>

                <h4 className="mb-2 flex-1 text-sm sm:text-base line-clamp-2">{item.name}</h4>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      <span className="text-lg sm:text-xl">{item.price}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">АК</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    disabled={availableAK < item.price}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {availableAK < item.price ? 'Недостаточно АК' : 'Добавить'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
          )}
        </div>

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Товары не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
