package com.example.teamflow.task.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class TaskLifecycleControllerTest {

    private final WebApplicationContext context;

    private MockMvc mockMvc;

    TaskLifecycleControllerTest(WebApplicationContext context) {
        this.context = context;
    }

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void returnsTaskDetailForCreator() throws Exception {
        mockMvc.perform(get("/api/tasks/2")
                        .header("X-User-Id", 1))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.creator.id").value(1))
                .andExpect(jsonPath("$.assignee.id").value(2));
    }

    @Test
    void updatesTaskForCreator() throws Exception {
        mockMvc.perform(put("/api/tasks/1")
                        .header("X-User-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Plan Phase 3 API",
                                  "description": "Expand lifecycle endpoints",
                                  "dueAt": null,
                                  "assigneeId": 2
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Plan Phase 3 API"))
                .andExpect(jsonPath("$.description").value("Expand lifecycle endpoints"))
                .andExpect(jsonPath("$.assignee.id").value(2));
    }

    @Test
    void letsAssigneeChangeTaskStatus() throws Exception {
        mockMvc.perform(patch("/api/tasks/2/status")
                        .header("X-User-Id", 2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "status": "DONE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.completedAt").isNotEmpty());
    }

    @Test
    void forbidsUnrelatedUserFromViewingTask() throws Exception {
        mockMvc.perform(get("/api/tasks/1")
                        .header("X-User-Id", 3))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("TASK_FORBIDDEN"));
    }

    @Test
    void forbidsNonCreatorFromDeletingTask() throws Exception {
        mockMvc.perform(delete("/api/tasks/1")
                        .header("X-User-Id", 2))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("TASK_FORBIDDEN"));
    }

    @Test
    void deletesTaskForCreator() throws Exception {
        mockMvc.perform(delete("/api/tasks/1")
                        .header("X-User-Id", 1))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/tasks/1")
                        .header("X-User-Id", 1))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("TASK_NOT_FOUND"));
    }
}
