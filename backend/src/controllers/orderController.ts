import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Helper to format an order for frontend admin and customer views
const formatOrder = (o: any) => {
    if (!o) return null;
    return {
        id: o.order_number || o.id,
        db_id: o.id,
        order_number: o.order_number || o.id,
        customerName: o.customers?.full_name || o.customer_name || 'Customer',
        customerPhone: o.customers?.phone_number || o.customer_phone || '',
        customerEmail: o.customers?.email || o.customer_email || '',
        deliveryAddress: o.delivery_address || o.customers?.address || '',
        deliveryArea: o.delivery_address || 'Ido-Ekiti',
        orderNotes: o.order_notes || o.orderNotes || '',
        type: o.delivery_type || o.type || 'Food Delivery',
        paymentMethod: o.payment_method || o.paymentMethod || 'Pay on Delivery',
        paymentStatus: o.payment_status || 'Pending',
        status: o.status || 'New Order',
        subtotal: Number(o.subtotal) || 0,
        deliveryFee: Number(o.delivery_fee) || 0,
        total: Number(o.total) || 0,
        createdAt: o.created_at,
        created_at: o.created_at,
        updatedAt: o.updated_at,
        items: (o.order_items || []).map((it: any) => ({
            id: it.menu_item_id || it.id,
            name: it.menu_items?.name || it.name || 'Food Item',
            price: Number(it.price_at_time || it.price) || 0,
            quantity: Number(it.quantity) || 1,
            total: (Number(it.price_at_time || it.price) || 0) * (Number(it.quantity) || 1),
            image: it.menu_items?.image_url || it.image || '',
            extras: it.extras || [],
            instructions: it.special_instructions || it.instructions || '',
        })),
    };
};

// Place new customer order
export const createOrder = async (req: Request, res: Response) => {
    try {
        const {
            full_name,
            phone_number,
            delivery_address,
            delivery_type,
            payment_method,
            order_notes,
            items,
            subtotal,
            delivery_fee,
            total,
        } = req.body;

        const cleanPhone = String(phone_number || '').trim() || '08000000000';
        const cleanName = String(full_name || '').trim() || 'Valued Customer';
        const cleanAddress = String(delivery_address || '').trim() || 'Ido-Ekiti';
        const cleanTotal = parseFloat(String(total || 0));
        const cleanSubtotal = parseFloat(String(subtotal || 0));
        const cleanDeliveryFee = parseFloat(String(delivery_fee || 0));

        // 1. Find or create customer by phone number
        let { data: customer } = await supabase
            .from('customers')
            .select('id, total_spent')
            .eq('phone_number', cleanPhone)
            .maybeSingle();

        if (!customer) {
            const { data: newCustomer, error: custError } = await supabase
                .from('customers')
                .insert([{
                    full_name: cleanName,
                    phone_number: cleanPhone,
                    address: cleanAddress,
                    total_spent: cleanTotal
                }])
                .select()
                .single();

            if (custError || !newCustomer) {
                throw new Error(custError?.message || 'Failed to create customer record.');
            }
            customer = newCustomer;
        } else {
            await supabase
                .from('customers')
                .update({ total_spent: Number(customer.total_spent || 0) + cleanTotal })
                .eq('id', customer.id);
        }

        if (!customer) {
            return res.status(400).json({ success: false, message: 'Could not process customer details.' });
        }

        // 2. Generate Order Number
        const orderNum = `PB-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_id: customer.id,
                    order_number: orderNum,
                    delivery_type: delivery_type || 'Food Delivery',
                    payment_method: payment_method || 'Pay on Delivery',
                    delivery_address: cleanAddress,
                    order_notes: order_notes || '',
                    subtotal: cleanSubtotal,
                    delivery_fee: cleanDeliveryFee,
                    total: cleanTotal,
                    status: 'New Order',
                },
            ])
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Create Order Items safely checking UUID format for menu_item_id
        if (Array.isArray(items) && items.length > 0) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            const orderItemsPayload = items.map((item: any) => {
                const isUuid = item.menu_item_id && uuidRegex.test(String(item.menu_item_id));
                return {
                    order_id: order.id,
                    menu_item_id: isUuid ? item.menu_item_id : null,
                    quantity: Number(item.quantity) || 1,
                    price_at_time: Number(item.price) || 0,
                    special_instructions: item.special_instructions || '',
                };
            });

            await supabase.from('order_items').insert(orderItemsPayload);
        }

        res.status(201).json({
            success: true,
            order_number: orderNum,
            data: {
                ...order,
                order_number: orderNum,
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get all orders formatted for dashboard
export const getAllOrders = async (_req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, customers(*), order_items(*, menu_items(name, image_url, price))')
            .order('created_at', { ascending: false });

        if (error) throw error;
        const formatted = (data || []).map(formatOrder);
        res.status(200).json({ success: true, data: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Update status (New Order -> Confirmed -> Preparing -> Out for Delivery -> Delivered)
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { status } = req.body;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const query = supabase.from('orders').update({ status });

        const { data, error } = isUuid
            ? await query.eq('id', id).select('*, customers(*), order_items(*, menu_items(name, image_url, price))')
            : await query.eq('order_number', id).select('*, customers(*), order_items(*, menu_items(name, image_url, price))');

        if (error) throw error;
        const formatted = data && data[0] ? formatOrder(data[0]) : { id, status };
        res.status(200).json({ success: true, data: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};