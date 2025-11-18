<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email {
    public $email;
    public $nombre;
    public $token;
    
    // Constructor que recibe email, nombre y token
    public function __construct($email, $nombre, $token) {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    // Método para enviar correo de confirmación de cuenta
    public function enviar_confirmacion() {
        // Crear una nueva instancia de PHPMailer
        $mail = new PHPMailer();
        $mail->isSMTP(); // Usar protocolo SMTP
        $mail->Host = $_ENV['EMAIL_HOST']; // Servidor SMTP
        $mail->SMTPAuth = true; // Habilitar autenticación SMTP
        $mail->Port = $_ENV['EMAIL_PORT']; // Puerto SMTP
        $mail->Username = $_ENV['EMAIL_USER']; // Usuario SMTP
        $mail->Password = $_ENV['EMAIL_PASS']; // Contraseña SMTP

        // Dirección del remitente
        $mail->setFrom('soporte@balancepro-corporation.com');
        // Dirección del destinatario
        $mail->addAddress($this->email, $this->nombre);
        // Asunto del correo
        $mail->Subject = 'Confirmación de cuenta';

        // Configuración para enviar en formato HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        // Contenido del correo en HTML
        $contenido  = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre .  "</strong>, gracias por registrarte en Balance Pro App. Solo falta confirmar tu cuenta.</p>";
        $contenido .= "<p>Haz clic en el siguiente enlace: <a href='" . $_ENV['HOST'] . "/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a></p>";       
        $contenido .= "<p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>";
        $contenido .= '</html>';
        
        $mail->Body = $contenido;
        // Enviar el correo
        $mail->send();
    }

    // Método para enviar correo de instrucciones
    public function enviar_instrucciones() {
         // Crear una nueva instancia de PHPMailer
        $mail = new PHPMailer();
        $mail->isSMTP(); // Usar protocolo SMTP
        $mail->Host = $_ENV['EMAIL_HOST']; // Servidor SMTP
        $mail->SMTPAuth = true; // Habilitar autenticación SMTP
        $mail->Port = $_ENV['EMAIL_PORT']; // Puerto SMTP
        $mail->Username = $_ENV['EMAIL_USER']; // Usuario SMTP
        $mail->Password = $_ENV['EMAIL_PASS']; // Contraseña SMTP

        // Dirección del remitente
        $mail->setFrom('soporte@balancepro-corporation.com');
        // Dirección del destinatario
        $mail->addAddress($this->email, $this->nombre);
        // Asunto del correo
        $mail->Subject = 'Restablece tu contraseña - Balance Pro App';

         // Configuración para enviar en formato HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8';

        // Contenido del correo en HTML
        $contenido  = '<html>';
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong>, has solicitado restablecer tu contraseña.</p>";
        $contenido .= "<p>Haz clic en el siguiente enlace para crear una nueva contraseña: 
                        <a href='" . $_ENV['HOST'] . "/restablecer-password?token=" . $this->token . "'>Restablecer Contraseña</a></p>";
        $contenido .= "<p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>";
        $contenido .= '</html>';
        
        $mail->Body = $contenido;
        // Enviar el correo
        $mail->send();
    }
}
?>