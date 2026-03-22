package com.example.teamflow.task.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class TaskControllerTest {

    private final WebApplicationContext context;

    private MockMvc mockMvc;

    TaskControllerTest(WebApplicationContext context) {
        this.context = context;
    }

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void createsTaskWithTitleOnly() throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .header("X-User-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Write API smoke test"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.title").value("Write API smoke test"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.dueAt").isEmpty());
    }

    @Test
    void returnsTodayTasksForFilterToday() throws Exception {
        mockMvc.perform(get("/api/tasks/my")
                        .header("X-User-Id", 1)
                        .param("filter", "today"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$[0].title").value("Plan Phase 2 API"))
                .andExpect(jsonPath("$[0].status").value("TODO"));
    }

    @Test
    void returnsUpcomingTasksForFilterUpcoming() throws Exception {
        mockMvc.perform(get("/api/tasks/my")
                        .header("X-User-Id", 1)
                        .param("filter", "upcoming"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$[0].title").value("Review shared workflow"));
    }

    @Test
    void returnsDoneTasksForFilterDone() throws Exception {
        mockMvc.perform(get("/api/tasks/my")
                        .header("X-User-Id", 1)
                        .param("filter", "done"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$[0].title").value("Archive old MVP notes"))
                .andExpect(jsonPath("$[0].status").value("DONE"));
    }

    @Test
    void returnsUnauthorizedWhenUserHeaderIsMissing() throws Exception {
        mockMvc.perform(get("/api/tasks/my")
                        .param("filter", "all"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("USER_CONTEXT_REQUIRED"));
    }

    @Test
    void returnsBadRequestForInvalidFilter() throws Exception {
        mockMvc.perform(get("/api/tasks/my")
                        .header("X-User-Id", 1)
                        .param("filter", "invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_TASK_FILTER"));
    }
}
