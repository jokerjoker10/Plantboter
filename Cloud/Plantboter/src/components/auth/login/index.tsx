import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import Loading from '../../loading';
import { useState } from 'react';
import check from '../../../services/tests';

interface ContainerProps { }

const LoginComponent: React.FC<ContainerProps> = () => {
  const [allow_regestration, set_allow_regestration] = useState(false);
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');

  const [loading, set_loading] = useState('none');
  const [display_error, set_display_error] = useState('');

  function handleLogin(){
    if(!email){
      set_display_error('Email Required');
      return;
    }
    else if(!password){
      set_display_error('Password Required');
      return;
    }

    set_loading('loading');
    api.login({
      email: email,
      password: password
    })
    .then((response) => {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      window.location.href = "/"
    })
    .catch((error) => {
      set_loading('error');
      set_display_error(error.response.data.error || error.response.data.message || 'Unknown error');
    });
  }

  useIonViewDidEnter(() => {
    api.getSettings()
    .then((settings) => {
      set_allow_regestration(settings.data.settings.allow_regestration);
    })
    .catch((error) => {
      if(error.response == undefined){
        set_display_error('Unknown Error Connecting to server');
        return;
      }
      set_display_error(error.response.data.error || error.response.data.message || 'Unknown error');
    });
  });

  return (
    <IonCard class="login-card">
      <IonCardHeader>
        <IonCardTitle>Login</IonCardTitle>
      </IonCardHeader>

      <IonItem color="warning" id="error_message" style={{display: display_error != '' ? "block" : "none"}}>
        <IonIcon icon={warningOutline}></IonIcon>
        <IonContent color="warning">
          {display_error}
        </IonContent>
      </IonItem>

      <IonCardContent>
        <IonItem>
          <IonLabel position="floating">E-Mail</IonLabel>
          <IonInput type="email" id="email" value={email} onIonChange={(e: any) => set_email(e.target.value)} autofocus={true}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" name="password" value={password} onIonChange={(e: any) => set_password(e.target.value)}></IonInput>
        </IonItem>
        <IonButton onClick={e => handleLogin()} expand="block">Login
          <Loading status={loading} slot="end"></Loading>
        </IonButton>
        <IonButton href="auth/register" fill="outline" expand="block" disabled={!allow_regestration}>Register</IonButton>
      </IonCardContent>
      <IonCardSubtitle>
        <IonItem href="auth/resetpassword">
          <IonLabel>Forgot Password?</IonLabel>
        </IonItem>
      </IonCardSubtitle>
    </IonCard>
  );
};

export default LoginComponent;
