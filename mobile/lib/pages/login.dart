import 'package:flutter/material.dart';
import '../services/auth_services.dart';

class LoginPage extends StatefulWidget {
  final VoidCallback onRegisterSelected;
  final Function(String) onLoginSuccess;

  LoginPage({required this.onRegisterSelected, required this.onLoginSuccess});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final AuthService authService = AuthService();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String message = "";

  void login() async {
    bool success =
        await authService.login(emailController.text, passwordController.text);
    if (success) {
      widget.onLoginSuccess(emailController.text);
    } else {
      setState(() {
        message = "Login failed.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text("Login", style: TextStyle(fontSize: 24)),
        TextField(
            controller: emailController,
            decoration: InputDecoration(labelText: "Email")),
        TextField(
            controller: passwordController,
            obscureText: true,
            decoration: InputDecoration(labelText: "Password")),
        ElevatedButton(onPressed: login, child: Text("Login")),
        TextButton(
            onPressed: widget.onRegisterSelected,
            child: Text("Don't have an account? Register")),
        Text(message, style: TextStyle(color: Colors.red)),
      ],
    );
  }
}
