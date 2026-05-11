import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Coins, Trash2, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Сертификат на экскурсию в лабораторию",
      price: 500,
      category: "Образование",
      university: "МГУ",
      image: "🔬"
    },
    {
      id: 2,
      name: "Футболка университета",
      price: 300,
      category: "Мерч",
      university: "МГУ",
      image: "👕"
    },
    {
      id: 3,
      name: "Скидка 20% в студенческой столовой",
      price: 150,
      category: "Питание",
      university: "МГУ",
      image: "🍽️"
    },
    {
      id: 4,
      name: "Доступ к онлайн-курсу",
      price: 800,
      category: "Образование",
      university: "МГУ",
      image: "💻"
    },
    {
      id: 5,
      name: "Билет на университетское мероприятие",
      price: 200,
      category: "Развлечения",
      university: "МГУ",
      image: "🎭"
    },
    {
      id: 6,
      name: "Книга из университетской библиотеки",
      price: 400,
      category: "Образование",
      university: "МГУ",
      image: "📚"
    },
  ]);

  const totalAK = cartItems.reduce((sum, item) => sum + item.price, 0);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handlePayment = () => {
    alert(`Оплата ${totalAK} АК успешно выполнена!`);
    setCartItems([]);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center py-12 sm:py-16">
          <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-2 text-xl sm:text-2xl">Корзина пуста</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">Добавьте товары из меню</p>
          <Button asChild>
            <Link to="/menu">Перейти в товары</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-xl sm:text-2xl">Корзина товаров</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Выбрано товаров: {cartItems.length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Items Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4 hover:shadow-lg transition-all">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="text-3xl sm:text-4xl">{item.image}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className="mb-2 flex-1 text-sm sm:text-base line-clamp-2">{item.name}</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.university}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        <span className="text-lg sm:text-xl">{item.price}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">АК</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <Card className="p-4 sm:p-6 lg:sticky lg:top-24">
            <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">Итого</h3>

            <div className="space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Товаров:</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm sm:text-base">Всего к оплате:</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="text-xl sm:text-2xl">{totalAK}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">АК</span>
                </div>
              </div>
            </div>

            <Button className="w-full mb-3" onClick={handlePayment}>
              Оплатить {totalAK} АК
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setCartItems([])}>
              Очистить корзину
            </Button>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">
                У вас на балансе: <span className="text-foreground">25,430 АК</span>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Останется после покупки: <span className="text-foreground">{(25430 - totalAK).toLocaleString()} АК</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
