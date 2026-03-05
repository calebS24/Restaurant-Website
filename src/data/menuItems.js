// src/data/menuItems.js

export const menuItems = [
  // KERALA
  { id: 1, name: 'Karimeen Pollichathu', cat: 'kerala', price: 280, type: 'non-veg', desc: 'Pearl spot fish marinated in spices, wrapped in banana leaf and pan-seared.', img: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 2, name: 'Beef Fry', cat: 'kerala', price: 180, type: 'non-veg', desc: 'Tender beef pieces slow-cooked with coconut slices and aromatic spices.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { id: 3, name: 'Appam & Stew', cat: 'kerala', price: 120, type: 'non-veg', desc: 'Lacy rice pancakes served with a delicate coconut milk chicken stew.', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80' },
  { id: 4, name: 'Kerala Fish Curry', cat: 'kerala', price: 220, type: 'non-veg', desc: 'Tangy Malabar fish curry with raw mango and coconut base.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
  { id: 5, name: 'Puttu & Kadala', cat: 'kerala', price: 90, type: 'veg', desc: 'Steamed rice cylinders with black chickpea curry, a breakfast classic.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
  // CHINESE
  { id: 6, name: 'Chicken Fried Rice', cat: 'chinese', price: 160, type: 'non-veg', desc: 'Wok-tossed jasmine rice with chicken, eggs and spring onions.', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80' },
  { id: 7, name: 'Manchurian', cat: 'chinese', price: 140, type: 'veg', desc: 'Crispy vegetable balls in a tangy, spicy Manchurian sauce.', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80' },
  { id: 8, name: 'Chilli Chicken', cat: 'chinese', price: 180, type: 'non-veg', desc: 'Indo-Chinese dry chilli chicken with capsicum and crispy onions.', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  { id: 9, name: 'Veg Noodles', cat: 'chinese', price: 130, type: 'veg', desc: 'Hakka noodles stir-fried with fresh vegetables and soy sauce.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80' },
  // SOUTH INDIAN
  { id: 10, name: 'Masala Dosa', cat: 'south-indian', price: 80, type: 'veg', desc: 'Crispy golden dosa filled with spiced potato masala. Served with chutneys.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
  { id: 11, name: 'Chicken Biryani', cat: 'south-indian', price: 200, type: 'non-veg', desc: 'Fragrant basmati rice layered with tender chicken and saffron.', img: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80' },
  { id: 12, name: 'Sambar Rice', cat: 'south-indian', price: 90, type: 'veg', desc: 'Comforting sambar with drumstick and tamarind, served with ghee rice.', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80' },
  // BEVERAGES
  { id: 13, name: 'Fresh Lime Soda', cat: 'beverages', price: 40, type: 'veg', desc: 'Freshly squeezed lime with sparkling soda and a hint of black salt.', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
  { id: 14, name: 'Masala Chai', cat: 'beverages', price: 30, type: 'veg', desc: 'Freshly brewed spiced tea with ginger, cardamom and tulsi.', img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80' },
  { id: 15, name: 'Mango Lassi', cat: 'beverages', price: 60, type: 'veg', desc: 'Thick, creamy yogurt blended with Alphonso mango pulp.', img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80' },
  // DESSERTS
  { id: 16, name: 'Payasam', cat: 'desserts', price: 70, type: 'veg', desc: 'Traditional Kerala rice pudding with cashews, raisins and cardamom.', img: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&q=80' },
  { id: 17, name: 'Gulab Jamun', cat: 'desserts', price: 60, type: 'veg', desc: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup.', img: 'https://images.unsplash.com/photo-1601303516534-bf4e44c0bb34?w=400&q=80' },
];

export const initialReviews = [
  { id: 'rv1', name: 'Priya Menon', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', rating: 5, text: 'Absolutely loved the Karimeen Pollichathu! The banana leaf imparted such a beautiful aroma. Will definitely be back.', dish: 'Karimeen Pollichathu', date: 'Feb 2026' },
  { id: 'rv2', name: 'Ravi Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', rating: 4, text: 'Solid place for a quick lunch. The Chicken Biryani was fragrant and well-spiced. Service was friendly and prompt.', dish: 'Chicken Biryani', date: 'Jan 2026' },
  { id: 'rv3', name: 'Asha George', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80', rating: 4, text: 'The Masala Dosa here is probably the crispiest I have had in Alappuzha. Sambar was outstanding too!', dish: 'Masala Dosa', date: 'Jan 2026' },
  { id: 'rv4', name: 'Vinod Nambiar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', rating: 3, text: 'Decent food overall. The Chilli Chicken could use more heat. Ambience is simple and clean. Good value.', dish: 'Chilli Chicken', date: 'Dec 2025' },
  { id: 'rv5', name: 'Lekha Mohan', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80', rating: 5, text: "The payasam here takes me back to grandma's kitchen. Authentic, not too sweet, with the perfect hint of cardamom.", dish: 'Payasam', date: 'Dec 2025' },
  { id: 'rv6', name: 'Shyam Raj', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', rating: 4, text: 'Been coming here since 2019. Always consistent. The beef fry with porotta is my go-to evening snack combo.', dish: 'Beef Fry', date: 'Nov 2025' },
];

export const initialReservations = [
  { id: 'RES001', name: 'Arjun Nair', phone: '+91 98XXX XXXXX', email: 'arjun@email.com', date: '2026-03-08', time: '07:30 PM', guests: '4 People', occasion: 'Birthday', status: 'confirmed', attendance: null, notes: 'Surprise cake arranged' },
  { id: 'RES002', name: 'Meera Thomas', phone: '+91 94XXX XXXXX', email: 'meera@email.com', date: '2026-03-08', time: '08:00 PM', guests: '2 People', occasion: 'Anniversary', status: 'unavailable', attendance: null, notes: 'Anniversary dinner' },
  { id: 'RES003', name: 'Rajan Pillai', phone: '+91 91XXX XXXXX', email: 'rajan@email.com', date: '2026-03-09', time: '01:00 PM', guests: '6 People', occasion: 'Family Gathering', status: 'pending', attendance: null, notes: 'Require high chair' },
  { id: 'RES004', name: 'Sunitha Kuriakose', phone: '+91 80XXX XXXXX', email: 'sunitha@email.com', date: '2026-03-10', time: '07:00 PM', guests: '3 People', occasion: 'Regular Dining', status: 'confirmed', attendance: null, notes: '' },
];

export const galleryPhotos = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', credit: 'The Venice Kitchen' },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80', credit: 'Biryani Special' },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', credit: 'Chinese Corner' },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', credit: 'Karimeen Special' },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', credit: 'Appam & Stew' },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80', credit: 'Fried Rice' },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', credit: 'Fresh Lime' },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&q=80', credit: 'Payasam' },
];
