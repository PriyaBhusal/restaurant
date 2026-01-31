// StatusUpdateHelper.jsx
export const updateOrderStatusAPI = async (orderId, newStatus) => {
  const token = localStorage.getItem("cookToken"); // ✅ same key as login

  if (!token) throw new Error("No authentication token found. Please login.");

  const response = await fetch(`http://localhost:5000/order/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ include JWT
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update order status");
  }

  return response.json();
};
