package com.example.teamflow.notification.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class NotificationControllerTest {

    private final WebApplicationContext context;

    private MockMvc mockMvc;

    NotificationControllerTest(WebApplicationContext context) {
        this.context = context;
    }

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void createsAssignedNotificationWhenAssigneeChanges() throws Exception {
        mockMvc.perform(put("/api/tasks/1")
                        .header("X-User-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Plan Phase 2 API",
                                  "description": "Define the quick-add request and response DTOs",
                                  "dueAt": null,
                                  "assigneeId": 2
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/notifications")
                        .header("X-User-Id", 2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("ASSIGNED"));
    }

    @Test
    void createsSharedNotificationWhenTaskIsShared() throws Exception {
        mockMvc.perform(post("/api/tasks/1/shares")
                        .header("X-User-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": 3
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/notifications")
                        .header("X-User-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("SHARED"));
    }

    @Test
    void createsCommentNotificationsForRelatedUsersExceptAuthor() throws Exception {
        mockMvc.perform(post("/api/tasks/2/comments")
                        .header("X-User-Id", 2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": "Leaving an update for the team."
                                }
                                """))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/notifications")
                        .header("X-User-Id", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("COMMENTED"));

        mockMvc.perform(get("/api/notifications")
                        .header("X-User-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("COMMENTED"));
    }

    @Test
    void marksNotificationAsRead() throws Exception {
        mockMvc.perform(patch("/api/notifications/3/read")
                        .header("X-User-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));
    }
}
