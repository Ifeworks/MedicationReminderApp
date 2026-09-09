import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Helper to format menu item for both frontend and backend expectations
const formatMenuItem = (item: any) => {
    if (!item) return null;
    const categoryName = item.categories?.name || (typeof item.category === 'string' ? item.category : 'Rice');
    const imageUrl = item.image_url || item.image || 'https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&h=600&fit=crop&auto=format';
    const isAvailable = item.is_available !== undefined ? Boolean(item.is_available) : (item.available !== undefined ? Boolean(item.available) : true);
    const isFeatured = item.is_featured_this_week !== undefined ? Boolean(item.is_featured_this_week) : (item.featured !== undefined ? Boolean(item.featured) : false);

    return {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: Number(item.price),
        category_id: item.category_id,
        category: categoryName,
        categories: item.categories,
        image_url: imageUrl,
        image: imageUrl,
        is_available: isAvailable,
        available: isAvailable,
        is_featured_this_week: isFeatured,
        featured: isFeatured,
        created_at: item.created_at,
        createdAt: item.created_at,
        updated_at: item.updated_at,
    };
};

// Helper to resolve category ID from category name or ID
const resolveCategoryId = async (categoryInput?: string): Promise<string | null> => {
    if (!categoryInput) return null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryInput);
    if (isUuid) return categoryInput;

    const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', categoryInput.trim())
        .maybeSingle();

    if (cat) return cat.id;

    // Fallback: pick the first available category
    const { data: firstCat } = await supabase.from('categories').select('id').limit(1).maybeSingle();
    return firstCat?.id || null;
};

// Get all menu items with category names
export const getMenuItems = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*, categories(id, name, slug)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        const formatted = (data || []).map(formatMenuItem);
        res.status(200).json({ success: true, data: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new menu item
export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const {
            name,
            description,
            price,
            category,
            category_id,
            image,
            image_url,
            available,
            is_available,
            featured,
            is_featured_this_week,
        } = req.body;

        if (!name || price === undefined || price === null) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        const resolvedCategoryId = await resolveCategoryId(category_id || category);
        const resolvedImage = req.file ? req.file.path : (image || image_url || 'https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&h=600&fit=crop&auto=format');
        const resolvedAvailable = available !== undefined ? Boolean(available) : (is_available !== undefined ? (is_available === 'true' || is_available === true) : true);
        const resolvedFeatured = featured !== undefined ? Boolean(featured) : (is_featured_this_week !== undefined ? (is_featured_this_week === 'true' || is_featured_this_week === true) : false);

        const { data, error } = await supabase
            .from('menu_items')
            .insert([
                {
                    name: String(name).trim(),
                    description: description ? String(description).trim() : '',
                    price: parseFloat(String(price)),
                    category_id: resolvedCategoryId,
                    image_url: resolvedImage,
                    is_available: resolvedAvailable,
                    is_featured_this_week: resolvedFeatured,
                },
            ])
            .select('*, categories(id, name, slug)');

        if (error) throw error;
        const formatted = formatMenuItem(data[0]);
        res.status(201).json({ success: true, data: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle availability, price or edit meal details
export const updateMenuItem = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const updates: any = { updated_at: new Date() };

        if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
        if (req.body.description !== undefined) updates.description = String(req.body.description).trim();
        if (req.body.price !== undefined) updates.price = parseFloat(String(req.body.price));

        if (req.file) {
            updates.image_url = req.file.path;
        } else if (req.body.image !== undefined || req.body.image_url !== undefined) {
            updates.image_url = req.body.image || req.body.image_url;
        }

        if (req.body.available !== undefined) {
            updates.is_available = Boolean(req.body.available);
        } else if (req.body.is_available !== undefined) {
            updates.is_available = req.body.is_available === 'true' || req.body.is_available === true;
        }

        if (req.body.featured !== undefined) {
            updates.is_featured_this_week = Boolean(req.body.featured);
        } else if (req.body.is_featured_this_week !== undefined) {
            updates.is_featured_this_week = req.body.is_featured_this_week === 'true' || req.body.is_featured_this_week === true;
        }

        if (req.body.category !== undefined || req.body.category_id !== undefined) {
            updates.category_id = await resolveCategoryId(req.body.category_id || req.body.category);
        }

        const { data, error } = await supabase
            .from('menu_items')
            .update(updates)
            .eq('id', id)
            .select('*, categories(id, name, slug)');

        if (error) throw error;
        const formatted = formatMenuItem(data[0]);
        res.status(200).json({ success: true, data: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete menu item
export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { error } = await supabase.from('menu_items').delete().eq('id', id);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};