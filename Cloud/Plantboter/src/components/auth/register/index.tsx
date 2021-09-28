import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useState } from 'react';
import Loading from '../../loading';
import check from '../../../services/tests';
import { func } from 'prop-types';

interface ContainerProps { }

const RegisterComponent: React.FC<ContainerProps> = () => {
  const [allow_regestration, set_allow_regestration] = useState(false);
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [second_password, set_second_password] = useState('');

  var [display_error, set_display_error] = useState('');
  const [loading, set_loading] = useState('none');

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

  function handleSignup(){
    if(!email){
      set_display_error('Email Required!');
      return;
    }
    else if(!password){
      set_display_error('Password Required!');
      return;
    }
    else if(!second_password){
      set_display_error('Please retype the Password!');
      return;
    }
    else if(password != second_password){
      set_display_error('Passwords do not match');
      return;
    }
    else if(!check(email, "email").success){
      set_display_error('This is no Valid Email Address');
      return;
    }
    else if(!check(password, "password").success){
      set_display_error('Password needs to have: \n\n- 8 to 32 Character\n\n- At least one letter: a-z, A-Z\n\n- At least one special Character: *!@$%&?/~_=|');
      return;
    }
    else if(!check(second_password, "password").success){
      set_display_error('Password needs to have: \n\n- 8 to 32 Character\n\n- At least one letter: a-z, A-Z\n\n- At least one special Character: *!@$%&?/~_=|');
      return;
    }

    set_loading('loading');
    api.signup({
      email: email,
      password: password,
      second_password: second_password
    })
    .then((response) => {
      set_loading('success');
      console.log("User Logged in");
      console.log(response.data)
      window.location.href = "auth/verifymail"
    })
    .catch((error) => {
      set_loading('error');
      set_display_error(error.response.data.error || error.response.data.message || 'Unknown error');
    })
  }

  function checkSecondPassword(){
    if(second_password == ''){
      return 'none';
    }
    else if(password == second_password){
      return 'success';
    }
    return 'error';
  }

  return (
    <IonCard class="login-card">
      <IonCardHeader>
        <IonCardTitle>Register</IonCardTitle>
      </IonCardHeader>

      <IonItem color="danger" style={{display: !allow_regestration ? "block" : "none"}}>
        <IonIcon icon={closeOutline}></IonIcon>
        <IonLabel>
          No User Registration
        </IonLabel>
      </IonItem>

      <IonItem color="warning" style={{display: display_error != '' ? "block" : "none", heitght: "fit-content"}}>
        <IonIcon icon={warningOutline}></IonIcon>
        <IonContent color="warning">
          {display_error}
        </IonContent>
      </IonItem>

      <IonCardContent>
        <IonItem>
          <IonLabel position="floating">E-Mail</IonLabel>
          <IonInput type="email" id="email" value={email} onIonChange={(e: any) => set_email(e.target.value)} autofocus={true} disabled={!allow_regestration}/>
          <Loading status={check(email, "email").status} slot="end"></Loading>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" name="password" value={password} onIonChange={(e: any) => set_password(e.target.value)} disabled={!allow_regestration}></IonInput>
          <Loading status={check(password, "password").status} slot="end"></Loading>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Repeat Password</IonLabel>
          <IonInput type="password" name="password" value={second_password} onIonChange={(e: any) => set_second_password(e.target.value)} disabled={!allow_regestration}></IonInput>
          <Loading status={checkSecondPassword()} slot="end"></Loading>        
        </IonItem>
        <IonButton disabled={!allow_regestration} onClick={e => handleSignup()} expand="block">Register<Loading status={loading} slot="end"></Loading></IonButton>
        <IonButton href="/auth/login" fill="outline" expand="block">Back to Login</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default RegisterComponent;