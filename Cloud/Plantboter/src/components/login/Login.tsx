import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './Style.css';
import api from '../../services/Api';
import LOGIN_REGEX from '../../services/tests/login';
import { useState } from 'react';

interface ContainerProps { }

const LoginComponent: React.FC<ContainerProps> = () => {
  const [allow_regestration, set_allow_regestration] = useState(false);
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');

  var [display_error, set_display_error] = useState(false);

  var settings_fetched = false;
  if(!settings_fetched){
    settings_fetched = true;
    api.getSettings()
    .then((settings) => {
      set_allow_regestration(settings.data.settings.allow_regestration);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function handleLogin(){
    api.login({
      email: email,
      password: password
    })
    .then((response) => {
      console.log("User Logged in");
      console.log(response.data)
      window.location.href = "home"
    })
    .catch((error) => {
      set_display_error(true);
      console.log(error);
    })
  }

  return (
    <IonCard class="login-card">
      <IonCardHeader>
        <IonCardTitle>Login</IonCardTitle>
      </IonCardHeader>

      <IonItem color="warning" id="error_message" style={{display: display_error ? "block" : "none"}}>
        <IonIcon icon={warningOutline}></IonIcon>
        <IonLabel>
          Wrong Email or Password
        </IonLabel>
      </IonItem>

      <IonCardContent>
        <IonItem>
          <IonLabel position="floating">E-Mail</IonLabel>
          <IonInput type="email" id="email" value={email} onIonChange={(e: any) => set_email(e.target.value)} autofocus={true}/>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" name="password" value={password} onIonChange={(e: any) => set_password(e.target.value)}></IonInput>
        </IonItem>
        <IonButton onClick={e => handleLogin()}>Login</IonButton>
        <IonButton href="auth/register" disabled={!allow_regestration} color="light">Register</IonButton>
      </IonCardContent>
      <IonCardSubtitle>
        <IonItem href="resetpassword">
          <IonLabel >Forgot Password?</IonLabel>
        </IonItem>
      </IonCardSubtitle>
    </IonCard>
  );
};

export default LoginComponent;
