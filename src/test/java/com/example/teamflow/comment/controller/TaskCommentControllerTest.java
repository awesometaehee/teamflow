package com.example.teamflow.comment.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class TaskCommentControllerTest {

    private final WebApplicationContext context;

    private MockMvc mockMvc;

    TaskCommentControllerTest(WebApplicationContext context) {
        this.context = context;
    }

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void createsCommentForAssignee() throws Exception {
        mockMvc.perform(post("/api/tasks/2/comments")
                        .header("X-User-Id", 2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": "I will handle the next revision."
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.author.id").value(2))
                .andExpect(jsonPath("$.content").value("I will handle the next revision."));
    }

    @Test
    void returnsCommentsForSharedUser() throws Exception {
        mockMvc.perform(get("/api/tasks/2/comments")
                        .header("X-User-Id", 3))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author.id").value(1))
                .andExpect(jsonPath("$[1].author.id").value(2));
    }

    @Test
    void rejectsBlankCommentContent() throws Exception {
        mockMvc.perform(post("/api/tasks/2/comments")
                        .header("X-User-Id", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": "   "
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void forbidsCommentForUnrelatedUser() throws Exception {
        mockMvc.perform(post("/api/tasks/1/comments")
                        .header("X-User-Id", 3)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": "This should not be allowed."
                                }
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("TASK_FORBIDDEN"));
    }
}
