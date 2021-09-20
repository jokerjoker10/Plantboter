import { IonCardHeader, IonCard, IonContent, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import './Login.css';
import LoginComponent from '../components/login/Login';
import RegisterComponent from '../components/register/Register';
import VerifyMailComponent from '../components/verifymail/VerifyMail';
import { RouteComponentProps } from 'react-router';

interface AuthPageProps extends RouteComponentProps<{
  element?: string;
}> {}

const Auth: React.FC<AuthPageProps> = ({match}) => {
  return (
    <IonPage>
      <IonContent fullscreen className="background">
        
        <div className="login">
          <div style={{display: match.params.element == 'login' ? "flex" : "none"}}>
            <LoginComponent></LoginComponent>
          </div>
          <div style={{display: match.params.element == 'register' ? "flex" : "none"}}>
            <RegisterComponent></RegisterComponent>
          </div>
          <div style={{display: match.params.element == 'verifymail' ? "flex" : "none"}}>
            <VerifyMailComponent></VerifyMailComponent>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
