export interface RecoveryFactors {
  daysSinceSurgery: number;
  brochureProgress: number;
  taskCompletion: number;
  painLevelTrend: number;
  activityEngagement: number;
}

export interface RecoveryProgress {
  overallProgress: number;
  factors: RecoveryFactors;
  breakdown: {
    timeBased: number;
    engagement: number;
    health: number;
  };
  recommendations: string[];
}

interface BrochureSection {
  content: Array<{
    items: Array<{
      completed: boolean;
    }>;
  }>;
}

interface SymptomEntry {
  painLevel: number;
}

export const calculateRecoveryProgress = (
  surgeryDate: string,
  brochureData: BrochureSection[],
  symptomData: SymptomEntry[] = []
): RecoveryProgress => {
  const today = new Date();
  const surgery = new Date(surgeryDate);
  const daysSinceSurgery = Math.floor(
    (today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate brochure progress based on completed items
  let totalItems = 0;
  let completedItems = 0;

  brochureData.forEach((section: BrochureSection) => {
    section.content.forEach(contentBlock => {
      contentBlock.items.forEach(item => {
        totalItems++;
        if (item.completed) completedItems++;
      });
    });
  });

  const brochureProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const taskCompletion = brochureProgress; // Same as brochure progress in new structure

  // Calculate pain level trend (if symptom data available)
  let painLevelTrend = 0;
  if (symptomData.length >= 2) {
    const recentPain =
      symptomData
        .slice(0, 3)
        .reduce((sum: number, entry: SymptomEntry) => sum + entry.painLevel, 0) / 3;
    const olderPain =
      symptomData.slice(-3).reduce((sum: number, entry: SymptomEntry) => sum + entry.painLevel, 0) /
      3;
    painLevelTrend = Math.max(0, ((olderPain - recentPain) / 10) * 100); // Improvement as percentage
  }

  // Calculate activity engagement (based on recent interactions)
  const activityEngagement = 80; // Default engagement since we don't track lastUpdated in new structure

  // Time-based progress (automatic progression over 6 weeks)
  const maxRecoveryDays = 42; // 6 weeks
  const timeBasedProgress = Math.min(100, (daysSinceSurgery / maxRecoveryDays) * 100);

  // Engagement-based progress (user interactions)
  const engagementProgress = (brochureProgress + taskCompletion + activityEngagement) / 3;

  // Health-based progress (symptom improvement)
  const healthProgress = Math.max(0, 100 - painLevelTrend * 0.5); // Lower pain = higher progress

  // Overall progress calculation (weighted average)
  const overallProgress = Math.round(
    timeBasedProgress * 0.4 + // 40% time-based
      engagementProgress * 0.4 + // 40% engagement
      healthProgress * 0.2 // 20% health
  );

  // Generate recommendations
  const recommendations: string[] = [];

  if (brochureProgress < 50) {
    recommendations.push('Complete more sections of your aftercare guide');
  }

  if (taskCompletion < 30) {
    recommendations.push('Check off more daily tasks in your recovery guide');
  }

  if (activityEngagement < 50) {
    recommendations.push('Stay active with your recovery tracking');
  }

  if (painLevelTrend < 20 && symptomData.length > 0) {
    recommendations.push('Continue monitoring your pain levels');
  }

  if (daysSinceSurgery < 7) {
    recommendations.push('Focus on rest and following post-surgery instructions');
  } else if (daysSinceSurgery < 21) {
    recommendations.push('Gradually increase activity as recommended');
  } else if (daysSinceSurgery < 42) {
    recommendations.push("You're in the final recovery phase - maintain good habits");
  }

  return {
    overallProgress: Math.min(100, Math.max(0, overallProgress)),
    factors: {
      daysSinceSurgery,
      brochureProgress,
      taskCompletion,
      painLevelTrend,
      activityEngagement,
    },
    breakdown: {
      timeBased: Math.round(timeBasedProgress),
      engagement: Math.round(engagementProgress),
      health: Math.round(healthProgress),
    },
    recommendations,
  };
};

export const getRecoveryPhase = (daysSinceSurgery: number): string => {
  if (daysSinceSurgery <= 7) return 'Early Recovery';
  if (daysSinceSurgery <= 14) return 'Initial Healing';
  if (daysSinceSurgery <= 28) return 'Active Recovery';
  if (daysSinceSurgery <= 42) return 'Final Recovery';
  return 'Recovery Complete';
};

export const getRecoveryPhaseColor = (phase: string): string => {
  switch (phase) {
    case 'Early Recovery':
      return 'red';
    case 'Initial Healing':
      return 'orange';
    case 'Active Recovery':
      return 'yellow';
    case 'Final Recovery':
      return 'green';
    case 'Recovery Complete':
      return 'blue';
    default:
      return 'gray';
  }
};
