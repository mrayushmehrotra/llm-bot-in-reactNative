import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
const PALM_API_KEY = "YOUR_API_KEY";
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const generateText = async () => {
    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText";
    const requestData = {
      prompt: {
        text: inputText,
      },
      temperature: 0.25,
      top_k: 40,
      top_p: 0.95,
      candidate_count: 1,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      if (inputText.trim() === "") {
        return;
      }
      const response = await axios.post(
        `${apiUrl}?key=${PALM_API_KEY}`,
        requestData,
        {
          headers,
        }
      );
      if (response.status === 200) {
        if (
          response.data &&
          response.data.candidates &&
          response.data.candidates.length > 0
        ) {
          const botResponse = response.data.candidates[0].output;
          // add the user's input to the message array
          const newUserMessage = {
            id: messages.length + 1,
            text: inputText,
            sender: "user",
            timestamp: new Date().getTime(),
          };
          // add the bot input to the message array
          const newBotMessage = {
            id: messages.length + 2,
            text: botResponse,
            sender: "bot",
            timestamp: new Date().getTime(),
          };
          setMessages([...messages, newUserMessage, newBotMessage]);
          setInputText("");
        } else {
          console.error("Response structure error");
        }
      } else {
        console.error("Google Cloud API Error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Boi</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: item.sender === "user" ? "#007aff" : "#E5E5EA",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: item.sender === "user" ? "white" : "black",
                }}
              >
                {item.sender === "user" ? item.text : item.text}
              </Text>
              <Text
                style={{
                  color: item.sender === "user" ? "white" : "black",
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Let's talk Boi..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={generateText} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sendButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#007aff",
  },
});
