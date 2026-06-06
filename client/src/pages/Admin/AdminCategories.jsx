import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [categoryName, setCategoryName] = useState('');
  const [editingName, setEditingName] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/categories');
      setCategories(data);
    } catch (err) {
      showToast('Could not load categories list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showToast('Category name is required.', 'warning');
      return;
    }

    try {
      const { data } = await api.post('/admin/categories', { name: categoryName });
      showToast(data.message || 'Category created successfully!');
      setShowAddModal(false);
      setCategoryName('');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create category.', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) {
      showToast('Category name is required.', 'warning');
      return;
    }

    try {
      const { data } = await api.put(`/admin/categories/${selectedCategory.id}`, { name: editingName });
      showToast(data.message || 'Category updated successfully!');
      setShowEditModal(false);
      setSelectedCategory(null);
      setEditingName('');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update category.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? This will not delete the products belonging to it, but you will need to assign them to another category.`)) return;

    try {
      const { data } = await api.delete(`/admin/categories/${id}`);
      showToast(data.message || 'Category deleted.');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category.', 'error');
    }
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setEditingName(cat.name);
    setShowEditModal(true);
  };

  // Filter categories locally
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 page-transition">
      
      {/* ── HEADER TOOLBAR ── */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-slate-800 text-sm">Product Categories</h2>
          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1 font-sans">Organize catalog items</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-5 py-3 rounded-2xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/10"
        >
          <i className="fa-solid fa-plus-circle"></i> Add New Category
        </button>
      </div>

      {/* ── SEARCH & STATS BAR ── */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by category name or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-4 text-slate-400 text-xs"></i>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            {filtered.length} Categor{filtered.length !== 1 ? 'ies' : 'y'} listed
          </span>
        </div>
      </div>

      {/* ── CATEGORIES TABLE ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <i className="fa-solid fa-tags text-slate-355 text-4xl mb-4" />
          <h4 className="font-heading font-black text-slate-700 text-base">No Categories Found</h4>
          <p className="text-[11px] text-slate-400 mt-1">Create a new category using the button above to begin.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Category ID / Slug</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Category Name */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-heading font-extrabold text-sm shrink-0">
                          <i className="fa-solid fa-tag text-xs" />
                        </div>
                        <span className="text-xs font-black text-slate-800 tracking-wide">{c.name}</span>
                      </div>
                    </td>

                    {/* Category ID */}
                    <td className="px-6 py-5 whitespace-nowrap text-xs font-mono text-slate-400">
                      {c.id}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-bold space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        <i className="fa-solid fa-pencil mr-1"></i> Rename
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        <i className="fa-solid fa-trash-can mr-1"></i> Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ADD CATEGORY MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-[scaleIn_0.25s_ease-out] z-10 border border-slate-100">
            <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-slate-900 text-sm">Add New Product Category</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Create a new container label for products</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 text-slate-700">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  placeholder="e.g. Spices, Dehydrated Fruits"
                  className="w-full bg-slate-50 border border-slate-250 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-500 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT CATEGORY MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-[scaleIn_0.25s_ease-out] z-10 border border-slate-100">
            <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-slate-900 text-sm">Rename Product Category</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Modifying category container label</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 text-slate-700">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  placeholder="e.g. Spices, Dehydrated Fruits"
                  className="w-full bg-slate-50 border border-slate-255 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-500 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
