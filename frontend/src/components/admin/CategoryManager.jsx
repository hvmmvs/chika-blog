import { useState, useEffect } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { getCategories, createCategory, deleteCategory } from '../../api/categories'

export default function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createCategory(newCategory)
      setNewCategory({ name: '', slug: '', description: '' })
      loadCategories()
    } catch (err) {
      console.error('Failed to create category')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      loadCategories()
    } catch (err) {
      console.error('Failed to delete category')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="space-y-4 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Add Category</h3>
        <Input
          label="Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          required
        />
        <Input
          label="Slug"
          value={newCategory.slug}
          onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
          required
        />
        <Button type="submit">Add</Button>
      </form>
      <ul className="divide-y">
        {categories.map((cat) => (
          <li key={cat.id} className="py-3 flex justify-between items-center">
            <span>{cat.name}</span>
            <Button variant="danger" onClick={() => handleDelete(cat.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
