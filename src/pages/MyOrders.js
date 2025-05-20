import React, { useEffect, useState } from 'react';
import api from '../api/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('orders/')
      .then(res => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else {
          setOrders([]);
          console.error('Неожиданный формат данных в ответе:', res.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при запросе заказов:', error);
        setOrders([]);
      });
  }, []);

  if (!Array.isArray(orders)) {
    return <p>Ошибка данных заказа</p>;
  }

  return (
    <div>
      <h1>Мои заказы</h1>
      {orders.length === 0 ? (
        <p>Заказов нет</p>
      ) : (
        orders.map(order => {
          // Считаем общую сумму по всем товарам в заказе
          const orderTotal = order.items.reduce((sum, item) => {
            const itemTotal = Number(item.coffee.price) +
              item.addons.reduce((acc, a) => acc + Number(a.price), 0);
            return sum + itemTotal;
          }, 0);

          return (
            <div 
              key={order.id} 
              style={{ 
                border: '1px solid #ccc', 
                borderRadius: 8, 
                margin: '10px 0', 
                padding: 15, 
                backgroundColor: '#fafafa' 
              }}
            >
              <p style={{ fontWeight: 'bold' }}>
                Заказ #{order.id} — {new Date(order.created_at).toLocaleString()}
              </p>

              {order.items.map((item, i) => {
                const itemTotal = Number(item.coffee.price) +
                  item.addons.reduce((acc, a) => acc + Number(a.price), 0);

                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div>
                      <b>{item.coffee.name}</b> — <span style={{ fontWeight: 'bold' }}>{itemTotal}₽</span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      Добавки:{' '}
                      {item.addons.length ? (
                        item.addons.map(a => (
                          <span 
                            key={a.id} 
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#e0f0ff',
                              color: '#007bff',
                              padding: '2px 8px',
                              borderRadius: 12,
                              marginRight: 6,
                              fontSize: 14,
                              userSelect: 'none',
                            }}
                          >
                            {a.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#888' }}>нет</span>
                      )}
                    </div>
                  </div>
                );
              })}

              <p style={{ fontWeight: 'bold', marginTop: 10, fontSize: 16 }}>
                Общая сумма заказа: {orderTotal}₽
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
