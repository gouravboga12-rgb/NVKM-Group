import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <div className="star-rating text-sm">
      <div className="star-rating-lower"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
      <div className="star-rating-upper" style={{ width: `${(rating / 5) * 100}%` }}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
    </div>
  );
}

export { StarRating };

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const defaultVar = product.variations[0];
  if (!defaultVar) return null;

  const wishlisted = isWishlisted(product.id);
  const savePercent = Math.round(((defaultVar.price - defaultVar.discountPrice) / defaultVar.price) * 100);

  const imagesList = (product.images && product.images.length > 0) ? product.images : [product.image];

  const handleBuyNow = () => {
    const success = addToCart(product, defaultVar.weight, 1, true);
    if (success) {
      setCartOpen(true);
    }
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const waUrl = `https://wa.me/9014274293?text=Hello%20NVKM%20GROUP,%20I%20am%20interested%20in%20purchasing%20your%20natural%20powder:%20${encodeURIComponent(product.name)}%20(${defaultVar.weight}%20size).%20Please%20provide%20rates.`;

  return (
    <div className="product-card glass-premium rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between" data-aos="fade-up">
      <div className="relative product-card-img-container aspect-square bg-slate-50/50 flex items-center justify-center group">
        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-20 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-primary text-white text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">{product.badge}</span>
          )}
          {savePercent > 0 && (
            <span className="bg-red-500 text-white text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm">Save {savePercent}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-20 w-7 h-7 sm:w-9 sm:h-9 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm border border-slate-100 transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Add to Wishlist">
          <i className={`${wishlisted ? 'fa-solid fa-heart text-red-500 animate-[pulse-ring_1.5s_infinite]' : 'fa-regular fa-heart'} text-xs sm:text-sm`}></i>
        </button>

        {/* Image */}
        <Link to={`/products/${product.id}`} className="w-full h-full block">
          <img src={imagesList[activeImgIdx]} alt={product.name} className="product-card-img cursor-pointer animate-[fadeIn_0.3s_ease]" />
        </Link>

        {/* Image Navigation Controls */}
        {imagesList.length > 1 && (
          <>
            {/* Left/Right Arrows */}
            <button 
              onClick={handlePrevImage} 
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform active:scale-90"
              aria-label="Previous Image"
            >
              <i className="fa-solid fa-chevron-left text-[9px]"></i>
            </button>
            <button 
              onClick={handleNextImage} 
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md flex items-center justify-center border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform active:scale-90"
              aria-label="Next Image"
            >
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </button>

            {/* Pagination Dots */}
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-0.5 px-2 py-1 rounded-full bg-black/25 backdrop-blur-md transition-opacity duration-300"
              onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            >
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImgIdx(idx); }}
                  onMouseEnter={() => setActiveImgIdx(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeImgIdx === idx 
                      ? 'w-3 bg-white' 
                      : 'w-1 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hover highlight overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-2.5 xs:p-3 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[8px] sm:text-[9px] font-extrabold text-accent tracking-widest uppercase">{product.category}</span>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-heading font-extrabold text-xs sm:text-base text-darkText mt-0.5 sm:mt-1 hover:text-primary cursor-pointer line-clamp-1 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center space-x-1 mt-1">
            <StarRating rating={product.rating} />
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">{product.rating}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed hidden sm:block">{product.shortDesc}</p>
        </div>

        <div>
          <div className="mt-2.5 sm:mt-4 flex items-baseline gap-1 bg-slate-50/70 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-100/50">
            <span className="text-sm sm:text-lg font-heading font-extrabold text-primary">₹{defaultVar.discountPrice}</span>
            {savePercent > 0 && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">₹{defaultVar.price}</span>
            )}
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-extrabold ml-auto bg-slate-200/50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded">{defaultVar.weight}</span>
          </div>

          <div className="mt-2 sm:mt-4 space-y-2">
            <button 
              onClick={() => addToCart(product, defaultVar.weight)} 
              className="w-full bg-primary hover:bg-blue-900 text-white font-extrabold text-[10px] sm:text-xs py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <i className="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <div className="hidden sm:grid grid-cols-2 gap-2">
              <button 
                onClick={handleBuyNow} 
                className="bg-accent hover:bg-accentHover text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-accent/10 hover:shadow-accent/25"
              >
                <i className="fa-solid fa-bolt"></i> Buy Now
              </button>
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-blue-50/60 hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-100 hover:border-transparent font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i> Inquire
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
