"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  
  const handleAddEmptyMenuItem = (priority) => {
    const newMenuItems = [...menuItems, { name: "", link: "", isEditing: true, subMenu: [], priority: priority, isFirstTime: true }];
    setMenuItems(newMenuItems);
  
    // Otwórz formularz dla ostatnio dodanego elementu
    setEditingItemIndex(newMenuItems.length - 1);
  };

  const handleToggleEdit = (index) => {
    if (menuItems[index].isFirstTime) {
      handleRemoveMenuItem(index);
      return;
    }
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index].isEditing = !updatedMenuItems[index].isEditing;
    setMenuItems(updatedMenuItems);
  };
  
  const handleUpdateMenuItem = (index, name, link, priority) => {
    if (!name || !link) return;
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index] = {
      ...updatedMenuItems[index],
      name,
      link,
      isEditing: false,
      priority,
      isFirstTime: false
    };
    setMenuItems(updatedMenuItems);
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
            onClick={() => handleAddEmptyMenuItem(0)}
            className="flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700"
          >
            <Image src="/images/dodaj.png" width={20} height={20} alt="Dodaj" />
            Dodaj pozycję menu
          </button>
          </div>
        </div>
      )}

      {/* Lista pozycji w menu */}
      {menuItems.length > 0 && (
        <div className="mt-6 space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow">
        
          {menuItems.map((item, index) => (
            <div
            key={index}      
            >
              {item.isEditing ? (
                // Tryb edycji
                
                <div className={menuItems.length > 1 &&("p-4 border border-gray-200 rounded-lg shadow")}>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const link = e.target.link.value;
                    handleUpdateMenuItem(index, name, link, index.priority);
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
                      onClick={() => handleToggleEdit(index)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-100 text-violet-700 border violet-300 rounded-lg shadow hover:bg-violet-100 transition"
                    >
                      {item.isFirstTime ? "Dodaj"  : "Zapisz"}
                    </button>
                  </div>
                </form>
                </div>
              ) : (
                // Widok pozycji
                <div className="flex flex-col">
                <div className="flex items-center justify-between w-full border-b border-b-gray-200 pb-4">
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
                      onClick={() => handleToggleEdit(index)}
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
                      onClick={() => handleAddSubMenuItem(index, "Podpozycja", "#")}
                      className="px-4 py-2 shadow hover:bg-gray-200 transition"
                    >
                      Dodaj pozycję menu
                    </button>
                    </div>
                  </div>
                </div>
                
                </div>
              )}
            </div>
          ))}
          {(  (menuItems.length === 1 && menuItems[0].isFirstTime === false) || menuItems.length > 1) && (<div className="pt-4">
            <button
              type="button"
              onClick={() => handleAddEmptyMenuItem()}
              className="border border-gray-300 rounded-lg bg-gray-100 text-gray-700 px-4 py-2 shadow hover:bg-gray-200 transition"
            >
              Dodaj pozycję menu
            </button>
            </div>)}
          
        </div>
      )}
    </div>
  );
}
