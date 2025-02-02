import 'package:flutter/material.dart';
import '../services/auth_services.dart';

class RegisterPage extends StatefulWidget {
  final VoidCallback onLoginSelected;

  RegisterPage({required this.onLoginSelected});

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final AuthService authService = AuthService();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String message = "";

  void register() async {
    bool success = await authService.register(
      usernameController.text,
      emailController.text,
      passwordController.text,
    );

    if (success) {
      setState(() {
        message = "Registration successful! Please login.";
      });
      Future.delayed(Duration(seconds: 2), widget.onLoginSelected);
    } else {
      setState(() {
        message = "Registration failed.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text("Register", style: TextStyle(fontSize: 24)),
        TextField(
            controller: usernameController,
            decoration: InputDecoration(labelText: "Username")),
        TextField(
            controller: emailController,
            decoration: InputDecoration(labelText: "Email")),
        TextField(
            controller: passwordController,
            obscureText: true,
            decoration: InputDecoration(labelText: "Password")),
        ElevatedButton(onPressed: register, child: Text("Register")),
        TextButton(
            onPressed: widget.onLoginSelected,
            child: Text("Already have an account? Login")),
        Text(message, style: TextStyle(color: Colors.green)),
      ],
    );
  }
}
