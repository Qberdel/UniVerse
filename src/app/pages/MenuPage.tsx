import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Coins, Search, ShoppingCart, Plus } from 'lucide-react';

export function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'Все', icon: '🎯' },
    { id: 'education', name: 'Образование', icon: '📚' },
    { id: 'merch', name: 'Мерч', icon: '👕' },
    { id: 'food', name: 'Питание', icon: '🍽️' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎭' },
    { id: 'sports', name: 'Спорт', icon: '⚽' },
  ];

  const items = [
    {
      id: 1,
      name: "Сертификат на экскурсию в лабораторию",
      price: 500,
      category: "education",
      university: "МГУ",
      image: "🔬",
      tags: ["наука", "лаборатория"]
    },
    {
      id: 2,
      name: "Футболка университета",
      price: 300,
      category: "merch",
      university: "МГУ",
      image: "👕",
      tags: ["одежда", "мерч"]
    },
    {
      id: 3,
      name: "Скидка 20% в студенческой столовой",
      price: 150,
      category: "food",
      university: "МГУ",
      image: "🍽️",
      tags: ["еда", "скидка"]
    },
    {
      id: 4,
      name: "Доступ к онлайн-курсу",
      price: 800,
      category: "education",
      university: "МГУ",
      image: "💻",
      tags: ["обучение", "курс"]
    },
    {
      id: 5,
      name: "Билет на университетское мероприятие",
      price: 200,
      category: "entertainment",
      university: "МГУ",
      image: "🎭",
      tags: ["мероприятие", "культура"]
    },
    {
      id: 6,
      name: "Книга из университетской библиотеки",
      price: 400,
      category: "education",
      university: "МГУ",
      image: "📚",
      tags: ["книга", "библиотека"]
    },
    {
      id: 7,
      name: "Абонемент в спортзал",
      price: 600,
      category: "sports",
      university: "МГУ",
      image: "🏋️",
      tags: ["спорт", "фитнес"]
    },
    {
      id: 8,
      name: "Кружка с логотипом",
      price: 250,
      category: "merch",
      university: "МГУ",
      image: "☕",
      tags: ["мерч", "посуда"]
    },
    {
      id: 9,
      name: "Участие в научной конференции",
      price: 1000,
      category: "education",
      university: "МГУ",
      image: "🎓",
      tags: ["наука", "конференция"]
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  const userAK = 25430;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="mb-2 text-xl sm:text-2xl">Меню товаров</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Обменяйте ваши АК на полезные товары и услуги
            </p>
          </div>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Доступно АК</p>
                <p className="text-xl sm:text-2xl">{userAK.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск университета по тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 sm:mb-8">
        <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Сетка с жанрами</h3>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
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

      {/* Items Grid */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg">Товары ({filteredItems.length})</h3>
          {cart.length > 0 && (
            <Badge variant="default" className="text-xs sm:text-sm self-start">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {cart.length} в корзине
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredItems.map((item) => (
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
                    onClick={() => addToCart(item.id)}
                    disabled={userAK < item.price}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Товары не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
