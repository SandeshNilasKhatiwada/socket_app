import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ChatPage extends StatefulWidget {
  final String token;
  final String username;
  final Function onLogout;

  ChatPage(
      {required this.token, required this.username, required this.onLogout});

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  IO.Socket? socket;
  List<Map<String, dynamic>> messages = [];
  TextEditingController messageController = TextEditingController();
  bool fetchedMessages = false;

  @override
  void initState() {
    super.initState();
    fetchOldMessages();
    connectToSocket();
  }

  void fetchOldMessages() async {
    if (fetchedMessages) return;

    final response =
        await http.get(Uri.parse('http://localhost:5000/api/messages'));
    if (response.statusCode == 200) {
      setState(() {
        messages = List<Map<String, dynamic>>.from(jsonDecode(response.body));
        fetchedMessages = true;
      });
    }
  }

  void connectToSocket() {
    socket = IO.io('http://localhost:5000', {
      'transports': ['websocket'],
      'auth': {'token': widget.token}
    });

    socket!.onConnect((_) {
      print("✅ Connected to Socket.IO server");
    });

    socket!.on("receive_message", (data) {
      print("📩 New message received: ${data['username']}: ${data['message']}");
      setState(() {
        messages.add(data);
      });
    });

    socket!.onDisconnect((_) {
      print("❌ Disconnected");
    });
  }

  void sendMessage() async {
    if (messageController.text.isNotEmpty && socket != null) {
      final messageData = {
        "username": widget.username,
        "message": messageController.text
      };

      try {
        await http.post(
          Uri.parse('http://localhost:5000/api/messages'),
          body: jsonEncode(messageData),
          headers: {"Content-Type": "application/json"},
        );

        socket!.emit("send_message", messageData);
        setState(() {
          messages.add(messageData);
        });
        messageController.clear();
      } catch (error) {
        print("Error sending message: $error");
      }
    }
  }

  void handleLogout() async {
    await AuthService().logout();
    widget.onLogout();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Chat App"),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: handleLogout,
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(
                    "${messages[index]['username']}: ${messages[index]['message']}",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.all(8.0),
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
    );
  }
}
