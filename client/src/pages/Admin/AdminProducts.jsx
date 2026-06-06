import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/admin/categories');
      setCategories(data);
    } catch (err) {
      console.error('Could not fetch categories list:', err);
    }
  };

  // Cloudinary Configurations
  const cloudinaryCloudName = 'dhsob7dax';
  const cloudinaryUploadPreset = 'nvkm_preset';

  // Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shortDesc: '',
    longDesc: '',
    ingredients: '',
    usage: '',
    image: '',
    images: [],
    badge: '',
    deliveryCharges: '0',
    customFields: {},
    variations: [{ weight: '250g', price: '', discountPrice: '' }]
  });

  const [customFieldsList, setCustomFieldsList] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      showToast('Could not load products inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (searchParams.get('action') === 'add') {
      openAddModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Open modal for adding a product
  const openAddModal = () => {
    setFormData({
      name: '',
      category: '',
      shortDesc: '',
      longDesc: '',
      ingredients: '',
      usage: '',
      image: '',
      images: [],
      badge: '',
      deliveryCharges: '0',
      customFields: {},
      variations: [{ weight: '250g', price: '', discountPrice: '' }]
    });
    setCustomFieldsList([]);
    setIsEditing(false);
    setSelectedSlug(null);
    setShowModal(true);
    fetchCategories();
  };

  // Open modal for editing a product
  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      shortDesc: product.shortDesc,
      longDesc: product.longDesc,
      ingredients: product.ingredients || '',
      usage: product.usage || '',
      image: product.image,
      images: product.images || [product.image],
      badge: product.badge || '',
      deliveryCharges: product.deliveryCharges !== undefined ? String(product.deliveryCharges) : '0',
      customFields: product.customFields || {},
      variations: product.variations.length > 0 
        ? product.variations.map(v => ({ weight: v.weight, price: v.price, discountPrice: v.discountPrice }))
        : [{ weight: '250g', price: '', discountPrice: '' }]
    });
    setCustomFieldsList(Object.keys(product.customFields || {}).map(k => ({ key: k, value: product.customFields[k] })));
    setIsEditing(true);
    setSelectedSlug(product.id); // product.id corresponds to slug in backend shape
    setShowModal(true);
    fetchCategories();
  };

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Variations List management
  const handleVariationChange = (index, field, value) => {
    const updated = [...formData.variations];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, variations: updated }));
  };

  const addVariationRow = () => {
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, { weight: '', price: '', discountPrice: '' }]
    }));
  };

  const removeVariationRow = (index) => {
    if (formData.variations.length === 1) {
      showToast('At least one product variation weight option is required.', 'warning');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  // Cloudinary Direct Upload Handler (multiple files support)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate size (max 5MB) for all files
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Image "${file.name}" exceeds 5MB size limit.`, 'error');
        return;
      }
    }

    setUploadingImage(true);
    const uploadedUrls = [...(formData.images || [])];

    try {
      for (const file of files) {
        const uploadForm = new FormData();
        uploadForm.append('file', file);
        uploadForm.append('upload_preset', cloudinaryUploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
          method: 'POST',
          body: uploadForm
        });

        const uploadResult = await res.json();
        if (uploadResult.secure_url) {
          uploadedUrls.push(uploadResult.secure_url);
        } else {
          throw new Error(uploadResult.error?.message || 'Upload failed');
        }
      }

      setFormData(prev => ({
        ...prev,
        images: uploadedUrls,
        image: prev.image || uploadedUrls[0] || '' // Set first image as main if not already set
      }));
      showToast('All images uploaded successfully!');
    } catch (err) {
      showToast(`Cloudinary upload failed: ${err.message}`, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Product Add/Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.image && (!formData.images || formData.images.length === 0)) {
      showToast('Please upload at least one product image.', 'warning');
      return;
    }

    // Format variations to numbers
    const cleanVariations = formData.variations.map(v => ({
      weight: v.weight.trim(),
      price: parseFloat(v.price),
      discountPrice: parseFloat(v.discountPrice || v.price)
    }));

    if (cleanVariations.some(v => isNaN(v.price) || v.price <= 0)) {
      showToast('All variations must have a valid positive pricing amount.', 'warning');
      return;
    }

    // Process custom fields list to object
    const customFieldsObj = {};
    customFieldsList.forEach(item => {
      if (item.key.trim()) {
        customFieldsObj[item.key.trim()] = item.value.trim();
      }
    });

    const submissionPayload = {
      ...formData,
      variations: cleanVariations,
      deliveryCharges: parseFloat(formData.deliveryCharges) || 0,
      customFields: customFieldsObj,
      // Fallback images array
      images: formData.images.length > 0 ? formData.images : [formData.image || '']
    };

    try {
      if (isEditing) {
        const { data: res } = await api.put(`/admin/products/${selectedSlug}`, submissionPayload);
        showToast(res.message || 'Product updated successfully!');
      } else {
        const { data: res } = await api.post('/admin/products', submissionPayload);
        showToast(res.message || 'Product added successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving product.', 'error');
    }
  };

  // Delete product
  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${name}" from stock? This will delete all its reviews and pricing packages permanently.`)) return;

    try {
      const { data } = await api.delete(`/admin/products/${slug}`);
      showToast(data.message || 'Product deleted.');
      fetchProducts();
    } catch (err) {
      showToast('Failed to delete product.', 'error');
    }
  };

  // Categories fetched from server

  return (
    <div className="space-y-6 page-transition">
      
      {/* ── HEADER TOOLBAR ── */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-slate-800 text-sm">Product Inventory Catalog</h2>
          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1">Manage items, prices, and wicks</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-5 py-3 rounded-2xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/10"
        >
          <i className="fa-solid fa-circle-plus"></i> Add New Product
        </button>
      </div>

      {/* ── PRODUCTS TABLE GRID ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-3xl">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <i className="fa-solid fa-boxes-stacked text-slate-350 text-4xl mb-4" />
          <h4 className="font-heading font-black text-slate-700 text-base">Inventory is Empty</h4>
          <p className="text-[11px] text-slate-400 mt-1">Add your first organic powder or puja accessory to populate the shop catalog.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Slug Name</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pricing variations</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Rating Status</th>
                  <th className="px-6 py-4 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image || '/logo.png'}
                          alt={p.name}
                          onError={e => { e.target.src = '/logo.png'; }}
                          className="w-11 h-11 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-extrabold text-slate-800 leading-tight truncate max-w-[200px]">{p.name}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {p.badge && (
                              <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {p.badge}
                              </span>
                            )}
                            <span className={`inline-block border text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${p.deliveryCharges > 0 ? 'bg-slate-50 text-slate-550 border-slate-200' : 'bg-green-50 text-green-600 border-green-100'}`}>
                              {p.deliveryCharges > 0 ? `Delivery: ₹${p.deliveryCharges}` : 'Free Delivery'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-400">
                      {p.id}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">{p.category}</span>
                    </td>

                    {/* Variations Pricing Preview */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                        {p.variations.map((v, i) => (
                          <span key={i} className="text-[9px] bg-slate-100/70 border border-slate-200/60 rounded-lg px-2 py-0.5 font-bold text-slate-700">
                            {v.weight}: ₹{v.discountPrice} {v.price > v.discountPrice && <span className="line-through text-slate-400 font-normal ml-0.5">₹{v.price}</span>}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Rating & Reviews */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1">
                        <i className="fa-solid fa-star text-[10px]"></i> {p.rating.toFixed(1)}
                        <span className="text-[10px] text-slate-400 font-bold font-sans">({p.reviewsCount} reviews)</span>
                      </span>
                    </td>

                    {/* Edit & Delete Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        <i className="fa-solid fa-pencil mr-1"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
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

      {/* ── ADD/EDIT PRODUCT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"></div>
          
          <div className="relative bg-white w-full max-w-3xl rounded-[24px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-[scaleIn_0.25s_ease-out] z-10 border border-slate-100">
            {/* Modal Header */}
            <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-slate-900 text-base">{isEditing ? 'Modify Product Specifications' : 'Catalog New Product Entry'}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{isEditing ? 'Edit existing item properties' : 'Create a brand new catalog product'}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Modal Scroll Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-700">
              
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Product Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Organic Beetroot Powder"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Product Category *</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Short Description & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Short Tagline Description *</label>
                  <input
                    type="text"
                    required
                    name="shortDesc"
                    value={formData.shortDesc}
                    onChange={handleInputChange}
                    placeholder="A quick 1-sentence sales teaser description..."
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Product Display Badge (Optional)</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    placeholder="e.g., Bestseller, 15% OFF, Superfood, New"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Long Description */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Detailed Description *</label>
                <textarea
                  required
                  rows="4"
                  name="longDesc"
                  value={formData.longDesc}
                  onChange={handleInputChange}
                  placeholder="Detailed breakdown of the benefits, health aspects, and manufacturing processes..."
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Row 4: Delivery Charges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider">Delivery Charges (₹) *</label>
                  <input
                    type="number"
                    required
                    name="deliveryCharges"
                    value={formData.deliveryCharges}
                    onChange={handleInputChange}
                    placeholder="e.g., 50 (or 0 for free delivery)"
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Row 5: Multiple Cloudinary Images Upload */}
              <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-slate-50/20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Product Images Gallery</h4>
                    <p className="text-[9px] text-slate-400 font-bold">Upload one or multiple images. Choose one to be the main display thumbnail.</p>
                  </div>
                  <label className={`bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors text-center inline-block ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <i className="fa-solid fa-cloud-arrow-up mr-1"></i> Upload Image(s)
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {uploadingImage && (
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                    <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <span>Uploading files to Cloudinary... Please wait...</span>
                  </div>
                )}

                {(!formData.images || formData.images.length === 0) ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 bg-white">
                    <i className="fa-regular fa-image text-3xl mb-2 block"></i>
                    <span className="text-[10px] font-bold">No images uploaded yet.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {formData.images.map((imgUrl, idx) => {
                      const isMain = formData.image === imgUrl;
                      return (
                        <div key={idx} className={`relative rounded-xl overflow-hidden border bg-white aspect-square group transition-all ${isMain ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}>
                          <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                          
                          {/* Badge if main */}
                          {isMain && (
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              Main Display
                            </span>
                          )}

                          {/* Hover Overlay Controls */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => {
                                  const updatedImages = prev.images.filter((_, i) => i !== idx);
                                  return {
                                    ...prev,
                                    images: updatedImages,
                                    // If the removed image was the main display image, pick another or clear
                                    image: prev.image === imgUrl ? (updatedImages[0] || '') : prev.image
                                  };
                                });
                              }}
                              className="self-end bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                              title="Remove image"
                            >
                              <i className="fa-solid fa-trash-can text-[10px]" />
                            </button>
                            
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: imgUrl }))}
                                className="w-full bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-[9px] py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                              >
                                Set as Main
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Row 6: Custom Specification Fields */}
              <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-slate-50/20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Custom Specification Fields</h4>
                    <p className="text-[9px] text-slate-400 font-bold">Add extra details (e.g., Shelf Life: 6 Months, Storage: Store in dry place)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomFieldsList(prev => [...prev, { key: '', value: '' }])}
                    className="bg-slate-150 hover:bg-slate-250 text-slate-700 text-[10px] font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-slate-200"
                  >
                    <i className="fa-solid fa-plus-circle"></i> Add Custom Field
                  </button>
                </div>

                {customFieldsList.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No custom fields added yet. Add shelf life, origin, or other specific fields if required.</p>
                ) : (
                  <div className="space-y-3">
                    {customFieldsList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl animate-[fadeIn_0.2s_ease-out]">
                        <div className="flex-1">
                          <label className="block text-[8px] text-slate-400 font-extrabold uppercase mb-1">Field Name (Key)</label>
                          <input
                            type="text"
                            required
                            value={item.key}
                            onChange={e => {
                              const updated = [...customFieldsList];
                              updated[idx].key = e.target.value;
                              setCustomFieldsList(updated);
                            }}
                            placeholder="e.g., Shelf Life"
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[8px] text-slate-400 font-extrabold uppercase mb-1">Value</label>
                          <input
                            type="text"
                            required
                            value={item.value}
                            onChange={e => {
                              const updated = [...customFieldsList];
                              updated[idx].value = e.target.value;
                              setCustomFieldsList(updated);
                            }}
                            placeholder="e.g., 6 Months"
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomFieldsList(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-100 p-2.5 rounded-xl self-end cursor-pointer transition-colors"
                          title="Delete custom field"
                        >
                          <i className="fa-solid fa-trash-can text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 6: Dynamic Variations Builder */}
              <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Weights & Pricing Variations</h4>
                    <p className="text-[9px] text-slate-400 font-bold">Specify packaging weights (e.g. 250g, 1kg) and prices</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariationRow}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <i className="fa-solid fa-plus-circle"></i> Add Variant Option
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.variations.map((v, i) => (
                    <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-50/50 border border-slate-150 p-3 rounded-xl animate-[fadeIn_0.2s_ease-out]">
                      
                      {/* Weight Selector */}
                      <div className="flex-1 min-w-[80px]">
                        <label className="block text-[8px] text-slate-400 font-extrabold uppercase mb-1">Weight *</label>
                        <input
                          type="text"
                          required
                          value={v.weight}
                          onChange={e => handleVariationChange(i, 'weight', e.target.value)}
                          placeholder="e.g. 250g, 500g, Pack"
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      {/* Original Price */}
                      <div className="flex-1 min-w-[80px]">
                        <label className="block text-[8px] text-slate-400 font-extrabold uppercase mb-1">Original Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={v.price}
                          onChange={e => handleVariationChange(i, 'price', e.target.value)}
                          placeholder="Original MRP"
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      {/* Discount Price */}
                      <div className="flex-1 min-w-[80px]">
                        <label className="block text-[8px] text-slate-400 font-extrabold uppercase mb-1">Discount Price (₹)</label>
                        <input
                          type="number"
                          value={v.discountPrice}
                          onChange={e => handleVariationChange(i, 'discountPrice', e.target.value)}
                          placeholder="Selling Price"
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeVariationRow(i)}
                        className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-100 p-2.5 rounded-xl self-end cursor-pointer transition-colors"
                        title="Delete variant option"
                      >
                        <i className="fa-solid fa-trash-can text-xs" />
                      </button>

                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 pt-5 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-2xl border border-slate-200 font-extrabold text-slate-500 hover:bg-slate-50 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? 'Save Product Changes' : 'Confirm Catalog Upload'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
