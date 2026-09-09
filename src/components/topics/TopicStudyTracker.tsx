"use client";

import { useEffect } from "react";
import { StorageService } from "@/lib/persistence/StorageService";

interface TopicStudyTrackerProps {
  topicId: string;
  topicName: string;
  category: "verbal" | "nonverbal";
}

export function TopicStudyTracker({ topicId, topicName, category }: TopicStudyTrackerProps) {
  useEffect(() => {
    StorageService.saveLastStudiedTopic({
      topicId,
      topicName,
      category,
      timestamp: Date.now(),
    });
  }, [topicId, topicName, category]);

  return null;
}
