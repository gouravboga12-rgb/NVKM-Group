import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');

  const categoryQuery = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    // We can fetch all products and filter client-side for instant interaction
    api.get('/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categoryFilters = ['All', 'Fruits and Vegetable powder', 'Pooja Accessories'];

  const getCategoryGroup = (category) => {
    if (!category) return 'All';
    const cat = category.toLowerCase();
    if (cat === 'pooja accessories') {
      return 'Pooja Accessories';
    }
    if (cat === 'all') {
      return 'All';
    }
    return 'Fruits and Vegetable powder';
  };

  const handleCategoryFilter = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (val) => {
    const params = new URLSearchParams(searchParams);
    if (!val) {
      params.delete('q');
    } else {
      params.set('q', val);
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const resetFilters = () => {
    setSearchParams({});
    setSortBy('default');
  };

  // Filter and sort products
  let filtered = [...products];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.ingredients.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (categoryQuery && categoryQuery !== 'All') {
    filtered = filtered.filter(p => {
      if (categoryQuery !== 'Fruits and Vegetable powder' && categoryQuery !== 'Pooja Accessories') {
        return p.category === categoryQuery;
      }
      return getCategoryGroup(p.category) === categoryQuery;
    });
  }

  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.variations[0]?.discountPrice - b.variations[0]?.discountPrice);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.variations[0]?.discountPrice - a.variations[0]?.discountPrice);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  useEffect(() => {
    if (!loading && window.AOS) {
      setTimeout(() => {
        window.AOS.init({
          duration: 800,
          easing: 'ease-out-cubic',
          once: true
        });
        window.AOS.refresh();
      }, 100);
    }
  }, [loading, filtered.length]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 page-transition">
      <div className="text-left space-y-2 mb-10" data-aos="fade-right">
        <span className="text-xs font-bold text-accent tracking-widest uppercase">Pure & Organic</span>
        <h1 className="font-heading font-extrabold text-4xl text-darkText tracking-tight">Shop Organic Powders</h1>
        <div className="h-1 w-12 bg-accent rounded-full mt-2"></div>
        <p className="text-sm text-slate-500 max-w-2xl pt-1">Search and filter our natural, nutrient-dense manufacturing powder stock. Preservative-free products direct from Bathalapalli.</p>
      </div>

      {/* Search, Sorting & Categories Toolbar */}
      <div className="glass-premium rounded-[20px] sm:rounded-[32px] p-4 sm:p-6 shadow-md border border-slate-200/60 space-y-6 mb-10" data-aos="fade-up">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Text Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search product name, ingredients, categories..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all shadow-inner font-medium"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-4 text-slate-400 text-sm"></i>
          </div>

          {/* Sorting selection */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap uppercase tracking-wider">Sort By:</span>
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full sm:w-auto bg-slate-50/80 border border-slate-200 py-3 pl-4 pr-10 rounded-2xl text-sm text-darkText focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="default">Featured / Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating Score</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-slate-400 text-xs pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="border-t border-slate-100 pt-5">
          <span className="block text-xs font-bold text-darkText mb-3 uppercase tracking-wider">Filter by Category:</span>
          
          {/* Dropdown for mobile */}
          <div className="block sm:hidden relative">
            <select
              value={categoryFilters.includes(categoryQuery) ? categoryQuery : getCategoryGroup(categoryQuery)}
              onChange={e => handleCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-4 pr-10 rounded-2xl text-xs font-bold text-darkText focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all appearance-none cursor-pointer"
            >
              {categoryFilters.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'Show All Categories' : cat}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
          </div>

          {/* Horizontal buttons for desktop/tablet */}
          <div className="hidden sm:flex overflow-x-auto pb-2 scrollbar-none gap-2.5 sm:flex-wrap">
            {categoryFilters.map(cat => {
              const isActive = categoryQuery === cat || (cat === getCategoryGroup(categoryQuery));
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-95 shrink-0 sm:shrink-1 ${isActive
                      ? 'bg-gradient-to-r from-primary to-blue-800 text-white shadow-md shadow-blue-900/20 scale-[1.02] border-transparent'
                      : 'bg-white hover:bg-blue-50/50 hover:text-primary hover:border-blue-200 text-slate-650 border border-slate-200 hover:scale-[1.01]'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <i className="fa-solid fa-hourglass-empty text-5xl text-slate-300 mb-4"></i>
          <h3 className="font-heading font-bold text-lg text-slate-500">No Powders Match Your Query!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Try clearing your filters or checking your spelling to explore other categories.</p>
          <button onClick={resetFilters} className="mt-6 bg-primary hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-card-grid">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
