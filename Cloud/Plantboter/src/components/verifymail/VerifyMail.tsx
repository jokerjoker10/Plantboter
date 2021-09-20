import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonLoading, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, IonSpinner } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './Style.css';
import api from '../../services/Api';
import { useState } from 'react';

interface ContainerProps { }

const VerifyMailComponent: React.FC<ContainerProps> = () => {
    const [show_loading, set_show_loading] = useState(false);
    const [show_new_mail_loading, set_show_new_mail_loading] = useState(false);
    const [show_new_mail_error, set_show_new_mail_error] = useState(false);
    const [show_new_mail_success, set_show_new_mail_success] = useState(false);

    const [email, set_email] = useState('');
    const [key, set_key] = useState('');

    var [display_error, set_display_error] = useState(false);

    function handleLogin() {
        api.verifyEmail({
            email: email,
            key: key
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

    function handleMailResend(){
        if(email == ''){
            console.log("error");
        }
        set_show_new_mail_loading(true);
        set_show_new_mail_error(false);
        set_show_new_mail_success(false);
        console.log(email)
        
        api.requestMailVerification({
            email: email
        })
        .then((response) => {

            set_show_new_mail_loading(false);
            set_show_new_mail_error(false);
            set_show_new_mail_success(true);
        })
        .catch((error) => {

            set_show_new_mail_loading(false);
            set_show_new_mail_error(true);
            set_show_new_mail_success(false);
            console.log(error);
        })
    }

    return (
        <IonCard class="login-card">
            <IonCardHeader>
                <IonCardTitle>E-Mail Verification</IonCardTitle>
            </IonCardHeader>

            <IonItem color="warning" id="error_message" style={{ display: display_error ? "block" : "none" }}>
                <IonIcon icon={warningOutline}></IonIcon>
                <IonLabel>
                    Mail Verification failed!
                </IonLabel>
            </IonItem>

            <IonItem>
                <IonText>
                    Insert key from E-Mail
                </IonText>
            </IonItem>
            <IonCardContent>
                <IonItem>
                    <IonLabel position="floating">Key</IonLabel>
                    <IonInput type="text" name="key" value={key} onIonChange={(e: any) => set_key(e.target.value)}></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">E-Mail</IonLabel>
                    <IonInput type="email" id="email" value={email} onIonChange={(e: any) => set_email(e.target.value)} autofocus={true} />
                </IonItem>
                <IonButton onClick={e => handleLogin()}>Verify E-Mail</IonButton>
            </IonCardContent>
            <IonCardSubtitle>
                <IonItem button onClick={handleMailResend}>
                    <IonLabel>No E-Mail? Resend</IonLabel>
                    <IonSpinner name="crescent" style={{display: show_new_mail_loading ? "block" : "none"}}></IonSpinner>
                    <IonIcon icon={closeOutline} style={{display: show_new_mail_error ? "block" : "none"}}></IonIcon>
                    <IonIcon icon={checkmarkOutline} style={{display: show_new_mail_success ? "block" : "none"}}></IonIcon>
                </IonItem>
            </IonCardSubtitle>
        </IonCard>
    );
};

export default VerifyMailComponent;
