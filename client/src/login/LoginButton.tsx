import React, { useContext, useEffect, useState } from 'react';
import { LoginProvider } from '../model';
import ServicesContext from '../services/servicesContext';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

function loginViaProvider(provider: LoginProvider) {
  const loginUrl = new URL(provider.auth_url);
  loginUrl.searchParams.set('client_id', provider.client_id);
  const redirectUrl = new URL(provider.redirect_url);

  if (provider.scope) {
    loginUrl.searchParams.set('scope', provider.scope);
  }

  if (provider.response_type) {
    loginUrl.searchParams.set('response_type', provider.response_type);
  }

  loginUrl.searchParams.set('redirect_uri', redirectUrl.toString());

  window.location.assign(loginUrl.href);
}

export const LoginButton: React.FC = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [loginProviders, setLoginProviders] = useState<LoginProvider[]>([]);
  const services = useContext(ServicesContext);

  useEffect(() => {
    if (dialogIsOpen && loginProviders.length === 0) {
      services.apiClient.getLoginProviders().then(setLoginProviders);
    }
  }, [dialogIsOpen, loginProviders, services]);

  return (
    <>
      <Button intent={Intent.PRIMARY} onClick={() => setDialogIsOpen(true)}>
        Войти
      </Button>
      <Dialog isOpen={dialogIsOpen} className="login-dialog" onClose={() => setDialogIsOpen(false)} title="Вход">
        <div className={Classes.DIALOG_BODY}>
          <p>Войдите через одну из социальных сетей, чтобы рассказать свою историю</p>
          {loginProviders.map(provider => (
            <div key={provider.name} className="login-button">
              <a href="javascript:void(0)" onClick={() => loginViaProvider(provider)}>
                <img src={provider.image} alt={provider.name} />
              </a>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
