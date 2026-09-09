"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UtensilsCrossed, Plus, Image as ImageIcon, Edit3, X, Loader2, Trash2 } from "lucide-react";
import { api } from "../../../../lib/api";

interface Category {
  id: string;
  name: string;
  subcategories?: { id: string; name: string; categoryId: string }[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  subcategoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  subcategory?: { name: string };
}

interface MenuFormData {
  name: string;
  price: string;
  categoryId: string;
  subcategoryId: string;
  imageFile?: File | null;
  imageUrl: string;
  available: boolean;
}

interface MenuItemCardProps {
  food: MenuItem;
  onEdit: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ food, onEdit }) => (
  <div className="bg-white border border-neutral-200/80 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-4">
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
          <span
            className={`inline-block text-[10px] font-bold ${
              food.isAvailable ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {food.isAvailable ? "✓ Available" : "✕ Sold Out"}
          </span>
          {food.subcategory && (
            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-semibold">
              {food.subcategory.name}
            </span>
          )}
        </div>
        <p className="text-xs font-mono font-black text-neutral-900">
          ₦{Number(food.price).toLocaleString()}
        </p>
      </div>
    </div>

    <button
      onClick={() => onEdit(food)}
      className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
    >
      <Edit3 size={16} />
    </button>
  </div>
);

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  editingItem: MenuItem | null;
  formData: MenuFormData;
  setFormData: React.Dispatch<React.SetStateAction<MenuFormData>>;
  categories: Category[];
  activeCategoryObject?: Category;
  handleCategoryChangeInForm: (catId: string) => void;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
  deleting: boolean;
  uploadingImage: boolean;
}

const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editingItem,
  formData,
  setFormData,
  categories,
  activeCategoryObject,
  handleCategoryChangeInForm,
  handleImageFileChange,
  submitting,
  deleting,
  uploadingImage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-neutral-950">
            {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Item Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
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
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Subcategory Taxonomy</label>
            <select
              value={formData.subcategoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, subcategoryId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:border-amber-600 bg-white"
              required
            >
              {activeCategoryObject?.subcategories?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700">Food Dish Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-neutral-400" />
                )}
              </div>
              <label className="flex-1 cursor-pointer bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-center transition-colors flex items-center justify-center gap-2">
                {uploadingImage ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-amber-600" />
                    <span className="text-xs font-bold text-neutral-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} className="text-amber-600" />
                    <span className="text-xs font-bold text-neutral-700">Choose from device</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.available}
              onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
              className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-neutral-700 cursor-pointer">
              Available for ordering (Toggle status)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="flex-1 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editingItem ? "Save Changes" : "Create Item"}
            </button>

            {editingItem && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Delete item"
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default function MerchantMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    imageUrl: "",
    available: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        api.get<MenuItem[]>("/merchant/dashboard/menu"),
        api.get<Category[]>("/storefront/categories"),
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to load initial merchant menu data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    const firstCat = categories[0];
    const firstSub = firstCat?.subcategories?.[0];

    setFormData({
      name: "",
      price: "",
      categoryId: firstCat?.id || "",
      subcategoryId: firstSub?.id || "",
      imageUrl: "",
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    const matchedSub = categories
      .flatMap((c) => c.subcategories || [])
      .find((s) => s.id === item.subcategoryId);

    setFormData({
      name: item.name,
      price: item.price.toString(),
      categoryId: matchedSub?.categoryId || categories[0]?.id || "",
      subcategoryId: item.subcategoryId || "",
      imageUrl: item.imageUrl || "",
      available: item.isAvailable ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCategoryChangeInForm = (catId: string) => {
    const targetCat = categories.find((c) => c.id === catId);
    const firstSubId = targetCat?.subcategories?.[0]?.id || "";
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      subcategoryId: firstSubId,
    }));
  };

const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setFormData((prev) => ({
    ...prev,
    imageFile: file,
    imageUrl: URL.createObjectURL(file), // Local preview
  }));
};

  const refreshMenu = async () => {
    const { data } = await api.get<MenuItem[]>("/merchant/dashboard/menu");
    setMenuItems(data);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("subcategoryId", formData.subcategoryId);
    data.append("available", String(formData.available));
    
    // This matches FileInterceptor('file') on your NestJS backend controller
    if (formData.imageFile) {
      data.append("file", formData.imageFile);
    } else if (formData.imageUrl) {
      data.append("imageUrl", formData.imageUrl);
    }

    if (editingItem) {
      await api.patch(`/merchant/dashboard/menu/${editingItem.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/merchant/dashboard/menu", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setIsModalOpen(false);
    // Refresh your menu list here...
  } catch (err) {
    console.error("Failed to save menu item", err);
    alert("Failed to save menu item.");
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
      await refreshMenu();
    } catch (err) {
      console.error("Failed to delete menu item", err);
    } finally {
      setDeleting(false);
    }
  };

  const currentCategorySubIds =
    selectedCategoryId === "All"
      ? null
      : categories.find((c) => c.id === selectedCategoryId)?.subcategories?.map((s) => s.id) || [];

  const filteredItems =
    selectedCategoryId === "All"
      ? menuItems
      : menuItems.filter((item) => currentCategorySubIds?.includes(item.subcategoryId));

  const activeCategoryObject = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight text-neutral-950">Menu</h1>
        <button
          onClick={handleOpenAdd}
          className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors flex items-center gap-1.5 px-3 text-xs font-bold cursor-pointer"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryId("All")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === cat.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

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
          filteredItems.map((food) => (
            <MenuItemCard key={food.id} food={food} onEdit={handleOpenEdit} />
          ))
        )}
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        editingItem={editingItem}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        activeCategoryObject={activeCategoryObject}
        handleCategoryChangeInForm={handleCategoryChangeInForm}
        handleImageFileChange={handleImageFileChange}
        submitting={submitting}
        deleting={deleting}
        uploadingImage={uploadingImage}
      />
    </div>
  );
}