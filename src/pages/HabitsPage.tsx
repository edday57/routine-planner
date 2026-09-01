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

  const closeForm = () => {
    setShowForm(false)
    setEditingHabit(undefined)
  }

  const handleSave = (data: Omit<Habit, 'id'>) => {
    if (editingHabit) onUpdate(editingHabit.id, data)
    else onAdd(data)
    closeForm()
  }

  const openNew = () => {
    setEditingHabit(undefined)
    setShowForm(true)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Habits"
        subtitle="Set them up once, reuse every week"
        action={
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[14px] font-semibold text-canvas shadow-glow transition active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            New
          </button>
        }
      />

      {habits.length === 0 ? (
        <EmptyState
          emoji="✨"
          title="No habits yet"
          description="Start with one small thing — a wake-up time, a short walk, ten pages. Small wins build the momentum."
          action={
            <button
              type="button"
              onClick={openNew}
              className="rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-canvas shadow-glow transition active:scale-95"
            >
              Add your first habit
            </button>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {habits.map((habit, i) => (
            <li key={habit.id}>
              <HabitListItem
                habit={habit}
                index={i}
                onEdit={() => {
                  setEditingHabit(habit)
                  setShowForm(true)
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSave}
          onCancel={closeForm}
          onDelete={
            editingHabit
              ? () => {
                  onDelete(editingHabit.id)
                  closeForm()
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
