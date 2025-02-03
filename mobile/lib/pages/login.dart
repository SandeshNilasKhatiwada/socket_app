import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginPage extends StatefulWidget {
  final Function(String, String) onLoginSuccess;
  final VoidCallback onRegisterSelected;

  LoginPage({required this.onLoginSuccess, required this.onRegisterSelected});

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
      widget.onLoginSuccess(emailController.text, emailController.text);
    } else {
      setState(() {
        message = "Login failed.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Login")),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
                controller: emailController,
                decoration: InputDecoration(labelText: "Email")),
            TextField(
                controller: passwordController,
                obscureText: true,
                decoration: InputDecoration(labelText: "Password")),
            SizedBox(height: 20),
            ElevatedButton(onPressed: login, child: Text("Login")),
            if (message.isNotEmpty)
              Text(message, style: TextStyle(color: Colors.red)),
            TextButton(
                onPressed: widget.onRegisterSelected,
                child: Text("Don't have an account? Register"))
          ],
        ),
      ),
    );
  }
}
