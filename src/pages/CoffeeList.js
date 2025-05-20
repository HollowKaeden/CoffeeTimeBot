import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import AddonsSelector from '../components/AddonsSelector';
import { CartContext } from '../context/CartContext';

export default function CoffeeList() {
  const [coffees, setCoffees] = useState([]);
  const [addons, setAddons] = useState([]);
  const { addToCart } = useContext(CartContext);

  const [selectedByCoffee, setSelectedByCoffee] = useState({}); // {coffeeId: {ids:[], extra:0}}
  const [addedToCart, setAddedToCart] = useState({}); // {coffeeId: true/false}

  useEffect(() => {
    api.get('coffees/').then(r => {
      const data = r.data;
      let coffeeList = [];

      if (Array.isArray(data)) {
        coffeeList = data;
      } else if (Array.isArray(data.coffees)) {
        coffeeList = data.coffees;
      }

      setCoffees(coffeeList.map(c => ({
        ...c,
        price: Number(c.price)
      })));
    }).catch(console.error);

    api.get('addons/').then(r => {
      const data = r.data;
      let addonList = [];

      if (Array.isArray(data)) {
        addonList = data;
      } else if (Array.isArray(data.addons)) {
        addonList = data.addons;
      }

      setAddons(addonList.map(a => ({
        ...a,
        price: Number(a.price)
      })));
    }).catch(console.error);
  }, []);

  const handleAdd = coffee => {
    const sel = selectedByCoffee[coffee.id] || { ids: [], extra: 0 };
    const selected = addons.filter(a => sel.ids.includes(a.id));
    const total = coffee.price + sel.extra;

    addToCart(coffee, selected, total);

    // Показываем "Добавлено!"
    setAddedToCart(prev => ({ ...prev, [coffee.id]: true }));

    // Сбрасываем выбранные добавки
    setSelectedByCoffee(prev => ({
      ...prev,
      [coffee.id]: { ids: [], extra: 0 }
    }));

    // Через 2 секунды возвращаем кнопку обратно
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [coffee.id]: false }));
    }, 2000);
  };

  return (
    <div>
      <h1 className="mb-4">Меню кофе</h1>
      <div className="row">
        {coffees.map(coffee => {
          const sel = selectedByCoffee[coffee.id] || { ids: [], extra: 0 };
          const total = coffee.price + sel.extra;
          const isAdded = addedToCart[coffee.id];

          return (
            <div key={coffee.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                {coffee.image && (
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="card-img-top"
                    style={{ maxHeight: 200, objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{coffee.name}</h5>
                  <p className="card-text">{coffee.description}</p>

                  <AddonsSelector
                    addons={addons}
                    coffeeId={coffee.id}
                    initialSelected={sel.ids}
                    onChange={(ids, extra) =>
                      setSelectedByCoffee(prev => ({
                        ...prev,
                        [coffee.id]: { ids, extra },
                      }))
                    }
                  />

                  <p className="fw-bold mt-2">Итого: {total}₽</p>
                  <button
                    className={`btn mt-auto ${isAdded ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAdd(coffee)}
                    disabled={isAdded}
                  >
                    {isAdded ? 'Добавлено!' : 'В корзину'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
