// src/components/GallerySection.js
import React from 'react';
import { useApp } from '../context/AppContext';

export default function GallerySection() {
  const { gallery, addPhoto, showToast } = useApp();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addPhoto({ id: 'g' + Date.now(), src: ev.target.result, credit: file.name.split('.')[0] });
      showToast('Photo uploaded to gallery! 📸', 'success');
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="section gallery-section" id="gallery">
      <div className="section-inner">
        <div className="fade-in-up">
          <div className="section-label">Our Moments</div>
          <h2 className="section-title">Food <em>Gallery</em></h2>
          <p className="section-desc">A visual feast — snapshots from our kitchen, our tables, and our community.</p>
        </div>

        <div className="gallery-upload-area">
          <div className="gallery-upload-icon">📷</div>
          <div className="gallery-upload-text">
            <strong>Click to upload</strong> or drag & drop your food photos here
          </div>
          <input
            className="gallery-file-input"
            type="file"
            accept="image/*"
            onChange={handleUpload}
          />
        </div>

        <div className="gallery-grid">
          {gallery.map(photo => (
            <div className="gallery-item" key={photo.id}>
              <img src={photo.src} alt={photo.credit} />
              <div className="gallery-item-overlay">
                <span className="gallery-item-credit">{photo.credit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
