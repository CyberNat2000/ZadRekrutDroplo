"use client";

import { DndContext, closestCenter } from '@dnd-kit/core';
import {SortableContext, useSortable,} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  
  const handleAddEmptyMenuItem = (priority, index) => {
    const newMenuItem = { id: `item-${menuItems.length + 1}`, name: "", link: "", isEditing: true, priority: priority, isFirstTime: true };
    let newMenuItems;

    if (priority > 0) {
      newMenuItems = [...menuItems];
      newMenuItems.splice(index+1, 0, newMenuItem); // Wstaw nowy element w odpowiednie miejsce
    } else {
      newMenuItems = [...menuItems, newMenuItem]; // Dodaj nowy element na końcu
    }
    setMenuItems(newMenuItems);
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

  const SortableItem = ({ id, item, index, handleToggleEdit, handleRemoveMenuItem, handleAddEmptyMenuItem, }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    console.log(transform, transition);
    // Definiowanie stylów lokalnie
    const style = {
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      transition: transition || undefined,
    };
  
    return (
      
      <div
        style={style}
        ref={setNodeRef}
        {...attributes} 
        className="flex flex-col border-b border-b-gray-200"
      >
        <div className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-2 w-full">
            <Image
              src="/images/zoom.png"
              width={20}
              height={20}
              alt="Ikona"
              className="cursor-grab"
              {...listeners}
            />
            <div className="flex flex-col gap-px">
              <p className="font-semibold text-sm text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">{item.link}</p>
            </div>
            <div className="flex items-center justify-end ml-auto border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
              <button
                type="button"
                onClick={() => handleRemoveMenuItem(index)}
                className="font-semibold px-4 py-2  border-r border-r-gray-300 shadow hover:bg-gray-200 transition"
              >
                Usuń
              </button>
              <button
                type="button"
                onClick={() => handleToggleEdit(index)}
                className="font-semibold px-4 py-2 border-r border-r-gray-300 shadow hover:bg-gray-200 transition"
              >
                Edytuj
              </button>
              <button
                type="button"
                onClick={() => handleAddEmptyMenuItem(item.priority+1, index)}
                className="font-semibold px-4 py-2 shadow hover:bg-gray-200 transition"
              >
                Dodaj pozycję menu
              </button>
              </div>
            </div>
          </div>
                
        </div>
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = menuItems.findIndex((item) => item.id === active.id);
    const newIndex = menuItems.findIndex((item) => item.id === over.id);
  
    const draggedItem = menuItems[oldIndex];
  
    // Zbieranie zależnych elementów
    const itemsToMove = [draggedItem];
    let i = oldIndex + 1;
  
    while (
      i < menuItems.length &&
      menuItems[i].priority > draggedItem.priority
    ) {
      itemsToMove.push(menuItems[i]);
      i++;
    }
  
    // Usunięcie przenoszonych elementów z obecnego miejsca
    let updatedMenuItems = menuItems.filter((item) => !itemsToMove.includes(item));
  
    // Wyznaczenie miejsca wstawienia
    const insertIndex = newIndex > oldIndex
      ? newIndex - itemsToMove.length + 1
      : newIndex;
  
    // Wstawienie przenoszonych elementów w nowym miejscu
    const reorderedItems = [
      ...updatedMenuItems.slice(0, insertIndex),
      ...itemsToMove,
      ...updatedMenuItems.slice(insertIndex),
    ];
  
    // Aktualizacja priorytetów w całej liście
    const finalMenuItems = reorderedItems.map((item, index) => ({
      ...item,
      priority: (item.priority === 0 || index === 0) 
        ? 0 
        : (reorderedItems[index - 1].priority - item.priority >= 2 
          ? reorderedItems[index - 1].priority + 1 
          : item.priority), /*priorytet zależy od tego czy podane menu jest główne (ma wartość 0) i czy różnica między
          wyższym, a niższym jest większa lub równa 2 (to oznacza że jest przeskok), w innym wypadku zostaje takie samo*/
    }));
  
    // Aktualizacja stanu
    setMenuItems(finalMenuItems);
  };
  
  
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
    <SortableContext items={menuItems.map((item) => item.id)}>
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
      {/* Sekcja początkowa */}
      {menuItems.length === 0 && (
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Menu jest puste</h2>
          <p className="text-sm text-gray-500">
            W tym menu nie ma jeszcze żadnych linków.
          </p>
          <div className="flex justify-center items-center">
          <button
            onClick={() => handleAddEmptyMenuItem(0)}
            className="font-semibold flex items-center gap-2 mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700"
          >
            <Image src="/images/dodaj.png" width={20} height={20} alt="Dodaj" />
            Dodaj pozycję menu
          </button>
          </div>
        </div>
      )}

      {/* Lista pozycji w menu */}
      {menuItems.length > 0 && (
        <div className="mt-6 space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow ml-4">
        
          {menuItems.map((item, index) => (
            <div
            style={{ marginLeft: `${item.priority * 20}px` }}
            key={index}
            className={!item.isEditing &&("")}      
            >
              {item.isEditing ? (
                // Tryb edycji
                
                <div className={menuItems.length > 1 &&(`p-4 border border-gray-200 rounded-lg shadow`)}>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const link = e.target.link.value;
                    handleUpdateMenuItem(index, name, link, item.priority);
                  }}
                >
                  <div>
                    <div className='flex justify-between'>
                    <label className="block text-sm font-medium text-gray-700">
                      Nazwa
                    </label>
                    <Image
                      src="/images/kosz.png"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={() => handleRemoveMenuItem(index)}
                    ></Image>
                    </div>
                    <input
                      type="text"
                      name="name"
                      defaultValue={item.name}
                      placeholder='np. Promocje'
                      className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Link
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Image 
                          src="/images/lupa.png" 
                          alt="Lupa" 
                          width={20} 
                          height={20} 
                        />
                      </div>
                      <input
                        type="text"
                        name='link'
                        placeholder="Wklej lub wyszukaj"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleToggleEdit(index)}
                      className="font-semibold px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      className="font-semibold px-4 py-2 bg-gray-100 text-violet-700 border border-violet-300 rounded-lg shadow hover:bg-violet-100 transition"
                    >
                      {item.isFirstTime ? "Dodaj"  : "Zapisz"}
                    </button>
                  </div>
                </form>
                </div>
              ) : (
                // Widok pozycji
                <SortableItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  index={index}
                  handleToggleEdit={handleToggleEdit}
                  handleRemoveMenuItem={handleRemoveMenuItem}
                  handleAddEmptyMenuItem={handleAddEmptyMenuItem}
                />
              )}
            </div>
          ))}
          {(  (menuItems.length === 1 && menuItems[0].isFirstTime === false) || menuItems.length > 1) && (<div className="pt-4">
            <button
              type="button"
              onClick={() => handleAddEmptyMenuItem(0)}
              className="font-semibold border border-gray-300 rounded-lg bg-gray-100 text-gray-700 px-4 py-2 shadow hover:bg-gray-200 transition"
            >
              Dodaj pozycję menu
            </button>
            </div>)}
          
        </div>
      )}
    </div>
    </SortableContext>
    </DndContext>
  );
}
