"use client";

import { useState } from "react";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", link: "" });

  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.link) {
      setMenuItems([...menuItems, newMenuItem]);
      setNewMenuItem({ name: "", link: "" });
    }
  };

  const handleRemoveMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
      <div className="space-y-6">
        {/* Formularz dodawania nowej pozycji */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nazwa
              </label>
              <input
                type="text"
                placeholder="np. Promocje"
                value={newMenuItem.name}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, name: e.target.value })
                }
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Link
              </label>
              <input
                type="text"
                placeholder="Wklej lub wyszukaj"
                value={newMenuItem.link}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, link: e.target.value })
                }
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Dodaj
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>

        {/* Lista pozycji w menu */}
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
                  kolekcja
                </span>
                <p className="text-sm font-medium text-gray-800">
                  {item.name}
                </p>
              </div>
              <p className="text-sm text-gray-500">{item.link}</p>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Edytuj
              </button>
              <button
                type="button"
                onClick={() => handleRemoveMenuItem(index)}
                className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg shadow hover:bg-red-100 transition"
              >
                Usuń
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Dodaj pozycję menu
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
