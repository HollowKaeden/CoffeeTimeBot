import React, { useState, useEffect } from 'react';

const AddonsSelector = ({ addons, initialSelected = [], onChange, coffeeId }) => {
  const [selected, setSelected] = useState(initialSelected);

  const toggleAddon = (id) => {
    const newSelected = selected.includes(id) 
      ? selected.filter(a => a !== id) 
      : [...selected, id];
      
    setSelected(newSelected);
    const selectedAddons = addons.filter(a => newSelected.includes(a.id));
    const extra = selectedAddons.reduce((acc, a) => acc + a.price, 0);
    onChange(newSelected, extra);
  };

  return (
    <div>
      <h6 className="mt-3">Добавки</h6>
      {addons.map(addon => {
        const inputId = `addon-${coffeeId}-${addon.id}`;
        return (
          <div className="form-check" key={addon.id}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={selected.includes(addon.id)}
              onChange={() => toggleAddon(addon.id)}
              id={inputId}
            />
            <label className="form-check-label" htmlFor={inputId}>
              {addon.name} (+{addon.price}₽)
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default AddonsSelector;
