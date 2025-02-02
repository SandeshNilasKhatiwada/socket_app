import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'pages/login.dart';
import 'pages/register.dart';
import './services/auth_services.dart';

void main() {
  runApp(ChatApp());
}

class ChatApp extends StatefulWidget {
  @override
  _ChatAppState createState() => _ChatAppState();
}

class _ChatAppState extends State<ChatApp> {
  String? token;
  String? username;
  IO.Socket? socket;
  List<String> messages = [];
  TextEditingController messageController = TextEditingController();
  bool showLogin = true;

  @override
  void initState() {
    super.initState();
    checkAuth();
  }

  void checkAuth() async {
    AuthService authService = AuthService();
    String? storedToken = await authService.getToken();
    if (storedToken != null) {
      setState(() {
        token = storedToken;
      });
      connectToSocket();
    }
  }

  void connectToSocket() {
    socket = IO.io('http://localhost:5000', {
      // Replace with your local IP
      'transports': ['websocket'],
      'auth': {'token': token}
    });

    socket!.onConnect((_) {
      print("✅ Connected to Socket.IO server");
    });

    socket!.on("receive_message", (data) {
      print("📩 New message received: ${data['username']}: ${data['message']}");

      // Fix: Convert Map to formatted String before adding to the list
      setState(() {
        messages.add("${data['username']}: ${data['message']}");
      });
    });

    socket!.onDisconnect((_) {
      print("❌ Disconnected");
    });
  }

  void sendMessage() {
    if (messageController.text.isNotEmpty) {
      socket!.emit("send_message", messageController.text);
      messageController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("Chat App")),
        body: token == null
            ? showLogin
                ? LoginPage(
                    onRegisterSelected: () => setState(() => showLogin = false),
                    onLoginSuccess: (user) {
                      setState(() {
                        username = user;
                        token = token;
                      });
                      connectToSocket();
                    })
                : RegisterPage(
                    onLoginSelected: () => setState(() => showLogin = true))
            : Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      itemCount: messages.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          title: Text(
                            messages[index],
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                        );
                      },
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: messageController,
                            decoration: InputDecoration(
                              labelText: "Type a message...",
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        SizedBox(width: 10),
                        ElevatedButton(
                          onPressed: sendMessage,
                          child: Text("Send"),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
