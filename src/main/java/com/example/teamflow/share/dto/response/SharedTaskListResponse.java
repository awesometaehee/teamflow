package com.example.teamflow.share.dto.response;

import com.example.teamflow.task.dto.response.TaskSummaryResponse;

import java.util.List;

public record SharedTaskListResponse(
        List<TaskSummaryResponse> assignedTasks,
        List<TaskSummaryResponse> sharedTasks
) {
}
