// src/components/GallerySection.js
import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function GallerySection() {
  const { gallery, addPhoto, showToast } = useApp();
  const fileRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1 }
    );

    document.querySelectorAll('.gallery-section .fade-in-up:not(.visible)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addPhoto({ id: 'g' + Date.now(), src: ev.target.result, credit: file.name.split('.')[0] });
      showToast('Photo uploaded to gallery! 📸', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <section className="section gallery-section" id="gallery">
      <div className="section-inner">
        <div className="fade-in-up">
          <div className="section-label">Our Moments</div>
          <h2 className="section-title">Food <em>Gallery</em></h2>
          <p className="section-desc">A visual feast — snapshots from our kitchen, our tables, and our community.</p>
        </div>

        <div className="gallery-upload-row">
          <button
            type="button"
            className="gallery-upload-btn"
            onClick={() => fileRef.current?.click()}
          >
            Upload a Photo
          </button>
          <input
            ref={fileRef}
            className="gallery-file-input-hidden"
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
