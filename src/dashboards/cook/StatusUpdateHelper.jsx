// Helper function to update order status
// You'll need to add this route to your backend orderController.js

/*
IMPORTANT: Your database 'status' column needs to be updated!
The error "Data truncated for column 'status'" means your VARCHAR is too short.

Update your database schema:
ALTER TABLE orders MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending';

Add this to your orderController.js:

// Update Order Status Only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await order.update({ status });
    
    const updatedOrder = order.toJSON();
    updatedOrder.items = JSON.parse(updatedOrder.items);
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
};

And add this route to your orderRoutes.js:
router.put('/orders/:id/status', orderController.updateOrderStatus);
*/

export const updateOrderStatusAPI = async (orderId, newStatus) => {
  console.log(`Updating order ${orderId} to status: ${newStatus}`);
  
  const response = await fetch(`http://localhost:5000/order/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Status update failed:', errorData);
    throw new Error(`Failed to update order status: ${errorData.details || errorData.error}`);
  }
  
  const result = await response.json();
  console.log('Status update successful:', result);
  return result;
};
