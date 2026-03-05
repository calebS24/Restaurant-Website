// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/Admin.css';

const FALLBACK_MENU_IMG = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80';

const TABS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'reservations', icon: '📅', label: 'Reservations' },
  { key: 'menu', icon: '🍽', label: 'Menu Management' },
  { key: 'orders', icon: '📦', label: 'Orders' },
  { key: 'reviews', icon: '⭐', label: 'Reviews' },
  { key: 'team', icon: '🛡️', label: 'Team Roles' },
];
const ADMIN_ROUTE_BY_TAB = {
  dashboard: 'dashboard',
  reservations: 'reservations',
  menu: 'menu-management',
  orders: 'orders',
  reviews: 'reviews',
  team: 'team-roles',
};
const ADMIN_TAB_BY_ROUTE = Object.entries(ADMIN_ROUTE_BY_TAB).reduce((acc, [tab, route]) => {
  acc[route] = tab;
  return acc;
}, {});

const ATTENDANCE_OPTIONS = [
  { value: 'attended', label: '✅ Attended', cls: 'att-attended' },
  { value: 'attending', label: '🟢 Attending', cls: 'att-attending' },
  { value: 'notpresent', label: '❌ Not Present', cls: 'att-notpresent' },
  { value: 'cancelled', label: '🚫 Cancelled', cls: 'att-cancelled' },
];

