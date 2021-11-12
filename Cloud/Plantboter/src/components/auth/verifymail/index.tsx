import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonLoading, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, IonSpinner, useIonViewDidEnter } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useEffect, useState } from 'react';
import Loading from '../../loading';
import { useHistory, useLocation } from 'react-router';
import check from '../../../services/tests';

interface ContainerProps { }

const VerifyMailComponent: React.FC<ContainerProps> = () => {
    const [loading_status, set_loading_status] = useState('none');
    const [resend_loading_status, set_resend_loading_status] = useState('none')

    const [resend_mail, set_resent_mail] = useState('');
    const [email, set_email] = useState('');
    const [key, set_key] = useState('');

    const [display_resend_input, set_display_resend_input] = useState(false);
    const [resend_error, set_resend_error] = useState('');
    var [error_message, set_error_message] = useState('');

    const location = useLocation();
    const history = useHistory();

    var query_mail = '';
    var query_key = '';
    var query_used = '';

    useEffect(() => {
        query_mail = new URLSearchParams(location.search).get('m') || '';
        query_key = new URLSearchParams(location.search).get('k') || '';
        query_used = new URLSearchParams(location.search).get('used') || '';
        set_email(query_mail);
        set_resent_mail(query_mail);
        set_key(query_key);
    }, []);

    function handleVerify() {

        if(!email){
            set_error_message('Email Required');
            return;
        }
        else if(!key){
            set_error_message('Key Required');
            return;
        }
        else if(!check(email, "email").success){
            set_error_message('No Valid Email');
            return;
        }
        else if(!check(key, "key").success){
            set_error_message('Not a valid key format');
            return;
        }

        set_loading_status('loading');
        api.verifyEmail({
            email: email,
            key: key
        })
        .then((response) => {
            set_loading_status('success');
            window.location.href = "auth/login"
        })
        .catch((error) => {
            set_loading_status('error');
            console.log(error);
            set_error_message(error.response.data.error || error.response.data.message || 'Unknown error');
        });
    }

    function handleMailResend() {
        if (!resend_mail) {
            set_resend_error('Please enter a email!')
            set_resend_loading_status('error');
            return;
        }
        else if(!check(resend_mail, "email")){
            set_resend_error('Not a Valid Email');
            set_resend_loading_status('error');
            return;
        }

        set_resend_loading_status('loading');

        api.requestMailVerification({
            email: resend_mail
        })
        .then((response) => {
            set_resend_loading_status('success');
        })
        .catch((error) => {
            set_resend_error(error.response.data.error);
            set_resend_loading_status('error');
        });
    }
    
    useIonViewDidEnter(() => {
        if(query_mail != '' && query_key != '' && !query_used){
            history.replace(`/auth/verifymail?k=${query_key}&m=${query_mail}&used=true`)
            handleVerify();
        }
    });



    return (
        <div>
            <IonCard class="login-card">
                <IonCardHeader>
                    <IonCardTitle>E-Mail Verification</IonCardTitle>
                </IonCardHeader>

                <IonItem color="warning" style={{ display: error_message != '' ? "block" : "none"}}>
                    <IonIcon icon={warningOutline}></IonIcon>
                    <IonContent color="warning">
                        {error_message}
                    </IonContent>
                </IonItem>

                <IonCardContent>
                    <p>
                        On Regestration we send an Email to you. This Mail Contains a key you have to enter here.
                    </p>
                    <p>
                        You could also click the button in the Email and the confirmation will complete automaticaly.
                    </p>
                </IonCardContent>
                <IonCardContent>
                    <IonItem>
                        <IonLabel position="floating">Key</IonLabel>
                        <IonInput type="text" name="key" value={key} onIonChange={(e: any) => set_key(e.target.value)}></IonInput>
                        <Loading status={check(key, "key").status} slot="end"></Loading>
                    </IonItem>
                    <IonButton fill="outline" expand="block" onClick={e => set_display_resend_input(true)}>
                        Dont have a key?
                    </IonButton>
                    <IonItem>
                        <IonLabel position="floating">E-Mail</IonLabel>
                        <IonInput type="email" id="email" value={email} onIonChange={(e: any) => set_email(e.target.value)} autofocus={true} />
                        <Loading status={check(email, "email").status} slot="end"></Loading>
                    </IonItem>
                    <IonButton onClick={e => handleVerify()} expand="block">Verify E-Mail
                        <Loading status={loading_status}></Loading>
                    </IonButton>
                    <IonButton href="/auth/login" slot="center" fill="outline" expand="block">Back to Login</IonButton>
                </IonCardContent>
            </IonCard>

            <IonCard color="warning" className="resend-mail-card" style={{ display: resend_error != '' ? "flex" : "none", marginTop: "10px"}}>
                <IonCardContent>
                    {resend_error}
                </IonCardContent>
            </IonCard>

            <IonCard className="resend-mail-card" style={{ display: display_resend_input ? "block" : "none", marginTop: "10px"}}>
                <IonCardContent>
                    <p>
                        If you didn't recieved an email. You can request a new one. 
                    </p>
                </IonCardContent>
                <IonCardContent>
                    <IonItem >
                        <IonLabel position="floating">E-Mail</IonLabel>
                        <IonInput type="email" id="email" value={resend_mail} onIonChange={(e: any) => set_resent_mail(e.target.value)} autofocus={true} />
                        <Loading status={check(resend_mail, "email").status} slot="end"></Loading>
                    </IonItem>

                    <IonButton expand="block" onClick={handleMailResend}>Resend Mail
                        <Loading status={resend_loading_status}></Loading>
                    </IonButton>
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default VerifyMailComponent;