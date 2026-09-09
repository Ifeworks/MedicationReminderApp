import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get all customers
export const getCustomers = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a customer
export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        const { data, error } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json({ success: true, data: data[0] });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a customer
export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('customers').delete().eq('id', id);

        if (error) throw error;
        res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
