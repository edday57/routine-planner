import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Habit } from '../types'
import { HabitForm, HabitListItem } from '../components/HabitForm'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'

interface HabitsPageProps {
  habits: Habit[]
  onAdd: (data: Omit<Habit, 'id'>) => void
  onUpdate: (id: string, data: Partial<Omit<Habit, 'id'>>) => void
  onDelete: (id: string) => void
}

export function HabitsPage({ habits, onAdd, onUpdate, onDelete }: HabitsPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>()

  const handleSave = (data: Omit<Habit, 'id'>) => {
    if (editingHabit) {
      onUpdate(editingHabit.id, data)
    } else {
      onAdd(data)
    }
    setShowForm(false)
    setEditingHabit(undefined)
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
        subtitle="Set up once, reuse every week"
        action={
          <button
            type="button"
            onClick={() => {
              setEditingHabit(undefined)
              setShowForm(true)
            }}
            className="flex items-center gap-1.5 rounded-xl bg-sage px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(90,138,122,0.35)] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        }
      />

      {habits.length === 0 ? (
        <EmptyState
          emoji="✨"
          title="No habits yet"
          description="Start with one small thing — wake up time, a walk, reading. Small wins build momentum."
          action={
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-sage px-5 py-2.5 text-sm font-semibold text-white shadow-sm active:scale-95"
            >
              Add your first habit
            </button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {habits.map((habit, i) => (
            <li
              key={habit.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-fade-up"
            >
              <HabitListItem
                habit={habit}
                onEdit={() => handleEdit(habit)}
                onDelete={() => onDelete(habit.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingHabit(undefined)
          }}
        />
      )}
    </div>
  )
}
