
import React, { useState, useEffect } from "react";
import { Check, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Interfaces
interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  category?: string;
}

const STORAGE_KEY = "forkful-shopping-list";
const CATEGORIES = ["Produce", "Dairy", "Meat", "Pantry", "Frozen", "Other"];

const ShoppingListPage: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupByCategory, setGroupByCategory] = useState(true);
  
  // Load shopping list from localStorage
  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error("Error parsing shopping list:", error);
      }
    }
  }, []);
  
  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  
  const addItem = () => {
    if (!newItemName.trim()) {
      return;
    }
    
    // Create new item
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      completed: false,
      category: "Other" // Default category
    };
    
    setItems([...items, newItem]);
    setNewItemName("");
    
    toast.success(`${newItemName} added to shopping list`);
  };
  
  const toggleItemCompleted = (id: string) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const removeItem = (id: string) => {
    const itemToRemove = items.find(item => item.id === id);
    setItems(items.filter(item => item.id !== id));
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from shopping list`);
    }
  };
  
  const clearCompletedItems = () => {
    const completedCount = items.filter(item => item.completed).length;
    setItems(items.filter(item => !item.completed));
    
    if (completedCount > 0) {
      toast.success(`Removed ${completedCount} completed items`);
    }
  };
  
  const setItemCategory = (id: string, category: string) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, category } : item
      )
    );
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem();
  };
  
  // Filter items by search query and get completed/incomplete lists
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const incompleteItems = filteredItems.filter(item => !item.completed);
  const completedItems = filteredItems.filter(item => item.completed);
  
  // Group items by category if enabled
  const getGroupedItems = (items: ShoppingItem[]) => {
    if (!groupByCategory) return { Other: items };
    
    return items.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  };
  
  const groupedIncompleteItems = getGroupedItems(incompleteItems);
  const groupedCompletedItems = getGroupedItems(completedItems);
  
  return (
    <div className="p-4 h-full overflow-y-auto pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="mr-2 text-forkful-500" size={24} /> 
          Shopping List
        </h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGroupByCategory(!groupByCategory)}
          >
            {groupByCategory ? "Simple View" : "Group by Category"}
          </Button>
        )}
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" disabled={!newItemName.trim()}>
            <Plus size={18} className="mr-1" /> Add
          </Button>
        </form>
        
        {items.length > 0 && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        )}
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-10">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
          <h2 className="text-xl font-medium mb-2">Your shopping list is empty</h2>
          <p className="text-muted-foreground">
            {items.length === 0
              ? "Add items to your shopping list"
              : "No items match your search"}
          </p>
        </div>
      ) : (
        <div>
          {/* Incomplete Items */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">
              Items to Buy ({incompleteItems.length})
            </h2>
            
            {Object.entries(groupedIncompleteItems).map(([category, categoryItems]) => (
              <div key={category} className="mb-4">
                {groupByCategory && categoryItems.length > 0 && (
                  <h3 className="text-sm font-medium text-muted-foreground mt-4 mb-2 first:mt-0">
                    {category}
                  </h3>
                )}
                <Card className="bg-card/70 backdrop-blur-sm border-border/50">
                  <ul className="divide-y divide-border/50">
                    {categoryItems.map(item => (
                      <li key={item.id} className="flex items-center gap-3 py-3 px-4">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleItemCompleted(item.id)}
                          className="h-5 w-5"
                        />
                        <span className="flex-1 truncate text-sm">{item.name}</span>
                        {groupByCategory && (
                          <select
                            value={item.category}
                            onChange={(e) => setItemCategory(item.id, e.target.value)}
                            className="text-xs px-2 py-1 bg-muted rounded border-0 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">
                  Completed ({completedItems.length})
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompletedItems}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 size={14} className="mr-1" /> Clear
                </Button>
              </div>
              
              {Object.entries(groupedCompletedItems).map(([category, categoryItems]) => (
                <div key={category} className="mb-4">
                  {groupByCategory && categoryItems.length > 0 && (
                    <h3 className="text-sm font-medium text-muted-foreground mt-2 mb-1">
                      {category}
                    </h3>
                  )}
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <ul className="divide-y divide-border/30">
                      {categoryItems.map(item => (
                        <li
                          key={item.id}
                          className="flex items-center gap-3 py-2 px-4 text-muted-foreground"
                        >
                          <div className="h-5 w-5 rounded-sm border border-border flex items-center justify-center bg-primary/20">
                            <Check size={12} className="text-primary" />
                          </div>
                          <span className="flex-1 truncate text-sm line-through">{item.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;
