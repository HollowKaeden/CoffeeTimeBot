import React, { useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import AddonsSelector from '../components/AddonsSelector';

const Cart = () => {
  const { cart, clearCart, updateCartItem, removeFromCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    api.get('addons/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.addons || [];
        setAddons(data.map(a => ({ ...a, price: Number(a.price) })));
      })
      .catch(console.error);
  }, []);

  const handleOrder = () => {
    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }

    const payload = {
      items: cart.map(item => ({
        coffee: item.coffee.id,
        addons: item.addons.map(a => a.id),
      }))
    };

    setLoading(true);
    api.post('orders/create/', payload)
      .then(() => {
        alert('Заказ успешно оформлен!');
        clearCart();
      })
      .catch(() => alert('Ошибка при оформлении заказа'))
      .finally(() => setLoading(false));
  };

  const totalSum = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div>
      <h1 className="mb-4">Корзина</h1>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        cart.map(item => (
          <div key={item.id} className="card mb-3 shadow-sm position-relative">
            <div className="card-body">
              <button 
                className="btn btn-danger btn-sm position-absolute"
                style={{ top: 10, right: 10 }}
                onClick={() => removeFromCart(item.id)}
                title="Удалить"
              >
                ×
              </button>

              <h5 className="card-title">{item.coffee.name}</h5>
              <p className="card-text">{item.coffee.description}</p>

              {/* Addons selector */}
              <AddonsSelector
                addons={addons}
                coffeeId={item.id} // используем уникальный id товара в корзине
                initialSelected={item.addons.map(a => a.id)}
                onChange={(ids, extra) => {
                  const newAddons = addons.filter(a => ids.includes(a.id));
                  const newTotal = item.coffee.price + extra;
                  updateCartItem(item.id, newAddons, newTotal);
                }}
              />

              <p className="card-text fw-bold mt-2">
                Цена: {item.totalPrice}₽
              </p>
            </div>
          </div>
        ))
      )}
      <div className="mt-4 border-top pt-3">
        <h4>Общая сумма: {totalSum}₽</h4>
        <button
          className="btn btn-success mt-3"
          disabled={loading || cart.length === 0}
          onClick={handleOrder}
        >
          {loading ? 'Оформляем...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
