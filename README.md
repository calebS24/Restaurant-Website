# 🍛 The Venice Food Hub

A full-stack React web app for **The Venice Food Hub**, Nangyarkulangara, Alappuzha (Est. 2017).

## 🚀 Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
venice-food-hub/
├── public/
│   └── index.html              # HTML shell
├── src/
│   ├── data/
│   │   └── menuItems.js        # All menu, review, reservation & gallery data
│   ├── context/
│   │   └── AppContext.js       # Global state (cart, auth, reservations, etc.)
│   ├── styles/
│   │   ├── global.css          # CSS variables & base styles
│   │   ├── Navbar.css          # Navigation styles
│   │   ├── Hero.css            # Hero section styles
│   │   ├── sections.css        # Menu, Cart, Reservation, Reviews, Gallery, Footer, Toast
│   │   ├── Admin.css           # Admin panel styles
│   │   └── Customer.css        # Customer page & dark mode styles
│   ├── components/
│   │   ├── Navbar.js           # Top navigation bar
│   │   ├── Hero.js             # Landing hero section
│   │   ├── Strip.js            # Scrolling announcement strip
│   │   ├── MenuSection.js      # Menu with qty controls on each card
│   │   ├── CartSidebar.js      # Slide-out cart with checkout gate
│   │   ├── CheckoutModal.js    # Order confirmation modal
│   │   ├── ReservationSection.js # Table booking form
│   │   ├── ReviewsSection.js   # Marquee reviews + write review modal
│   │   ├── GallerySection.js   # Photo gallery with upload
│   │   ├── CartFab.js          # Floating cart button
│   │   ├── Footer.js           # Site footer
│   │   └── Toast.js            # Notification toasts
│   ├── pages/
│   │   ├── HomePage.js         # Assembles all home sections
│   │   ├── CustomerPage.js     # Customer login, dashboard, reservations, reschedule
│   │   └── AdminPage.js        # Admin dashboard, reservations, menu, orders, reviews
│   ├── App.js                  # Root component + routing
│   └── index.js                # React entry point
└── package.json
```

## ✨ Features

### Customer
- Browse menu by category with **+/− quantity controls** on each card
- Cart sidebar with real-time totals
- **Login required** before checkout
- Dark mode toggle on customer page
- View & **reschedule** reservations

### Admin
- **Restaurant status** — Available / Unavailable / Temporarily Paused
- Reservation management with **attendance tracking** (Attended / Attending / Not Present / Cancelled)
- **Reschedule** and **Remove** reservations
- Menu CRUD (add/remove items)
- Order tracking
- Review moderation

## 🛠 Built With

- React 18
- CSS Modules (no Tailwind, no extra UI libraries)
- Google Fonts (Playfair Display, DM Sans, Cormorant Garamond)
