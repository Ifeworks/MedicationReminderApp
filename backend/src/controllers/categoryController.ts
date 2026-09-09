import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get all categories
export const getCategories = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const generatedSlug = slug || String(name).toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '');

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name: String(name).trim(), slug: generatedSlug }])
            .select();

        if (error) throw error;
        res.status(201).json({ success: true, data: data[0] });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { name, slug } = req.body;
        const updates: { name?: string; slug?: string } = {};

        if (name !== undefined) updates.name = String(name).trim();
        if (slug !== undefined) updates.slug = String(slug).trim();

        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json({ success: true, data: data[0] });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
