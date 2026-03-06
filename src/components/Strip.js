// src/components/Strip.js
import React from 'react';

const items = [
  ['🍛', 'Authentic Kerala Cuisine'], ['🥢', 'Chinese Specialities'],
  ['🌶', 'South Indian Delights'], ['🚗', 'Home Delivery'],
  ['🪑', 'Dine-In Available'], ['👨‍👩‍👧', 'Family Friendly'],
  ['♿', 'Wheelchair Accessible'], ['🕙', 'Open Till 11 PM'],
];

export default function Strip() {
  const renderGroup = (suffix = '') => (
    <div className="strip-group" aria-hidden={suffix ? 'true' : undefined}>
      {items.map(([icon, label], i) => (
        <div className="strip-item" key={`${suffix}${i}`}>
          <span>{icon}</span> {label}
        </div>
      ))}
    </div>
  );

  return (
    <div className="about-strip">
      <div className="strip-scroll">
        {renderGroup()}
        {renderGroup('dup-')}
      </div>
    </div>
  );
}
