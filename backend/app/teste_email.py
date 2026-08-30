from dotenv import load_dotenv
load_dotenv()

from email_utils import enviar_email_confirmacao

enviar_email_confirmacao("santosthalles815@gmail.com", "token-de-teste-123")
print("E-mail enviado! Confira sua caixa de entrada.")