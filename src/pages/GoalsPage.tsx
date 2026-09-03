import { useState } from 'react'
import { PartyPopper, Plus } from 'lucide-react'
import type { Goal, GoalStep } from '../types'
import { DidSomethingBar } from '../components/DidSomethingBar'
import { EmptyState } from '../components/EmptyState'
import { GoalCard } from '../components/GoalCard'
import { GoalForm } from '../components/GoalForm'
import { LogStepSheet } from '../components/LogStepSheet'
import { PageHeader } from '../components/PageHeader'
import { formatDate, getWeekDates } from '../lib/weekUtils'

interface GoalsPageProps {
  goals: Goal[]
  steps: GoalStep[]
  onAdd: (data: Omit<Goal, 'id' | 'status'>) => void
  onUpdate: (id: string, data: Partial<Omit<Goal, 'id'>>) => void
  onDelete: (id: string) => void
  onAddStep: (goalId: string, title: string) => void
}

export function GoalsPage({
  goals,
  steps,
  onAdd,
  onUpdate,
  onDelete,
  onAddStep,
}: GoalsPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Goal | undefined>()
  const [logging, setLogging] = useState<Goal | undefined>()

  const active = goals.filter((g) => g.status === 'active')
  const short = active.filter((g) => g.horizon === 'short')
  const long = active.filter((g) => g.horizon === 'long')
  const reached = goals.filter((g) => g.status === 'reached')
  const week = new Set(getWeekDates(new Date()).map(formatDate))
  const weekSteps = steps.filter((s) => week.has(s.date)).length

  const openNew = () => {
    setEditing(undefined)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(undefined)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        subtitle={
          weekSteps > 0
            ? weekSteps === 1
              ? 'One step this week. That’s how it starts.'
              : `${weekSteps} steps this week. You’re stacking them.`
            : 'Collect the steps. The finish line can wait.'
        }
        action={
          <button
            type="button"
            onClick={openNew}
            className="accent-fill flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-semibold text-on-accent shadow-glow transition active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            New
          </button>
        }
      />

      {active.length > 0 && (
        <DidSomethingBar goals={goals} steps={steps} onAddStep={onAddStep} />
      )}

      {goals.length === 0 ? (
        <EmptyState
          emoji="🧭"
          title="What have you wanted?"
          description="Name one thing — even fuzzy. Then log the tiniest move toward it. That’s the whole game."
          action={
            <button
              type="button"
              onClick={openNew}
              className="accent-fill rounded-full px-5 py-3 text-[14px] font-semibold text-on-accent shadow-glow transition active:scale-95"
            >
              Add a goal
            </button>
          }
        />
      ) : (
        <>
          {short.length > 0 && (
            <section className="space-y-3">
              <h2 className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
                Soon
              </h2>
              {short.map((goal) => (
                <GoalBlock
                  key={goal.id}
                  goal={goal}
                  steps={steps}
                  onLog={() => setLogging(goal)}
                  onQuickLog={(title) => onAddStep(goal.id, title)}
                  onEdit={() => {
                    setEditing(goal)
                    setShowForm(true)
                  }}
                  onReach={() => onUpdate(goal.id, { status: 'reached' })}
                />
              ))}
            </section>
          )}

          {long.length > 0 && (
            <section className="space-y-3">
              <h2 className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
                Further out
              </h2>
              {long.map((goal) => (
                <GoalBlock
                  key={goal.id}
                  goal={goal}
                  steps={steps}
                  onLog={() => setLogging(goal)}
                  onQuickLog={(title) => onAddStep(goal.id, title)}
                  onEdit={() => {
                    setEditing(goal)
                    setShowForm(true)
                  }}
                  onReach={() => onUpdate(goal.id, { status: 'reached' })}
                />
              ))}
            </section>
          )}

          {reached.length > 0 && (
            <section className="space-y-3">
              <h2 className="px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-faint">
                Reached
              </h2>
              {reached.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  steps={steps}
                  onLog={() => setLogging(goal)}
                  onEdit={() => {
                    setEditing(goal)
                    setShowForm(true)
                  }}
                />
              ))}
            </section>
          )}
        </>
      )}

      {showForm && (
        <GoalForm
          goal={editing}
          onSave={(data) => {
            if (editing) onUpdate(editing.id, data)
            else onAdd(data)
            closeForm()
          }}
          onCancel={closeForm}
          onDelete={
            editing
              ? () => {
                  onDelete(editing.id)
                  closeForm()
                }
              : undefined
          }
          onMarkReached={
            editing
              ? () => {
                  onUpdate(editing.id, { status: 'reached' })
                  closeForm()
                }
              : undefined
          }
          onReopen={
            editing
              ? () => {
                  onUpdate(editing.id, { status: 'active' })
                  closeForm()
                }
              : undefined
          }
        />
      )}

      {logging && (
        <LogStepSheet
          goal={logging}
          steps={steps}
          onLog={(title) => onAddStep(logging.id, title)}
          onClose={() => setLogging(undefined)}
        />
      )}
    </div>
  )
}

function GoalBlock({
  goal,
  steps,
  onLog,
  onQuickLog,
  onEdit,
  onReach,
}: {
  goal: Goal
  steps: GoalStep[]
  onLog: () => void
  onQuickLog: (title: string) => void
  onEdit: () => void
  onReach: () => void
}) {
  return (
    <div className="space-y-2">
      <GoalCard
        goal={goal}
        steps={steps}
        onLog={onLog}
        onQuickLog={onQuickLog}
        onEdit={onEdit}
      />
      <button
        type="button"
        onClick={onReach}
        className="flex w-full items-center justify-center gap-2 px-4 py-2 text-[13px] font-semibold text-muted transition hover:text-accent-ink active:scale-[0.98]"
      >
        <PartyPopper className="size-3.5" />
        I reached this
      </button>
    </div>
  )
}
