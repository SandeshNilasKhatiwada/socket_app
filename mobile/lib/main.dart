import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'pages/login.dart';
import 'pages/register.dart';
import 'pages/chat.dart';
import './services/auth_service.dart';

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
  bool showLogin = true;

  void handleLogin(String user, String tokenValue) {
    setState(() {
      username = user;
      token = tokenValue;
    });
  }

  void handleLogout() async {
    await AuthService().logout();
    setState(() {
      token = null;
      username = null;
      showLogin = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: token == null
          ? (showLogin
              ? LoginPage(
                  onLoginSuccess: handleLogin,
                  onRegisterSelected: () => setState(() => showLogin = false))
              : RegisterPage(
                  onLoginSelected: () => setState(() => showLogin = true)))
          : ChatPage(
              token: token!, username: username!, onLogout: handleLogout),
    );
  }
}
