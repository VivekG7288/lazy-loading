import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const perPage = 10;
  const containerRef = useRef(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_start=${images.length}&_limit=${perPage}`
      );
      const data = await response.json();
      setImages((prevImages) => [...prevImages, ...data]);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollHeight - scrollTop === clientHeight && !loading) {
        fetchImages();
      }
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <h1>Image Gallery</h1>
      <div className="image-container" ref={containerRef}>
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.url} alt={image.title} className="gallery-image" />
            <p>{image.title}</p>
          </div>
        ))}
        {loading && <p className="loading-message">Loading...</p>}
      </div>
    </div>
  );
};

export default App;
