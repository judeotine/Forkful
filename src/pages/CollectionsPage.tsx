
import React, { useState, useEffect } from "react";
import { Plus, Folder, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCard from "@/components/RecipeCard";
import { getFavorites } from "@/services/storageService";
import { Recipe } from "@/services/spoonacularApi";

// Collection type definition
interface Collection {
  id: string;
  name: string;
  description: string;
  recipeIds: number[];
  createdAt: string;
}

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  
  // Load collections and favorites
  useEffect(() => {
    const loadData = () => {
      try {
        // Load collections from localStorage
        const storedCollections = localStorage.getItem("forkful-collections");
        if (storedCollections) {
          setCollections(JSON.parse(storedCollections));
        }
        
        // Load favorites
        const storedFavorites = getFavorites();
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error loading collections:", error);
        toast.error("Failed to load collections");
      }
    };
    
    loadData();
  }, []);
  
  // Create new collection
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error("Collection name cannot be empty");
      return;
    }
    
    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      description: newCollectionDescription,
      recipeIds: [],
      createdAt: new Date().toISOString()
    };
    
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    
    // Save to localStorage
    localStorage.setItem("forkful-collections", JSON.stringify(updatedCollections));
    
    // Reset form
    setNewCollectionName("");
    setNewCollectionDescription("");
    setShowNewCollection(false);
    
    toast.success("Collection created successfully");
    setActiveCollection(newCollection);
  };
  
  // Get recipes for a collection
  const getCollectionRecipes = (collection: Collection): Recipe[] => {
    return favorites.filter(recipe => collection.recipeIds.includes(recipe.id));
  };
  
  // Delete collection
  const deleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter(c => c.id !== collectionId);
    setCollections(updatedCollections);
    
    // Save to localStorage
    localStorage.setItem("forkful-collections", JSON.stringify(updatedCollections));
    
    toast.success("Collection deleted");
    
    // Reset active collection if deleted
    if (activeCollection?.id === collectionId) {
      setActiveCollection(null);
    }
  };
  
  // Add recipe to collection
  const addRecipeToCollection = (recipe: Recipe, collection: Collection) => {
    // Check if recipe is already in collection
    if (collection.recipeIds.includes(recipe.id)) {
      toast.info("Recipe already in this collection");
      return;
    }
    
    // Add recipe to collection
    const updatedCollections = collections.map(c => {
      if (c.id === collection.id) {
        return {
          ...c,
          recipeIds: [...c.recipeIds, recipe.id]
        };
      }
      return c;
    });
    
    setCollections(updatedCollections);
    
    // Save to localStorage
    localStorage.setItem("forkful-collections", JSON.stringify(updatedCollections));
    
    toast.success(`Added to ${collection.name}`);
    
    // Update active collection
    if (activeCollection?.id === collection.id) {
      setActiveCollection(updatedCollections.find(c => c.id === collection.id) || null);
    }
  };
  
  // Remove recipe from collection
  const removeRecipeFromCollection = (recipeId: number, collection: Collection) => {
    const updatedCollections = collections.map(c => {
      if (c.id === collection.id) {
        return {
          ...c,
          recipeIds: c.recipeIds.filter(id => id !== recipeId)
        };
      }
      return c;
    });
    
    setCollections(updatedCollections);
    
    // Save to localStorage
    localStorage.setItem("forkful-collections", JSON.stringify(updatedCollections));
    
    toast.success("Recipe removed from collection");
    
    // Update active collection
    if (activeCollection?.id === collection.id) {
      setActiveCollection(updatedCollections.find(c => c.id === collection.id) || null);
    }
  };
  
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button
          size="sm"
          onClick={() => setShowNewCollection(true)}
          className="flex items-center"
          variant="outline"
        >
          <Plus size={16} className="mr-1" /> Create
        </Button>
      </div>
      
      {showNewCollection ? (
        <Card className="mb-6 bg-card/70 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>New Collection</CardTitle>
            <CardDescription>Create a new recipe collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <Input
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Short description"
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateCollection} className="bg-forkful-500 hover:bg-forkful-600">Create Collection</Button>
                <Button variant="outline" onClick={() => setShowNewCollection(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : collections.length === 0 ? (
        <div className="text-center py-10 bg-card/70 backdrop-blur-sm rounded-lg border border-border/50">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
          <h3 className="text-lg font-medium mb-2">No Collections Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create collections to organize your favorite recipes by theme, occasion, or cuisine.
          </p>
          <Button onClick={() => setShowNewCollection(true)} className="bg-forkful-500 hover:bg-forkful-600">
            <Plus size={16} className="mr-1" /> Create Your First Collection
          </Button>
        </div>
      ) : (
        <div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Collections</TabsTrigger>
              {activeCollection && (
                <TabsTrigger value="active">{activeCollection.name}</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {collections.map(collection => (
                  <motion.div
                    key={collection.id}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card
                      className="h-full cursor-pointer bg-card/70 backdrop-blur-sm border-border/50 hover:shadow-md transition-shadow"
                      onClick={() => setActiveCollection(collection)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{collection.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {collection.recipeIds.length} recipes
                            </CardDescription>
                          </div>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Implementation for dropdown menu to edit/delete collection
                              }}
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground mb-2">{collection.description}</p>
                        )}
                        <div className="flex gap-1 overflow-hidden h-16">
                          {getCollectionRecipes(collection).slice(0, 3).map(recipe => (
                            <div key={recipe.id} className="w-1/3 h-full rounded-md overflow-hidden">
                              {recipe.image ? (
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Folder size={20} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))}
                          {getCollectionRecipes(collection).length === 0 && (
                            <div className="w-full h-full bg-muted/50 rounded-md flex items-center justify-center">
                              <p className="text-xs text-muted-foreground">No recipes yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            {activeCollection && (
              <TabsContent value="active" className="space-y-4">
                <Card className="bg-card/70 backdrop-blur-sm border-border/50 mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{activeCollection.name}</CardTitle>
                        <CardDescription>{activeCollection.description}</CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCollection(activeCollection.id)}
                      >
                        Delete Collection
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {getCollectionRecipes(activeCollection).length} recipes in this collection
                    </p>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 gap-4">
                  {getCollectionRecipes(activeCollection).length > 0 ? (
                    getCollectionRecipes(activeCollection).map(recipe => (
                      <div key={recipe.id} className="relative">
                        <RecipeCard recipe={recipe} />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                          onClick={() => removeRecipeFromCollection(recipe.id, activeCollection)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-card/50 backdrop-blur-sm rounded-lg">
                      <p className="text-muted-foreground mb-4">
                        This collection is empty. Add recipes from your favorites.
                      </p>
                      <Button onClick={() => setActiveCollection(null)} variant="outline">
                        Back to Collections
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Add from Favorites</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {favorites
                      .filter(recipe => !activeCollection.recipeIds.includes(recipe.id))
                      .slice(0, 5)
                      .map(recipe => (
                        <div key={recipe.id} className="relative">
                          <RecipeCard recipe={recipe} variant="compact" />
                          <Button
                            size="sm"
                            className="absolute bottom-2 right-2 bg-forkful-500 hover:bg-forkful-600"
                            onClick={() => addRecipeToCollection(recipe, activeCollection)}
                          >
                            Add to Collection
                          </Button>
                        </div>
                      ))}
                    {favorites.filter(recipe => !activeCollection.recipeIds.includes(recipe.id)).length === 0 && (
                      <div className="text-center py-4 bg-card/50 backdrop-blur-sm rounded-lg">
                        <p className="text-muted-foreground">No more recipes to add from favorites</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