// ── Dashboard ────────────────────────────────────────────────
function Dashboard({ onNavigate }) {
  const { menuData, reservations, orders, reviews } = useApp();

  const conflicts = reservations.filter(r => r.status === 'unavailable');

  return (
    <div>
      <div className="admin-page-title">Dashboard</div>
      <div className="admin-page-sub">Overview of The Venice Food Hub</div>

      <div className="admin-stats-grid">
        <button className="admin-stat-card stat-link" type="button" onClick={() => onNavigate('menu')}>
          <div className="admin-stat-icon">🍽</div><div className="admin-stat-val">{menuData.length}</div><div className="admin-stat-label">Menu Items</div>
        </button>
        <button className="admin-stat-card stat-link" type="button" onClick={() => onNavigate('reservations')}>
          <div className="admin-stat-icon">📅</div><div className="admin-stat-val">{reservations.length}</div><div className="admin-stat-label">Reservations</div>
        </button>
        <button className="admin-stat-card stat-link" type="button" onClick={() => onNavigate('orders')}>
          <div className="admin-stat-icon">📦</div><div className="admin-stat-val">{orders.length}</div><div className="admin-stat-label">Orders Today</div>
        </button>
        <button className="admin-stat-card stat-link" type="button" onClick={() => onNavigate('reviews')}>
          <div className="admin-stat-icon">⭐</div><div className="admin-stat-val">{reviews.length}</div><div className="admin-stat-label">Reviews</div>
        </button>
      </div>

      {conflicts.length > 0 && (
        <div className="admin-alert-panel">
          <div className="admin-alert-title">⚠️ Unavailable Reservation Conflicts</div>
          {conflicts.map(r => (
            <div className="admin-alert-row" key={r.id}>
              <strong>{r.name}</strong> — {r.date} at {r.time} · {r.guests}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>📞 {r.phone}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reservations ─────────────────────────────────────────────
function Reservations() {
  const { reservations, addReservation, updateReservation, removeReservation, setRescheduleModal, showToast } = useApp();
  const [contactModal, setContactModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAddReservationForm, setShowAddReservationForm] = useState(false);
  const [newReservation, setNewReservation] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2 People',
    occasion: 'Regular Dining',
    notes: '',
  });

  const handleAttendance = (id, val) => {
    updateReservation(id, { attendance: val });
    showToast(`Attendance marked: ${val}`, 'success');
  };

  const handleStatus = (id, status) => {
    updateReservation(id, { status });
    showToast(`Reservation ${id} marked as ${status}.`, status === 'unavailable' ? 'error' : 'success');
  };

  const confirmRemove = () => {
    if (!deleteTarget) return;
    removeReservation(deleteTarget.id);
    setDeleteTarget(null);
    showToast('Reservation removed.', '');
  };

  const nr = (k) => ({
    value: newReservation[k],
    onChange: (e) => setNewReservation(prev => ({ ...prev, [k]: e.target.value })),
  });

  const handleAddReservation = () => {
    if (!newReservation.name.trim() || !newReservation.phone.trim() || !newReservation.email.trim() || !newReservation.date || !newReservation.time) {
      showToast('Name, phone, email, date and time are required.', 'error');
      return;
    }

    addReservation({
      name: newReservation.name.trim(),
      phone: newReservation.phone.trim(),
      email: newReservation.email.trim(),
      date: newReservation.date,
      time: newReservation.time,
      guests: newReservation.guests,
      occasion: newReservation.occasion,
      notes: newReservation.notes.trim(),
    });
    setNewReservation({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      guests: '2 People',
      occasion: 'Regular Dining',
      notes: '',
    });
    setShowAddReservationForm(false);
    showToast('Reservation added successfully.', 'success');
  };

  return (
    <div>
      <div className="admin-head-row">
        <div>
          <div className="admin-page-title">Reservations</div>
          <div className="admin-page-sub">Manage table bookings and attendance</div>
        </div>
        <button
          className="admin-add-btn admin-add-toggle-btn"
          onClick={() => setShowAddReservationForm(true)}
        >
          + Make Reservation
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Guest</th><th>Date & Time</th><th>Guests</th>
              <th>Status</th><th>Attendance</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => {
              const attObj = ATTENDANCE_OPTIONS.find(a => a.value === r.attendance);
              return (
                <tr key={r.id} className="reservation-row">
                  <td data-label="ID">
                    <span className="reservation-id">{r.id}</span>
                  </td>
                  <td data-label="Guest">
                    <div className="reservation-guest">
                      <div className="reservation-guest-name">{r.name}</div>
                      <div className="reservation-guest-occasion">{r.occasion}</div>
                    </div>
                  </td>
                  <td data-label="Date & Time">
                    <div className="reservation-datetime">
                      <div className="reservation-date">{r.date}</div>
                      <div className="reservation-time">{r.time}</div>
                    </div>
                  </td>
                  <td data-label="Guests">
                    <span className="reservation-guests">{r.guests}</span>
                  </td>
                  <td data-label="Status">
                    <button
                      className={`status-toggle-btn status-${r.status === 'confirmed' ? 'confirmed' : 'unavailable'}`}
                      onClick={() => handleStatus(r.id, r.status === 'confirmed' ? 'unavailable' : 'confirmed')}
                    >
                      {r.status === 'confirmed' ? 'CONFIRMED' : 'UNAVAILABLE'}
                    </button>
                  </td>
                  <td data-label="Attendance">
                    <div className="reservation-attendance">
                    {r.attendance ? (
                      <span className={`attendance-badge ${attObj?.cls || 'att-none'}`}>{attObj?.label || r.attendance}</span>
                    ) : (
                      <span className="attendance-badge att-none">— Not set</span>
                    )}
                    <div className="reservation-attendance-control">
                      <select
                        className="att-select"
                        value={r.attendance || ''}
                        onChange={e => handleAttendance(r.id, e.target.value)}
                      >
                        <option value="">Mark attendance</option>
                        {ATTENDANCE_OPTIONS.map(a => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </div>
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="reservation-actions">
                      <div className="reservation-action-stack">
                        <button className="admin-action-btn primary" onClick={() => setContactModal(r)}>👁 Contact</button>
                        <button className="admin-action-btn neutral" onClick={() => setRescheduleModal(r)}>📆 Reschedule</button>
                      </div>
                    </div>
                    <button
                      className="row-remove-icon"
                      type="button"
                      aria-label={`Remove ${r.name}`}
                      title="Remove reservation"
                      onClick={() => setDeleteTarget({ id: r.id, name: r.name })}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Contact Modal */}
      {contactModal && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setContactModal(null); }}>
          <div className="modal">
            <div className="modal-title">Guest Contact</div>
            <div className="modal-sub">{contactModal.id} · {contactModal.date} at {contactModal.time}</div>
            <div className="contact-card">
              {[['👤','Name', contactModal.name],['📞','Phone',contactModal.phone],['✉️','Email',contactModal.email],
                ['🪑','Guests',contactModal.guests],['🎉','Occasion',contactModal.occasion],
                ...(contactModal.notes ? [['📝','Notes',contactModal.notes]] : [])
              ].map(([icon, label, val]) => (
                <div className="contact-field" key={label}>
                  <span className="contact-field-icon">{icon}</span>
                  <div>
                    <div className="contact-field-label">{label}</div>
                    <div className="contact-field-val">{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setContactModal(null)}>Close</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { showToast(`Calling ${contactModal.name}...`, 'success'); setContactModal(null); }}>
                📞 Call Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reservation Modal */}
      {showAddReservationForm && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setShowAddReservationForm(false); }}>
          <div className="modal">
            <div className="modal-title">Make Reservation</div>
            <div className="modal-sub">Create a new booking from admin panel</div>

            <div className="admin-add-grid">
              <div>
                <label className="admin-label">Name *</label>
                <input className="admin-input" placeholder="Guest name" {...nr('name')} />
              </div>
              <div>
                <label className="admin-label">Phone *</label>
                <input className="admin-input" placeholder="+91 XXXXX XXXXX" {...nr('phone')} />
              </div>
              <div>
                <label className="admin-label">Email *</label>
                <input className="admin-input" type="email" placeholder="guest@email.com" {...nr('email')} />
              </div>
              <div>
                <label className="admin-label">Date *</label>
                <input className="admin-input" type="date" {...nr('date')} />
              </div>
              <div>
                <label className="admin-label">Time *</label>
                <select className="admin-input" {...nr('time')}>
                  <option value="">Select time</option>
                  {['11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','03:00 PM',
                    '06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM']
                    .map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Guests</label>
                <select className="admin-input" {...nr('guests')}>
                  {['1 Person', '2 People', '3 People', '4 People', '5 People', '6 People', '7 People', '8 People', '9 People', '10+ People']
                    .map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Occasion</label>
                <select className="admin-input" {...nr('occasion')}>
                  {['Regular Dining', 'Birthday', 'Anniversary', 'Family Gathering', 'Business Dinner', 'Other']
                    .map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="span2">
                <label className="admin-label">Notes</label>
                <input className="admin-input" placeholder="Any special request..." {...nr('notes')} />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddReservationForm(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAddReservation}>
                + Add Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal">
            <div className="modal-title">Delete Reservation</div>
            <div className="modal-sub">Are you sure to delete the reservation for <strong>{deleteTarget.name}</strong>?</div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>No</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={confirmRemove}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Menu Management ───────────────────────────────────────────
function MenuManagement() {
  const { menuData, addMenuItem, removeMenuItem, updateMenuItem, showToast } = useApp();
  const [form, setForm] = useState({ name: '', price: '', cat: 'kerala', type: 'veg', desc: '', img: '', imgMode: 'url' });
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', cat: 'kerala', type: 'veg', desc: '', img: '', imgMode: 'url' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.price) { showToast('Name and price are required.', 'error'); return; }
    addMenuItem({ ...form, price: parseInt(form.price), img: form.img || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' });
    setForm({ name: '', price: '', cat: 'kerala', type: 'veg', desc: '', img: '', imgMode: 'url' });
    setShowAddForm(false);
    showToast(`"${form.name}" added to menu! 🎉`, 'success');
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) });
  const ef = (k) => ({ value: editForm[k], onChange: e => setEditForm(p => ({ ...p, [k]: e.target.value })) });

  const handleStartEdit = (item) => {
    setEditItem(item);
    setEditForm({
      name: item.name || '',
      price: item.price || '',
      cat: item.cat || 'kerala',
      type: item.type || 'veg',
      desc: item.desc || '',
      img: item.img || '',
      imgMode: 'url',
    });
  };

  const handleEditFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditForm(prev => ({ ...prev, img: String(reader.result || ''), imgMode: 'file' }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, img: String(reader.result || ''), imgMode: 'file' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    if (!editItem) return;
    if (!editForm.name || !editForm.price) { showToast('Name and price are required.', 'error'); return; }
    updateMenuItem(editItem.id, {
      name: editForm.name.trim(),
      price: parseInt(editForm.price),
      cat: editForm.cat,
      type: editForm.type,
      desc: editForm.desc.trim(),
      img: editForm.img || editItem.img,
    });
    showToast(`"${editForm.name}" updated.`, 'success');
    setEditItem(null);
  };

  return (
    <div>
      <div className="admin-head-row">
        <div>
          <div className="admin-page-title">Menu Management</div>
          <div className="admin-page-sub">Add or remove menu items</div>
        </div>
        <button
          className="admin-add-btn admin-add-toggle-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Item
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Action</th></tr></thead>
          <tbody>
            {menuData.map(item => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_MENU_IMG;
                    }}
                  />
                </td>
                <td><strong>{item.name}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.desc?.substring(0, 50)}...</span></td>
                <td><span style={{ textTransform: 'capitalize' }}>{item.cat}</span></td>
                <td style={{ fontWeight: 700, color: 'var(--spice)' }}>₹{item.price}</td>
                <td><span className={`menu-card-badge ${item.type === 'veg' ? 'veg' : ''}`} style={{ position: 'static' }}>{item.type}</span></td>
                <td>
                  <button className="admin-action-btn neutral" onClick={() => handleStartEdit(item)}>Edit</button>
                  <button className="admin-action-btn alert" onClick={() => { removeMenuItem(item.id); showToast('Item removed.', ''); }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editItem && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setEditItem(null); }}>
          <div className="modal">
            <div className="modal-title">Edit Menu Item</div>
            <div className="modal-sub">{editItem.name}</div>

            <div className="admin-edit-grid">
              <div>
                <label className="admin-label">Name *</label>
                <input className="admin-input" placeholder="Dish name" {...ef('name')} />
              </div>
              <div>
                <label className="admin-label">Price (₹) *</label>
                <input className="admin-input" type="number" placeholder="150" {...ef('price')} />
              </div>
              <div>
                <label className="admin-label">Category</label>
                <select className="admin-input" {...ef('cat')}>
                  {['kerala','chinese','south-indian','beverages','desserts'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Type</label>
                <select className="admin-input" {...ef('type')}>
                  <option value="veg">Veg</option><option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div className="span2">
                <label className="admin-label">Description</label>
                <textarea className="admin-input admin-textarea" placeholder="Short description" {...ef('desc')} />
              </div>

              <div>
                <label className="admin-label">Image Source</label>
                <div className="img-source-switch">
                  <button
                    type="button"
                    className={`img-source-btn ${editForm.imgMode === 'url' ? 'active' : ''}`}
                    onClick={() => setEditForm(prev => ({ ...prev, imgMode: 'url' }))}
                  >
                    Online URL
                  </button>
                  <button
                    type="button"
                    className={`img-source-btn ${editForm.imgMode === 'file' ? 'active' : ''}`}
                    onClick={() => setEditForm(prev => ({ ...prev, imgMode: 'file' }))}
                  >
                    Local Upload
                  </button>
                </div>
              </div>

              {editForm.imgMode === 'url' ? (
                <div>
                  <label className="admin-label">Image URL</label>
                  <input className="admin-input" placeholder="https://..." {...ef('img')} />
                </div>
              ) : (
                <div>
                  <label className="admin-label">Upload Image</label>
                  <input
                    className="admin-input"
                    type="file"
                    accept="image/*"
                    onChange={e => handleEditFile(e.target.files?.[0])}
                  />
                </div>
              )}

              {editForm.img && (
                <div className="edit-img-preview-wrap span2">
                  <button
                    type="button"
                    className="edit-img-remove-btn"
                    aria-label="Remove picture"
                    title="Remove picture"
                    onClick={() => setEditForm(prev => ({ ...prev, img: '' }))}
                  >
                    ×
                  </button>
                  <img src={editForm.img} alt="Preview" className="edit-img-preview" />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setShowAddForm(false); }}>
          <div className="modal menu-add-modal">
            <div className="modal-title">Add New Item</div>
            <div className="modal-sub">Create a new menu item</div>

            <div className="admin-add-grid menu-add-grid">
              <div><label className="admin-label">Name *</label><input className="admin-input" placeholder="Dish name" {...f('name')} /></div>
              <div><label className="admin-label">Price (₹) *</label><input className="admin-input" type="number" placeholder="150" {...f('price')} /></div>
              <div>
                <label className="admin-label">Category</label>
                <select className="admin-input" {...f('cat')}>
                  {['kerala','chinese','south-indian','beverages','desserts'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Type</label>
                <select className="admin-input" {...f('type')}>
                  <option value="veg">Veg</option><option value="non-veg">Non-Veg</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Image Source</label>
                <div className="img-source-switch">
                  <button
                    type="button"
                    className={`img-source-btn ${form.imgMode === 'url' ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, imgMode: 'url' }))}
                  >
                    Online URL
                  </button>
                  <button
                    type="button"
                    className={`img-source-btn ${form.imgMode === 'file' ? 'active' : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, imgMode: 'file' }))}
                  >
                    Local Upload
                  </button>
                </div>
              </div>

              {form.imgMode === 'url' ? (
                <div>
                  <label className="admin-label">Image URL</label>
                  <input className="admin-input" placeholder="https://..." {...f('img')} />
                </div>
              ) : (
                <div>
                  <label className="admin-label">Upload Image</label>
                  <input
                    className="admin-input"
                    type="file"
                    accept="image/*"
                    onChange={e => handleAddFile(e.target.files?.[0])}
                  />
                </div>
              )}

              <div className="span2">
                <label className="admin-label">Description</label>
                <input className="admin-input" placeholder="Short description" {...f('desc')} />
              </div>

              {form.img && (
                <div className="edit-img-preview-wrap span2">
                  <button
                    type="button"
                    className="edit-img-remove-btn"
                    aria-label="Remove picture"
                    title="Remove picture"
                    onClick={() => setForm(prev => ({ ...prev, img: '' }))}
                  >
                    ×
                  </button>
                  <img src={form.img} alt="Preview" className="edit-img-preview" />
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAdd}>
                + Add to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────
function Orders() {
  const { orders } = useApp();

  const getPaymentMethodLabel = (payment) => {
    if (payment === 'cash') return 'Cash on Delivery';
    if (payment === 'upi') return 'UPI / QR Code';
    if (payment === 'card') return 'Card Payment';
    return payment || 'Not specified';
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order.orderItems) && order.orderItems.length > 0) return order.orderItems;
    if (!order.items) return [];
    return order.items.split(', ').map((item, index) => {
      const [namePart, qtyPart] = item.split('×');
      const qty = Number(qtyPart) || 1;
      return { id: `${order.id}-${index}`, name: namePart, qty, lineTotal: null };
    });
  };

  return (
    <div>
      <div className="admin-page-title">Orders</div>
      <div className="admin-page-sub">Live and recent orders</div>

      {orders.length === 0 && (
        <div className="admin-empty-panel">No orders yet.</div>
      )}

      <div className="admin-order-list">
        {orders.map(o => {
          const items = getOrderItems(o);
          const isPaid = o.payment && o.payment !== 'cash';
          return (
            <article className="admin-order-card" key={o.id}>
              <div className="admin-order-head">
                <div>
                  <div className="admin-order-id">{o.id}</div>
                  <div className="admin-order-meta">{o.customer} · {o.phone || 'No phone'} · {o.time}</div>
                </div>
                <div className="admin-order-badges">
                  <span className={`admin-pay-badge ${isPaid ? 'paid' : 'cod'}`}>
                    {isPaid ? 'Paid' : 'Cash on Delivery'}
                  </span>
                  <span className="status-badge status-confirmed">Preparing</span>
                </div>
              </div>

              <div className="admin-order-items">
                {items.map(item => (
                  <div className="admin-order-item" key={item.id || `${o.id}-${item.name}`}>
                    <span>{item.name} × {item.qty}</span>
                    <span>{item.lineTotal != null ? `₹${item.lineTotal}` : '—'}</span>
                  </div>
                ))}
              </div>

              <div className="admin-order-foot">
                <div className="admin-order-pay-method">Payment Method: {getPaymentMethodLabel(o.payment)}</div>
                <div className="admin-order-total">Total: ₹{o.total}</div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ── Reviews ───────────────────────────────────────────────────
function AdminReviews() {
  const { reviews, removeReview, showToast } = useApp();
  return (
    <div>
      <div className="admin-page-title">Reviews</div>
      <div className="admin-page-sub">Moderate customer reviews</div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Customer</th><th>Rating</th><th>Review</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td><strong>{r.name}</strong></td>
                <td style={{ color: 'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                <td style={{ maxWidth: 220 }}>{r.text.substring(0, 80)}...</td>
                <td>{r.date}</td>
                <td><button className="admin-action-btn alert" onClick={() => { removeReview(r.id); showToast('Review removed.', ''); }}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Team Roles ───────────────────────────────────────────────
function TeamRoles() {
  const { authToken, showToast } = useApp();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [deletingId, setDeletingId] = useState('');
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', password: '', role: 'assistant' });
  const [addingMember, setAddingMember] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users || []);
      setRoles(data.roles || []);
    } catch (err) {
      showToast(err.message || 'Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [authToken]);

  const updateRole = async (id, accountType, role) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/users/${accountType}/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update role');
      await loadUsers();
      showToast('Role updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Role update failed.', 'error');
    } finally {
      setSavingId('');
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }
    setSavingId(editingUser.id);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.accountType}/${editingUser.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      await loadUsers();
      setEditingUser(null);
      showToast('Team member updated.', 'success');
    } catch (err) {
      showToast(err.message || 'Update failed.', 'error');
    } finally {
      setSavingId('');
    }
  };

  const removeUser = async (user) => {
    const ok = window.confirm(`Remove ${user.name} (${user.email})? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.accountType}/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to remove user');
      await loadUsers();
      showToast('Team member removed.', 'success');
    } catch (err) {
      showToast(err.message || 'Remove failed.', 'error');
    } finally {
      setDeletingId('');
    }
  };

  const teamRoles = roles.filter(r => r !== 'customer');
  const af = (k) => ({
    value: addForm[k],
    onChange: (e) => setAddForm(prev => ({ ...prev, [k]: e.target.value })),
  });

  const addTeamMember = async () => {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password.trim() || !addForm.role) {
      showToast('Name, email, password and role are required.', 'error');
      return;
    }

    setAddingMember(true);
    try {
      const res = await fetch('/api/admin/users/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: addForm.name.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone.trim(),
          password: addForm.password,
          role: addForm.role,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to add team member');
      await loadUsers();
      setAddForm({ name: '', email: '', phone: '', password: '', role: 'assistant' });
      setShowAddTeamForm(false);
      showToast('Team member added successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add team member.', 'error');
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <div>
      <div className="admin-head-row">
        <div>
          <div className="admin-page-title">Team Roles</div>
          <div className="admin-page-sub">Assign staff roles and control admin panel access</div>
        </div>
        <button
          className="admin-add-btn admin-add-toggle-btn"
          onClick={() => setShowAddTeamForm(true)}
        >
          + Add Team Member
        </button>
      </div>

      {loading ? (
        <div className="admin-empty-panel">Loading users...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    <select
                      className="admin-input"
                      value={u.role}
                      disabled={savingId === u.id}
                      onChange={e => updateRole(u.id, u.accountType, e.target.value)}
                    >
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <button
                      className="admin-action-btn neutral"
                      disabled={savingId === u.id || deletingId === u.id}
                      onClick={() => startEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-action-btn alert"
                      style={{ marginLeft: '0.4rem' }}
                      disabled={savingId === u.id || deletingId === u.id}
                      onClick={() => removeUser(u)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: '1.5rem' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setEditingUser(null); }}>
          <div className="modal">
            <div className="modal-title">Edit Team Member</div>
            <div className="modal-sub">{editingUser.role}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="admin-label">Name</label>
                <input
                  className="admin-input"
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input
                  className="admin-input"
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="admin-label">Phone</label>
                <input
                  className="admin-input"
                  value={editForm.phone}
                  onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddTeamForm && (
        <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setShowAddTeamForm(false); }}>
          <div className="modal">
            <div className="modal-title">Add Team Member</div>
            <div className="modal-sub">Create a new staff account</div>

            <div className="admin-add-grid">
              <div>
                <label className="admin-label">Name *</label>
                <input className="admin-input" placeholder="Full name" {...af('name')} />
              </div>
              <div>
                <label className="admin-label">Email *</label>
                <input className="admin-input" type="email" placeholder="email@example.com" {...af('email')} />
              </div>
              <div>
                <label className="admin-label">Phone</label>
                <input className="admin-input" placeholder="+91 XXXXX XXXXX" {...af('phone')} />
              </div>
              <div>
                <label className="admin-label">Password *</label>
                <input className="admin-input" type="password" placeholder="At least 8 characters" {...af('password')} />
              </div>
              <div>
                <label className="admin-label">Role *</label>
                <select className="admin-input" {...af('role')}>
                  {teamRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddTeamForm(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={addTeamMember} disabled={addingMember}>
                {addingMember ? 'Adding...' : '+ Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RescheduleModal ───────────────────────────────────────────
function RescheduleModal() {
  const { rescheduleModal, setRescheduleModal, updateReservation, showToast } = useApp();
  const [newDate, setNewDate] = useState(rescheduleModal?.date || '');
  const [newTime, setNewTime] = useState(rescheduleModal?.time || '');

  if (!rescheduleModal) return null;

  const handleSave = () => {
    if (!newDate || !newTime) { showToast('Please select a new date and time.', 'error'); return; }
    updateReservation(rescheduleModal.id, { date: newDate, time: newTime, status: 'pending', attendance: null });
    showToast(`Reservation ${rescheduleModal.id} rescheduled to ${newDate} at ${newTime}.`, 'success');
    setRescheduleModal(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setRescheduleModal(null); }}>
      <div className="modal">
        <div className="modal-title">Reschedule Reservation</div>
        <div className="modal-sub">{rescheduleModal.id} · {rescheduleModal.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label className="admin-label">New Date</label>
            <input className="admin-input" type="date" min={today} value={newDate} onChange={e => setNewDate(e.target.value)} />
          </div>
          <div>
            <label className="admin-label">New Time</label>
            <select className="admin-input" value={newTime} onChange={e => setNewTime(e.target.value)}>
              <option value="">Select time</option>
              {['11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','03:00 PM',
                '06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM']
                .map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setRescheduleModal(null)}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>📆 Save Reschedule</button>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminPage ────────────────────────────────────────────
export default function AdminPage({ adminOnly = false }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { rescheduleModal } = useApp();

  const getTabFromPath = (pathname) => {
    const path = String(pathname || '').toLowerCase();
    const match = path.match(/^\/admin\/?([^/?#]*)/);
    const route = match && match[1] ? match[1] : 'dashboard';
    return ADMIN_TAB_BY_ROUTE[route] || 'dashboard';
  };

  const getPathForTab = (tab) => `/admin/${ADMIN_ROUTE_BY_TAB[tab] || ADMIN_ROUTE_BY_TAB.dashboard}`;

  const navigateAdminTab = (tab, { replace = false } = {}) => {
    const safeTab = ADMIN_ROUTE_BY_TAB[tab] ? tab : 'dashboard';
    setActiveTab(safeTab);
    if (typeof window !== 'undefined') {
      const nextPath = getPathForTab(safeTab);
      if (window.location.pathname !== nextPath) {
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', nextPath);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const syncFromUrl = () => {
      const nextTab = getTabFromPath(window.location.pathname);
      setActiveTab(nextTab);
      const canonicalPath = getPathForTab(nextTab);
      if (window.location.pathname !== canonicalPath) {
        window.history.replaceState({}, '', canonicalPath);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const renderTabContent = () => {
    if (activeTab === 'dashboard') return <Dashboard onNavigate={navigateAdminTab} />;
    if (activeTab === 'reservations') return <Reservations />;
    if (activeTab === 'menu') return <MenuManagement />;
    if (activeTab === 'orders') return <Orders />;
    if (activeTab === 'reviews') return <AdminReviews />;
    return <TeamRoles />;
  };

  return (
    <div className={`admin-page ${adminOnly ? 'admin-only' : ''}`}>
      <div className={`admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="admin-sidebar-header">
            <div className="admin-sidebar-title">
              <img className="admin-sidebar-logo" src="/venice-logo.png" alt="The Venice Food Hub" />
              <span className="admin-sidebar-title-text">Admin Panel</span>
            </div>
            <button
              className="admin-sidebar-toggle"
              type="button"
              onClick={() => setIsSidebarCollapsed(v => !v)}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
          </div>
          {TABS.map(t => (
            <button
              key={t.key}
              className={`admin-nav-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => navigateAdminTab(t.key)}
              title={isSidebarCollapsed ? t.label : undefined}
            >
              <span className="admin-nav-icon">{t.icon}</span>
              <span className="admin-nav-label">{t.label}</span>
            </button>
          ))}
        </aside>
        <main className="admin-content">
          {renderTabContent()}
        </main>
      </div>
      {rescheduleModal && <RescheduleModal />}
    </div>
  );
}
