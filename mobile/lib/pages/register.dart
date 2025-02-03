import 'package:flutter/material.dart';
import '../services/auth_service.dart';

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
    return Scaffold(
      appBar: AppBar(title: Text("Register")),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
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
            SizedBox(height: 20),
            ElevatedButton(onPressed: register, child: Text("Register")),
            if (message.isNotEmpty)
              Text(message, style: TextStyle(color: Colors.green)),
            TextButton(
                onPressed: widget.onLoginSelected,
                child: Text("Already have an account? Login"))
          ],
        ),
      ),
    );
  }
}
