"use client";

import React, { useState, useEffect } from "react";
import { UtensilsCrossed, Plus, Search, Image as ImageIcon, Edit3, X, Loader2, Trash2 } from "lucide-react";
import { api } from "../../../../lib/api";

export default function MerchantMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    imageUrl: "",
    available: true,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        api.get('/merchant/dashboard/menu'),
        api.get('/storefront/categories')
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to load initial merchant menu data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    const firstCat = categories[0];
    const firstSub = firstCat?.subcategories?.[0];
    
    setFormData({
      name: "",
      price: "",
      categoryId: firstCat ? firstCat.id : "",
      subcategoryId: firstSub ? firstSub.id : "",
      imageUrl: "",
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    const matchedSub = categories
      .flatMap(c => c.subcategories)
      .find((s: any) => s.id === item.subcategoryId);

    setFormData({
      name: item.name,
      price: item.price.toString(),
      categoryId: matchedSub ? matchedSub.categoryId : (categories[0]?.id || ""),
      subcategoryId: item.subcategoryId || "",
      imageUrl: item.imageUrl || "",
      available: item.isAvailable ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCategoryChangeInForm = (catId: string) => {
    const targetCat = categories.find(c => c.id === catId);
    const firstSubId = targetCat?.subcategories?.[0]?.id || "";
    setFormData({
      ...formData,
      categoryId: catId,
      subcategoryId: firstSubId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        subcategoryId: formData.subcategoryId,
        imageUrl: formData.imageUrl,
        available: formData.available,
      };

      if (editingItem) {
        await api.patch(`/merchant/dashboard/menu/${editingItem.id}`, payload);
      } else {
        await api.post('/merchant/dashboard/menu', payload);
      }

      setIsModalOpen(false);
      const { data } = await api.get('/merchant/dashboard/menu');
      setMenuItems(data);
    } catch (err) {
      console.error("Failed to save menu item", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingItem) return;
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    setDeleting(true);
    try {
      await api.delete(`/merchant/dashboard/menu/${editingItem.id}`);
      setIsModalOpen(false);
      const { data } = await api.get('/merchant/dashboard/menu');
      setMenuItems(data);
    } catch (err) {
      console.error("Failed to delete menu item", err);
    } finally {
      setDeleting(false);
    }
  };

  const currentCategorySubIds = selectedCategoryId === "All"
    ? null
    : categories.find(c => c.id === selectedCategoryId)?.subcategories?.map((s: any) => s.id) || [];

  const filteredItems = selectedCategoryId === "All"
    ? menuItems
    : menuItems.filter((item: any) => currentCategorySubIds?.includes(item.subcategoryId));

  const activeCategoryObject = categories.find(c => c.id === formData.categoryId);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Menu</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenAdd}
            className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors flex items-center gap-1.5 px-3 text-xs font-bold"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* Parent Categories Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryId("All")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategoryId === "All"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryId === cat.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-neutral-400">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-12 text-center space-y-3">
            <UtensilsCrossed size={32} className="mx-auto text-neutral-300" />
            <p className="text-sm font-bold text-neutral-900">No items in this category</p>
            <p className="text-xs text-neutral-500">Add dishes matching this taxonomy to populate your store.</p>
          </div>
        ) : (
          filteredItems.map((food: any) => (
            <div key={food.id} className="bg-white border border-neutral-200/80 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 relative overflow-hidden shrink-0">
                  {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={24} />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-950">{food.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block text-[10px] font-bold ${food.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {food.isAvailable ? '✓ Available' : '✕ Sold Out'}
                    </span>
                    {food.subcategory && (
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-semibold">
                        {food.subcategory.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono font-black text-neutral-900">₦{Number(food.price).toLocaleString()}</p>
                </div>
              </div>

              <button 
                onClick={() => handleOpenEdit(food)}
                className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
              >
                <Edit3 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-neutral-950">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Item Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jollof Rice + Turkey" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Price (₦)</label>
                <input 
                  type="number" 
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="4500" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Parent Category</label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChangeInForm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Subcategory Taxonomy</label>
                <select 
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600 bg-white"
                  required
                >
                  {activeCategoryObject?.subcategories?.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700">Image URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <input 
                  type="checkbox" 
                  id="isAvailable"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded"
                />
                <label htmlFor="isAvailable" className="text-xs font-bold text-neutral-700">Available for ordering (Toggle status)</label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>

                {editingItem && (
                  <button 
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center"
                    title="Delete item"
                  >
                    {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}