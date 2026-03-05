// src/components/Strip.js
import React from 'react';

const items = [
  ['🍛', 'Authentic Kerala Cuisine'], ['🥢', 'Chinese Specialities'],
  ['🌶', 'South Indian Delights'], ['🚗', 'Home Delivery'],
  ['🪑', 'Dine-In Available'], ['👨‍👩‍👧', 'Family Friendly'],
  ['♿', 'Wheelchair Accessible'], ['🕙', 'Open Till 11 PM'],
];

export default function Strip() {
  return (
    <div className="about-strip">
      <div className="strip-scroll">
        {[...items, ...items].map(([icon, label], i) => (
          <div className="strip-item" key={i}>
            <span>{icon}</span> {label}
          </div>
        ))}
      </div>
    </div>
  );
}
