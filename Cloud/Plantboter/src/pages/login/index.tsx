import { IonCardHeader, IonCard, IonContent, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import './style.css';
import LoginComponent from '../../components/auth/login';
import RegisterComponent from '../../components/auth/register';
import VerifyMailComponent from '../../components/auth/verifymail';
import ResetPassword from '../../components/auth/resetpassword';
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
          <div style={{display: match.params.element == 'resetpassword' ? "flex" : "none"}}>
            <ResetPassword></ResetPassword>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
