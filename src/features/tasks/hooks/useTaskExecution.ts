import { useState, useCallback, useEffect } from 'react';
import { Task } from '../../../db/database';
import { IntensityLevel } from '../components/IntensitySelector';
import { MoodLevel } from '../components/EmotionalCheckIn';
import { createActivityLog, completeActivityLog } from '../../../db/operations/activityLogs';
import { useAppStore } from '../../../../store';

type ExecutionPhase = 'preview' | 'mood-before' | 'executing' | 'mood-after' | 'completed';

interface TaskStep {
  id: string;
  description: string;
  completed: boolean;
}

interface UseTaskExecutionReturn {
  // State
  phase: ExecutionPhase;
  intensity: IntensityLevel;
  moodBefore: MoodLevel | null;
  moodAfter: MoodLevel | null;
  steps: TaskStep[];
  activityLogId: string | null;

  // Actions
  setIntensity: (intensity: IntensityLevel) => void;
  setMoodBefore: (mood: MoodLevel) => void;
  setMoodAfter: (mood: MoodLevel) => void;
  toggleStep: (stepId: string) => void;
  startTask: () => Promise<void>;
  completeTask: () => Promise<void>;

  // Computed
  allStepsCompleted: boolean;
  estimatedMinutes: number;
}

export const useTaskExecution = (task: Task): UseTaskExecutionReturn => {
  const dailyEmotionalState = useAppStore((s) => s.dailyEmotionalState);

  const [phase, setPhase] = useState<ExecutionPhase>('preview');
  const [intensity, setIntensity] = useState<IntensityLevel>('standard');
  const [moodBefore, setMoodBefore] = useState<MoodLevel | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodLevel | null>(null);
  const [activityLogId, setActivityLogId] = useState<string | null>(null);

  // Initialize steps from task
  const [steps, setSteps] = useState<TaskStep[]>(() => {
    if (!task.steps || task.steps.length === 0) {
      return [];
    }
    return task.steps.map((description, index) => ({
      id: `step_${index}`,
      description,
      completed: false,
    }));
  });

  // Update steps if intensity level changes and task has intensity levels
  useEffect(() => {
    if (task.intensityLevels) {
      // If task has intensity levels, we could potentially update the steps
      // For now, we'll keep the default steps from task.steps
    }
  }, [intensity, task]);

  // Toggle step completion
  const toggleStep = useCallback((stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  }, []);

  // Check if all steps are completed
  const allStepsCompleted = steps.length > 0 ? steps.every((step) => step.completed) : true;

  // Calculate estimated minutes based on intensity
  const estimatedMinutes =
    task.intensityLevels && task.intensityLevels[intensity]
      ? task.intensityLevels[intensity].minutes
      : task.estimatedMinutes;

  // Start task - creates activity log and moves to mood-before phase
  const startTask = useCallback(async () => {
    setPhase('mood-before');
  }, []);

  // After mood-before is selected, create activity log and start execution
  useEffect(() => {
    if (phase === 'mood-before' && moodBefore !== null) {
      const createLog = async () => {
        const logId = await createActivityLog(
          'default_user',
          task.id,
          moodBefore,
          dailyEmotionalState || 'ok'
        );
        setActivityLogId(logId);
        setPhase('executing');
      };
      createLog();
    }
  }, [phase, moodBefore, task.id, dailyEmotionalState]);

  // Complete task - moves to mood-after phase
  const completeTask = useCallback(async () => {
    setPhase('mood-after');
  }, []);

  // After mood-after is selected, complete activity log
  useEffect(() => {
    if (phase === 'mood-after' && moodAfter !== null && activityLogId) {
      const finishLog = async () => {
        // Calculate actual minutes - this will be provided by the timer in the parent component
        // For now, use estimated minutes as placeholder
        await completeActivityLog(activityLogId, moodAfter, estimatedMinutes);
        setPhase('completed');
      };
      finishLog();
    }
  }, [phase, moodAfter, activityLogId, estimatedMinutes]);

  return {
    phase,
    intensity,
    moodBefore,
    moodAfter,
    steps,
    activityLogId,
    setIntensity,
    setMoodBefore,
    setMoodAfter,
    toggleStep,
    startTask,
    completeTask,
    allStepsCompleted,
    estimatedMinutes,
  };
};
