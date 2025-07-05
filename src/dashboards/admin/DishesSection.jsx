import React, { useState } from "react";
import "./admin.css";

export function DishesSection({ dishes, setDishes, showModal }) {
  const [newDish, setNewDish] = useState({ item: "", price: "", category: "", description: "" });
  const [editingDishId, setEditingDishId] = useState(null);
  const [dishEdits, setDishEdits] = useState({ item: "", price: "", category: "", description: "" });

  const handleAddDish = async () => {
    const item = newDish.item.trim();
    const price = parseFloat(newDish.price);
    const category = newDish.category.trim();
    const description = newDish.description.trim();

    if (!item || isNaN(price) || !category || !description) {
      showModal("Please enter dish name, price, category, and description");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/menu/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, price, category, description }),
      });

      if (response.ok) {
        const dish = await response.json();
        setDishes([...dishes, dish]);
        setNewDish({ item: "", price: "", category: "", description: "" });
        showModal("Dish added successfully");
      } else {
        const errorText = await response.text();
        console.error("Backend returned error:", errorText);
        showModal(`Failed to add dish: ${response.status}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      showModal("Error adding dish");
    }
  };

  const handleEditDish = (dish) => {
    setEditingDishId(dish.id);
    setDishEdits({
      item: dish.item,
      price: dish.price.toString(),
      category: dish.category || "",
      description: dish.description || "",
    });
  };

  const handleSaveDish = async (id) => {
    const { item, price, category, description } = dishEdits;

    if (!item.trim() || isNaN(parseFloat(price)) || !category.trim() || !description.trim()) {
      showModal("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/menu/menus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: item.trim(),
          price: parseFloat(price),
          category: category.trim(),
          description: description.trim(),
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setDishes(dishes.map((d) => (d.id === id ? updated : d)));
        setEditingDishId(null);
        showModal("Dish updated successfully");
      } else {
        showModal("Failed to update dish");
      }
    } catch (error) {
      showModal("Error updating dish");
    }
  };

  const handleDeleteDish = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/menu/menus/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDishes(dishes.filter((d) => d.id !== id));
        showModal("Dish deleted successfully");
      } else {
        showModal("Failed to delete dish");
      }
    } catch (error) {
      showModal("Error deleting dish");
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Manage Dishes</h1>
        <div className="badge">{dishes.length} dishes</div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Add New Dish</h3>
        </div>
        <div className="card-content">
          <div className="form-row">
            <input
              className="input flex-1"
              placeholder="Dish Name"
              value={newDish.item}
              onChange={(e) => setNewDish({ ...newDish, item: e.target.value })}
            />
            <input
              className="input flex-1"
              placeholder="Category"
              value={newDish.category}
              onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
            />
            <input
              className="input flex-1"
              placeholder="Description"
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            />
            <input
              className="input price-input"
              placeholder="Price"
              type="number"
              step="0.01"
              value={newDish.price}
              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
            />
            <button className="btn btn-primary" onClick={handleAddDish}>
              Add Dish
            </button>
          </div>
        </div>
      </div>

      <div className="dishes-grid">
        {dishes.map((dish) => (
          <div key={dish.id} className="card dish-card">
            <div className="card-content">
              {editingDishId === dish.id ? (
                <div className="edit-form">
                  <input
                    className="input"
                    value={dishEdits.item}
                    onChange={(e) => setDishEdits({ ...dishEdits, item: e.target.value })}
                    placeholder="Dish name"
                  />
                  <input
                    className="input"
                    value={dishEdits.category}
                    onChange={(e) => setDishEdits({ ...dishEdits, category: e.target.value })}
                    placeholder="Category"
                  />
                  <input
                    className="input"
                    value={dishEdits.description}
                    onChange={(e) => setDishEdits({ ...dishEdits, description: e.target.value })}
                    placeholder="Description"
                  />
                  <input
                    className="input"
                    type="number"
                    step="0.01"
                    value={dishEdits.price}
                    onChange={(e) => setDishEdits({ ...dishEdits, price: e.target.value })}
                    placeholder="Price"
                  />
                  <div className="button-group">
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveDish(dish.id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingDishId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dish-info">
                  <div className="dish-details">
                    <h3 className="dish-name">{dish.item}</h3>
                    <p className="dish-category">Category: {dish.category}</p>
                    <p className="dish-description">Description: {dish.description}</p>
                    <p className="dish-price">£{parseFloat(dish.price).toFixed(2)}</p>
                  </div>
                  <div className="button-group">
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEditDish(dish)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDish(dish.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
