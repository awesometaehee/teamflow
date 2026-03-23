package com.example.teamflow.share.controller;

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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class TaskShareControllerTest {

    private final WebApplicationContext context;

    private MockMvc mockMvc;

    TaskShareControllerTest(WebApplicationContext context) {
        this.context = context;
    }

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void addsSharedUserForCreator() throws Exception {
        mockMvc.perform(post("/api/tasks/1/shares")
                        .header("X-User-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": 3
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sharedUsers[0].id").value(3));
    }

    @Test
    void removesSharedUserForCreator() throws Exception {
        mockMvc.perform(delete("/api/tasks/4/shares/1")
                        .header("X-User-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sharedUsers").isEmpty());
    }

    @Test
    void returnsAssignedAndSharedTasks() throws Exception {
        mockMvc.perform(get("/api/tasks/shared")
                        .header("X-User-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignedTasks").isEmpty())
                .andExpect(jsonPath("$.sharedTasks[0].title").value("Write Bob onboarding draft"));
    }

    @Test
    void allowsSharedUserToViewTaskDetail() throws Exception {
        mockMvc.perform(get("/api/tasks/2")
                        .header("X-User-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sharedUsers[0].id").value(3));
    }

    @Test
    void forbidsNonCreatorFromManagingShares() throws Exception {
        mockMvc.perform(post("/api/tasks/1/shares")
                        .header("X-User-Id", 2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": 3
                                }
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("TASK_FORBIDDEN"));
    }
}
