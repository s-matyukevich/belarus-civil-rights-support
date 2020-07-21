package mail

import (
	"bytes"
	"fmt"
	"html/template"

	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"go.uber.org/zap"
	mailgun "gopkg.in/mailgun/mailgun-go.v1"
)

type Mailer struct {
	cfg *cfg.Mail
	mg  mailgun.Mailgun
}

func NewMailer(config *cfg.Mail) *Mailer {
	return &Mailer{
		cfg: config,
		mg:  mailgun.NewMailgun(config.Domain, config.SecretApiKey, config.PublicApiKey),
	}
}

func (s *Mailer) Send(subject, templateName string, model interface{}, logger *zap.Logger, to string) error {
	tmpl := template.Must(template.ParseFiles("templates/" + templateName + ".html"))

	buffer := bytes.NewBuffer([]byte{})
	err := tmpl.Execute(buffer, model)
	if err != nil {
		return err
	}

	logger.Info("Sending message", zap.String("message", buffer.String()), zap.String("to", to))
	message := s.mg.NewMessage(s.cfg.From, subject, buffer.String(), to)
	_, _, err = s.mg.Send(message)

	if err != nil {
		return fmt.Errorf("mailgun cannot send mail: %v", err)
	}

	return nil
}
