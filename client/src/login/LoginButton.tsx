import React, { useContext, useEffect, useState } from 'react';
import { LoginProvider } from '../model';
import ServicesContext from '../services/servicesContext';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

function loginViaProvider(provider: LoginProvider) {
  const loginUrl = new URL(provider.auth_url);
  loginUrl.searchParams.set('client_id', provider.client_id);
  loginUrl.searchParams.set('redirect_uri', provider.redirect_url);

  if (provider.scope) {
    loginUrl.searchParams.set('scope', provider.scope);
  }

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
      <Dialog isOpen={dialogIsOpen} onClose={() => setDialogIsOpen(false)} title="Вход">
        <div className={Classes.DIALOG_BODY}>
          <p>Войдите через одну из социальных сетей, чтобы рассказать свою историю</p>
          {loginProviders.map(provider => (
            <div key={provider.name}>
              <Button onClick={() => loginViaProvider(provider)}>{provider.name}</Button>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
