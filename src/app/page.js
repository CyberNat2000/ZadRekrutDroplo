"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);

  const handleAddMenuItem = (name, link) => {
    if (!name || !link) return;

    setMenuItems([...menuItems, { name, link }]);
    setIsAddingMenuItem(false); // Ukrycie formularza po dodaniu
  };

  const handleUpdateMenuItem = (index, name, link) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index] = { name, link };
    setMenuItems(updatedMenuItems);
    setEditingItemIndex(null); // Zakończ edycję
  };

  const handleRemoveMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
      {/* Sekcja początkowa */}
      {menuItems.length === 0 && !isAddingMenuItem && (
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Menu jest puste</h2>
          <p className="text-sm text-gray-500">
            W tym menu nie ma jeszcze żadnych linków.
          </p>
          <div className="flex justify-center items-center">
          <button
            onClick={() => setIsAddingMenuItem(true)}
            className="flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700"
          >
            <Image src="/images/dodaj.png" width={20} height={20} alt="Dodaj" />
            Dodaj pozycję menu
          </button>
          </div>
        </div>
      )}

      {/* Formularz dodawania nowej pozycji */}
      {isAddingMenuItem && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value;
              const link = e.target.link.value;
              handleAddMenuItem(name, link);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Nazwa</label>
              <input
                type="text"
                name="name"
                placeholder="np. Promocje"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="text"
                name="link"
                placeholder="Wklej lub wyszukaj"
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsAddingMenuItem(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 text-violet-700 border border-violet-300 rounded-lg shadow hover:bg-violet-100 transition"
              >
                Dodaj
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista pozycji w menu */}
      {menuItems.length > 0 && (
        <div className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow"
            >
              {editingItemIndex === index ? (
                // Tryb edycji
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const link = e.target.link.value;
                    handleUpdateMenuItem(index, name, link);
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nazwa
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={item.name}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Link
                    </label>
                    <input
                      type="text"
                      name="link"
                      defaultValue={item.link}
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setEditingItemIndex(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-100 text-violet-700 border violet-300 rounded-lg shadow hover:bg-violet-100 transition"
                    >
                      Zapisz
                    </button>
                  </div>
                </form>
              ) : (
                // Widok pozycji
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 w-full">
                    <Image
                      src="/images/zoom.png"
                      width={20}
                      height={20}
                      alt="Ikona"
                    />
                    <div className="flex flex-col gap-px">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.link}</p>
                    </div>
                  <div className="flex items-center justify-end ml-auto border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
                    <button
                      type="button"
                      onClick={() => setEditingItemIndex(index)}
                      className="px-4 py-2 border-r border-r-gray-300 shadow hover:bg-gray-200 transition"
                    >
                      Edytuj
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMenuItem(index)}
                      className="px-4 py-2  border-r border-r-gray-300 shadow hover:bg-gray-200 transition"
                    >
                      Usuń
                    </button>
                    <button
                      type="button"

                      className="px-4 py-2 shadow hover:bg-gray-200 transition"
                    >
                      Dodaj pozycję menu
                    </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
