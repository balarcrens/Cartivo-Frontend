/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    X,
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Package,
    Info,
    Layers,
    PlusCircle,
    Settings2,
    Upload
} from 'lucide-react';
import AuthContext from '../../Context/Auth/authContext';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_ENV === 'Development' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_URL;

const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [vendors, setVendors] = useState([]);

    const initialFormState = {
        name: '',
        description: '',
        category_id: '',
        brand_id: '',
        vendor_id: '',
        price: '',
        discount: 0,
        stock: '',
        status: 'active',
        images: [],
        attributes: {},
        variants: []
    };

    const [formData, setFormData] = useState(initialFormState);
    const [attributesList, setAttributesList] = useState([]);

    // Helper to find type of value
    const getValueType = (val) => {
        if (Array.isArray(val)) {
            if (val.length > 0 && typeof val[0] === 'object') return 'object-list';
            return 'array';
        }
        if (typeof val === 'number') return 'number';
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) return 'object';
        return 'text';
    };

    // Flatten nested attributes into a flat list for the UI
    const flattenToAttributesList = (obj, prefix = '') => {
        let items = [];
        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const val = obj[key];
            const type = getValueType(val);

            if (type === 'object') {
                items = [...items, ...flattenToAttributesList(val, fullKey)];
            } else {
                items.push({
                    id: Math.random().toString(36).substr(2, 9),
                    key: fullKey,
                    value: type === 'array' ? (Array.isArray(val) ? val.join(', ') : (val || '')) : val,
                    type: type,
                    group: prefix || 'General'
                });
            }
        }
        return items;
    };

    // Unflatten list back to nested object
    const unflattenToAttributesObject = (list) => {
        const result = {};
        list.forEach(item => {
            if (!item.key) return; // Skip empty keys

            const keys = item.key.split('.');
            let current = result;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    let finalValue = item.value;
                    if (item.type === 'array') {
                        finalValue = typeof item.value === 'string' ? item.value.split(',').map(s => s.trim()).filter(s => s) : item.value;
                    } else if (item.type === 'number') {
                        finalValue = Number(item.value);
                    }
                    current[key] = finalValue;
                } else {
                    current[key] = current[key] || {};
                    current = current[key];
                }
            });
        });
        return result;
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            fetchBrands();
            fetchVendors();
            if (product) {
                let parsedAttributes = product.attributes;
                if (typeof parsedAttributes === 'string') {
                    try {
                        parsedAttributes = JSON.parse(parsedAttributes);
                    } catch (e) {
                        parsedAttributes = {};
                    }
                }

                let parsedImages = product.images;
                if (typeof parsedImages === 'string') {
                    try {
                        parsedImages = JSON.parse(parsedImages);
                    } catch (e) {
                        parsedImages = [];
                    }
                }

                // Fetch variants for this product
                fetchVariants(product.id);

                setFormData({
                    ...product,
                    category_id: product.category_id || '',
                    brand_id: product.brand_id || '',
                    vendor_id: product.vendor_id || '',
                    images: parsedImages || [],
                    attributes: parsedAttributes || {},
                    variants: [] // Will be populated by fetchVariants
                });
                setAttributesList(flattenToAttributesList(parsedAttributes || {}));
            } else {
                setFormData(initialFormState);
                setAttributesList([]);
            }
        }
    }, [isOpen, product]);

    const fetchVariants = async (productId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/variants/product/${productId}`);
            if (res.data.status === 'success') {
                setFormData(prev => ({ ...prev, variants: res.data.data.variants }));
            }
        } catch (error) {
            console.error(error);
            console.error('Error fetching variants:', error);
        }
    };

    // Fetch category attributes when category changes
    useEffect(() => {
        if (formData.category_id && categories.length > 0) {
            const selectedCat = categories.find(c => c.id === formData.category_id);
            if (selectedCat && selectedCat.attributes && Array.isArray(selectedCat.attributes)) {
                // If it's a new product or attributes are empty, populate with templates
                if (!product || Object.keys(formData.attributes).length === 0) {
                    const newAttrs = selectedCat.attributes.map(attr => ({
                        id: Math.random().toString(36).substr(2, 9),
                        key: attr.name,
                        value: '',
                        type: attr.type || 'text',
                        group: 'Category Specifications'
                    }));
                    setAttributesList(newAttrs);
                }
            }
        }
    }, [formData.category_id, categories]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/categories`);
            setCategories(res.data.data.categories);
        } catch (error) {
            console.error(error);
            console.error(error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/brands`);
            setBrands(res.data.data.brands);
        } catch (error) {
            console.error(error);
            console.error(error);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/vendors/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVendors(res.data.data.vendors);
        } catch (error) {
            console.error(error);
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAttributeField = () => {
        setAttributesList(prev => [
            ...prev,
            {
                id: Math.random().toString(36).substr(2, 9),
                key: '',
                value: '',
                type: 'text',
                group: 'General'
            }
        ]);
    };

    const handleAttributeChange = (id, field, value) => {
        setAttributesList(prev => prev.map(attr =>
            attr.id === id ? { ...attr, [field]: value } : attr
        ));
    };

    const handleRemoveAttribute = (id) => {
        setAttributesList(prev => prev.filter(attr => attr.id !== id));
    };

    const handleObjectListRowChange = (attrId, rowIndex, key, value) => {
        setAttributesList(prev => prev.map(attr => {
            if (attr.id === attrId) {
                const newList = [...(attr.value || [])];
                newList[rowIndex] = { ...newList[rowIndex], [key]: value };
                return { ...attr, value: newList };
            }
            return attr;
        }));
    };

    const handleAddObjectListRow = (attrId) => {
        setAttributesList(prev => prev.map(attr => {
            if (attr.id === attrId) {
                const existing = attr.value || [];
                // Default keys if empty, otherwise use keys from first row
                const schema = (existing.length > 0 && typeof existing[0] === 'object') ? Object.keys(existing[0]) : ['name', 'value'];
                const newRow = schema.reduce((acc, k) => ({ ...acc, [k]: '' }), {});
                return { ...attr, value: [...(Array.isArray(existing) ? existing : []), newRow], type: 'object-list' };
            }
            return attr;
        }));
    };

    // Variant Management
    const handleAddVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    name: '',
                    sku: '',
                    price: prev.price || '',
                    stock: 0,
                    variant_attributes: {},
                    images: []
                }
            ]
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleRemoveVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalAttributes = unflattenToAttributesObject(attributesList);
            const submissionData = {
                ...formData,
                attributes: finalAttributes,
                variants: formData.variants
            };

            const url = product
                ? `${BASE_URL}/api/v1/products/${product.id}`
                : `${BASE_URL}/api/v1/products`;
            const method = product ? 'patch' : 'post';

            const res = await axios[method](url, submissionData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status === 'success') {
                onSave();
                onClose();
                toast.success(`Product ${method === 'patch' ? 'updated' : 'added'} successfullly`);
            }
        } catch (error) {
            console.error(error);
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Group attributes for cleaner display
    const groupedAttributes = attributesList.reduce((acc, attr) => {
        const group = attr.group || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(attr);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex justify-center transition-opacity duration-300">
            <div className={`w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-out translate-x-0 overflow-hidden`}>
                <div className="px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            {product ? `Editing SKU: ${product.id.split('-')[0]}` : 'Configure your product specifications'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 cursor-pointer hover:bg-rose-50 rounded-3xl transition-all text-gray-400 hover:text-rose-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form id="productForm" onSubmit={handleSubmit} className="flex-grow overflow-y-auto px-6 sm:px-8 py-4 sm:py-6 space-y-6 scrollbar-hidden">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-md">
                                <Package size={22} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">Basic Information</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Title</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Samsung Galaxy S24 Ultra"
                                    className="w-full px-6 py-2.5 bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-indigo-100 transition-all text-base font-bold text-gray-800"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-6 py-2.5 bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-indigo-100 transition-all text-base font-bold text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Discount (₹)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-6 py-2.5 bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-indigo-100 transition-all text-base font-bold text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock</label>
                                    <input
                                        required
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-6 py-2.5 bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-indigo-100 transition-all text-base font-bold text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-6 cursor-pointer py-2.5 bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-indigo-100 transition-all text-base font-bold text-gray-800 appearance-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-md">
                                <Layers size={22} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">Categorization</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                <select
                                    required
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-6 py-2.5 cursor-pointer bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-emerald-100 transition-all text-base font-bold text-gray-800 appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand</label>
                                <select
                                    name="brand_id"
                                    value={formData.brand_id}
                                    onChange={handleChange}
                                    className="w-full px-6 py-2.5 cursor-pointer bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-emerald-100 transition-all text-base font-bold text-gray-800 appearance-none"
                                >
                                    <option value="">Select Brand</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Vendor</label>
                                <select
                                    name="vendor_id"
                                    value={formData.vendor_id}
                                    onChange={handleChange}
                                    className="w-full px-6 py-2.5 cursor-pointer bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-emerald-100 transition-all text-base font-bold text-gray-800 appearance-none"
                                >
                                    <option value="">No Vendor (Direct)</option>
                                    {vendors.map(vendor => (
                                        <option key={vendor.id} value={vendor.id}>{vendor.store_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex flex-wrap gap-1 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-md">
                                    <Settings2 size={22} />
                                </div>
                                <h3 className="text-xl font-black text-gray-800">Product Specifications</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddAttributeField}
                                className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-black transition-all text-[11px] font-black uppercase tracking-widest"
                            >
                                <PlusCircle size={16} />
                                Add Custom Attribute
                            </button>
                        </div>

                        <div className="space-y-8">
                            {Object.entries(groupedAttributes).map(([groupName, attrs]) => (
                                <div key={groupName} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 whitespace-nowrap">{groupName}</span>
                                        <div className="h-px flex-grow bg-gray-100"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {attrs.map((attr) => (
                                            <div key={attr.id} className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <input
                                                            type="text"
                                                            value={attr.key}
                                                            onChange={(e) => handleAttributeChange(attr.id, 'key', e.target.value)}
                                                            placeholder="Field name"
                                                            className="bg-transparent border-none outline-0 text-[11px] font-black uppercase tracking-widest text-gray-400 w-full focus:text-indigo-600"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttribute(attr.id)}
                                                            className="p-1 cursor-pointer text-gray-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <div className="flex-1">
                                                            {attr.type === 'object-list' ? (
                                                                <div className="space-y-2">
                                                                    <div className="overflow-x-auto rounded-lg border border-gray-50">
                                                                        <table className="w-full text-left text-[12px]">
                                                                            <tbody className="divide-y divide-gray-50">
                                                                                {(Array.isArray(attr.value) ? attr.value : []).map((row, rowIndex) => (
                                                                                    <tr key={rowIndex}>
                                                                                        {Object.keys(row).map(k => (
                                                                                            <td key={k} className="p-1">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    value={row[k]}
                                                                                                    onChange={(e) => handleObjectListRowChange(attr.id, rowIndex, k, e.target.value)}
                                                                                                    className="w-full text-sm border p-1 font-bold bg-transparent focus:outline-none"
                                                                                                />
                                                                                            </td>
                                                                                        ))}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <button type="button" onClick={() => handleAddObjectListRow(attr.id)} className="text-[12px] font-bold text-indigo-500 uppercase">+ Add Row</button>
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type={attr.type === 'number' ? 'number' : 'text'}
                                                                    value={typeof attr.value === 'object' ? JSON.stringify(attr.value) : attr.value}
                                                                    onChange={(e) => handleAttributeChange(attr.id, 'value', e.target.value)}
                                                                    placeholder="Enter value..."
                                                                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/5 transition-all"
                                                                />
                                                            )}
                                                        </div>
                                                        <select
                                                            value={attr.type}
                                                            onChange={(e) => handleAttributeChange(attr.id, 'type', e.target.value)}
                                                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-400 cursor-pointer"
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="number">Num</option>
                                                            <option value="array">List</option>
                                                            <option value="object-list">Table</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {attributesList.length === 0 && (
                                <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30">
                                    <div className="flex flex-col items-center gap-4">
                                        <Settings2 size={40} className="text-gray-200" />
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No specifications defined yet.</p>
                                        <button
                                            type="button"
                                            onClick={handleAddAttributeField}
                                            className="px-6 py-2.5 cursor-pointer bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-all text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Add Specification
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex flex-wrap gap-1 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-md">
                                    <PlusCircle size={22} />
                                </div>
                                <h3 className="text-xl font-black text-gray-800">Product Variants</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-violet-200"
                            >
                                <Plus size={16} />
                                Add New Variant
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.variants.map((variant, vIdx) => (
                                <div key={vIdx} className="group bg-white border-2 border-gray-100 rounded-md p-6 shadow-sm hover:border-violet-200 transition-all duration-300 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4 flex-grow">
                                            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-sm font-black shadow-inner">
                                                {vIdx + 1}
                                            </div>
                                            <div className="flex-grow max-w-md">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">Variant Label</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 12GB / 1TB / Titanium Violet"
                                                    value={variant.name}
                                                    onChange={(e) => handleVariantChange(vIdx, 'name', e.target.value)}
                                                    className="w-full bg-transparent border-none outline-0 text-lg font-black text-gray-900 placeholder:text-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariant(vIdx)}
                                            className="text-gray-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                <Layers size={12} /> SKU
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => handleVariantChange(vIdx, 'sku', e.target.value)}
                                                placeholder="S24U-VIO-1TB"
                                                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-violet-100 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                <ImageIcon size={12} /> Price (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => handleVariantChange(vIdx, 'price', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-violet-100 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                <Package size={12} /> Stock
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(vIdx, 'stock', e.target.value)}
                                                placeholder="0"
                                                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:bg-white focus:border-violet-100 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-50 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                    <Settings2 size={14} className="text-violet-500" /> Variant Attributes
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newAttrs = { ...(variant.variant_attributes || {}) };
                                                        const newKey = `Attr ${Object.keys(newAttrs).length + 1}`;
                                                        newAttrs[newKey] = '';
                                                        handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                    }}
                                                    className="text-[12px] cursor-pointer font-black text-violet-600 hover:text-violet-800 uppercase tracking-widest flex items-center gap-1"
                                                >
                                                    <Plus size={12} /> Add Attribute
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {Object.entries(variant.variant_attributes || {}).map(([key, value], attrIdx) => {
                                                    const type = Array.isArray(value) ? (value.length > 0 && typeof value[0] === 'object' ? 'table' : 'list') : 'text';

                                                    return (
                                                        <div key={`${vIdx}-${attrIdx}`} className="bg-gray-50/50 p-4 rounded-2xl flex flex-col gap-3 group/attr relative border border-transparent hover:border-violet-100 transition-all">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <input
                                                                    type="text"
                                                                    value={key}
                                                                    onChange={(e) => {
                                                                        const newAttrs = { ...variant.variant_attributes };
                                                                        const oldKey = key;
                                                                        const newKey = e.target.value;
                                                                        if (newKey !== oldKey) {
                                                                            newAttrs[newKey] = value;
                                                                            delete newAttrs[oldKey];
                                                                            handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                        }
                                                                    }}
                                                                    placeholder="Attribute (e.g. Color)"
                                                                    className="text-[12px] font-black text-violet-500 uppercase tracking-widest bg-transparent border-none outline-none focus:text-violet-700 w-full"
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    <select
                                                                        value={type}
                                                                        onChange={(e) => {
                                                                            const newType = e.target.value;
                                                                            const newAttrs = { ...variant.variant_attributes };
                                                                            if (newType === 'text') newAttrs[key] = '';
                                                                            else if (newType === 'list') newAttrs[key] = [];
                                                                            else if (newType === 'table') newAttrs[key] = [{ name: '', hex: '' }];
                                                                            handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                        }}
                                                                        className="text-[10px] font-bold uppercase bg-white border border-gray-100 rounded px-2 py-1 outline-none text-gray-400 focus:border-violet-200"
                                                                    >
                                                                        <option value="text">Text</option>
                                                                        <option value="list">List</option>
                                                                        <option value="table">Table</option>
                                                                    </select>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newAttrs = { ...variant.variant_attributes };
                                                                            delete newAttrs[key];
                                                                            handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                        }}
                                                                        className="p-1 cursor-pointer text-gray-300 hover:text-rose-400 transition-opacity"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="w-full">
                                                                {type === 'text' && (
                                                                    <input
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={(e) => {
                                                                            const newAttrs = { ...variant.variant_attributes };
                                                                            newAttrs[key] = e.target.value;
                                                                            handleVariantChange(vIdx, 'variant_attributes', newAttrs);

                                                                            // Improved Auto naming
                                                                            const autoName = Object.values(newAttrs).map(v => {
                                                                                if (Array.isArray(v)) {
                                                                                    if (v.length > 0 && typeof v[0] === 'object') return v[0].name || v[0].value || Object.values(v[0])[0];
                                                                                    return v.join(',');
                                                                                }
                                                                                return v;
                                                                            }).filter(Boolean).join(' / ');
                                                                            if (autoName && (!variant.name || variant.name === 'New Variant')) handleVariantChange(vIdx, 'name', autoName);
                                                                        }}
                                                                        className="w-full bg-white px-3 py-2 rounded-md text-sm font-bold text-gray-800 shadow-sm border border-transparent focus:border-violet-100 outline-none"
                                                                        placeholder="Value"
                                                                    />
                                                                )}
                                                                {type === 'list' && (
                                                                    <input
                                                                        type="text"
                                                                        value={Array.isArray(value) ? value.join(', ') : value}
                                                                        onChange={(e) => {
                                                                            const newAttrs = { ...variant.variant_attributes };
                                                                            newAttrs[key] = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                                            handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                        }}
                                                                        className="w-full bg-white px-3 py-2 rounded-md text-sm font-bold text-gray-800 shadow-sm border border-transparent focus:border-violet-100 outline-none"
                                                                        placeholder="Value1, Value2, ..."
                                                                    />
                                                                )}
                                                                {type === 'table' && (
                                                                    <div className="space-y-2">
                                                                        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
                                                                            <table className="w-full text-[12px]">
                                                                                <tbody className="divide-y divide-gray-50">
                                                                                    {(Array.isArray(value) ? value : []).map((row, rIdx) => (
                                                                                        <tr key={rIdx}>
                                                                                            {Object.keys(row).map(k => (
                                                                                                <td key={k} className="p-1">
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        value={row[k]}
                                                                                                        onChange={(e) => {
                                                                                                            const newAttrs = { ...variant.variant_attributes };
                                                                                                            const newList = [...newAttrs[key]];
                                                                                                            newList[rIdx] = { ...newList[rIdx], [k]: e.target.value };
                                                                                                            newAttrs[key] = newList;
                                                                                                            handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                                                        }}
                                                                                                        className="w-full text-xs p-1 outline-none font-bold"
                                                                                                        placeholder={k}
                                                                                                    />
                                                                                                </td>
                                                                                            ))}
                                                                                            <td className="w-8 text-center">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        const newAttrs = { ...variant.variant_attributes };
                                                                                                        newAttrs[key] = newAttrs[key].filter((_, i) => i !== rIdx);
                                                                                                        handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                                                    }}
                                                                                                    className="text-gray-300 hover:text-rose-400"
                                                                                                >
                                                                                                    <X size={12} />
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newAttrs = { ...variant.variant_attributes };
                                                                                const firstRow = newAttrs[key][0] || { name: '', hex: '' };
                                                                                const newRow = Object.keys(firstRow).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
                                                                                newAttrs[key] = [...newAttrs[key], newRow];
                                                                                handleVariantChange(vIdx, 'variant_attributes', newAttrs);
                                                                            }}
                                                                            className="text-[10px] font-black uppercase text-violet-500 hover:text-violet-700"
                                                                        >
                                                                            + Add Row
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                                <ImageIcon size={14} className="text-violet-500" /> Variant Images
                                            </label>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            files.forEach(file => {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    const currentImages = variant.images || [];
                                                                    handleVariantChange(vIdx, 'images', [...currentImages, reader.result]);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            });
                                                        }}
                                                        className="hidden"
                                                        id={`variant-image-upload-${vIdx}`}
                                                    />
                                                    <label
                                                        htmlFor={`variant-image-upload-${vIdx}`}
                                                        className="w-20 h-20 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-all group/upload"
                                                    >
                                                        <Plus size={20} className="text-gray-300 group-hover/upload:text-violet-400 transition-colors" />
                                                        <span className="text-[8px] font-black uppercase text-gray-300 group-hover/upload:text-violet-400">Add</span>
                                                    </label>
                                                </div>
                                                {(variant.images || []).map((img, iIdx) => (
                                                    <div key={iIdx} className="relative group/img w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shadow-gray-100">
                                                        <img src={img} alt="Variant" className="w-full h-full object-cover" loading='lazy' />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newImages = variant.images.filter((_, i) => i !== iIdx);
                                                                    handleVariantChange(vIdx, 'images', newImages);
                                                                }}
                                                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-rose-500 transition-all flex items-center justify-center"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {formData.variants.length === 0 && (
                                <div className="py-20 text-center border-3 border-dashed border-gray-50 rounded-[2.5rem] bg-gray-50/20 group hover:border-violet-100 transition-all duration-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <PlusCircle size={32} className="text-gray-200" />
                                        </div>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">No variants added. Product will be listed as a single unit.</p>
                                        <button
                                            type="button"
                                            onClick={handleAddVariant}
                                            className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm"
                                        >
                                            Create First Variant
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>


                    <section className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-md">
                                <ImageIcon size={22} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">Media Gallery</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        files.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, reader.result]
                                                }));
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }}
                                    className="hidden"
                                    id="product-images-upload"
                                />
                                <label
                                    htmlFor="product-images-upload"
                                    className="flex items-center gap-4 p-6 bg-gray-50 border-3 border-dashed border-gray-100 rounded-lg cursor-pointer group-hover:border-rose-100 group-hover:bg-rose-50/20 transition-all duration-500"
                                >
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-rose-500">
                                        <Upload size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black uppercase tracking-widest text-gray-700">Drop images here</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">Upload high-resolution product photos (PNG, JPG, WEBP)</p>
                                    </div>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="group relative aspect-square rounded-[1.5rem] overflow-hidden border-4 border-gray-50 bg-gray-50 shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-500">
                                        <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading='lazy' />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] bg-black/10">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                                className="p-3 bg-white cursor-pointer text-rose-500 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-md">
                                <Info size={22} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">Detailed Description</h3>
                        </div>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Describe the product's unique features, craftsmanship, and specifications in detail..."
                            className="w-full px-8 py-8 bg-gray-50 border-2 border-transparent rounded-md outline-0 focus:bg-white focus:border-slate-100 transition-all text-base font-medium text-gray-700 leading-relaxed resize-none shadow-inner"
                        ></textarea>
                    </section>
                </form>

                <div className="px-8 py-4 border-t border-gray-50 bg-white/80 backdrop-blur-xl flex gap-2 sm:gap-6 sticky bottom-0 z-30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 cursor-pointer px-4 sm:px-6 py-2 sm:py-4 bg-white border-2 border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
                    >
                        Discard Changes
                    </button>
                    <button
                        form="productForm"
                        type="submit"
                        disabled={loading}
                        className="flex-[2] cursor-pointer px-4 sm:px-6 py-2 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{product ? 'Confirm & Update' : 'Publish Product'}</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;
