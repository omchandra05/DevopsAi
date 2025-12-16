package com.chatbot;

import com.google.genai.Client;
import com.google.genai.types.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class GeminiService extends HttpServlet {

    private static final String API_KEY = System.getenv("GEMINI_API_KEY");
    private static final String MODEL_NAME = "gemini-2.5-flash"; 
    private static final String DEFAULT_INSTRUCTION = "You are DevOps AI, a helpful assistant expert in Docker, Kubernetes, and CI/CD.";

    private Client client;

    @Override
    public void init() throws ServletException {
        if (API_KEY == null || API_KEY.isEmpty()) {
            System.err.println("❌ CRITICAL ERROR: GEMINI_API_KEY is not set!");
        } else {
            System.out.println("✅ Gemini Service Initialized");
            this.client = Client.builder().apiKey(API_KEY).build();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        try {
            // --- 1. Read Input ---
            StringBuilder sb = new StringBuilder();
            String line;
            BufferedReader reader = req.getReader();
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            
            JsonObject requestJson = gson.fromJson(sb.toString(), JsonObject.class);
            String userMessage = requestJson.has("message") ? requestJson.get("message").getAsString() : "";
            String frontendInstruction = requestJson.has("system_instruction") 
                                         ? requestJson.get("system_instruction").getAsString() 
                                         : null;

            if (userMessage.isEmpty()) {
                responseJson.addProperty("error", "Message cannot be empty");
                out.print(gson.toJson(responseJson));
                return;
            }

            // --- 2. Build Request ---
            String finalSystemInstruction = (frontendInstruction != null && !frontendInstruction.isEmpty()) 
                                            ? frontendInstruction 
                                            : DEFAULT_INSTRUCTION;

            Content userContent = Content.builder()
                .role("user")
                .parts(Collections.singletonList(Part.fromText(userMessage)))
                .build();

            Content systemContent = Content.builder()
                .role("user") 
                .parts(Collections.singletonList(Part.fromText(finalSystemInstruction)))
                .build();

            GenerateContentConfig config = GenerateContentConfig.builder()
                .temperature(0.7f)
                .systemInstruction(systemContent)
                .build();

            // --- 3. Call AI ---
            GenerateContentResponse response = client.models.generateContent(
                MODEL_NAME, 
                userContent, 
                config
            );

            // --- 4. Extract Response (STRICT UNWRAPPING) ---
            String botReply = "No response generated.";

            // Step A: Unwrap Candidates
            if (response.candidates().isPresent()) {
                List<Candidate> candidates = response.candidates().get();
                if (!candidates.isEmpty()) {
                    Candidate firstCandidate = candidates.get(0);
                    
                    // Step B: Unwrap Content
                    if (firstCandidate.content().isPresent()) {
                        Content content = firstCandidate.content().get();
                        
                        // Step C: Unwrap Parts (The Fix!)
                        // content.parts() returns Optional<List<Part>>
                        if (content.parts().isPresent()) {
                            List<Part> parts = content.parts().get(); // Unwrap the list first
                            
                            if (!parts.isEmpty()) {
                                // Now we can use index 0
                                botReply = parts.get(0).text().orElse("No text content found.");
                            }
                        }
                    }
                }
            }

            responseJson.addProperty("response", botReply);
            out.print(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("error", "Server Error: " + e.getMessage());
            out.print(gson.toJson(responseJson));
        } finally {
            out.flush();
        }
    }
}