import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useEffect, useState } from 'react';
import Loading from '../../loading';
import check from '../../../services/tests';
import { useLocation } from 'react-router';

interface ContainerProps { }

const ResetPassword: React.FC<ContainerProps> = () => {
    const [key, set_key] = useState('');
    const [email, set_email] = useState('');
    const [password, set_password] = useState('');
    const [second_password, set_second_password] = useState('');

    const [display_resnd_input, set_display_resnd_input] = useState(false);
    const [resend_mail, set_resend_mail] = useState('');
    const [resend_loading_status, set_resend_loading_status] = useState('');
    const [resend_error, set_resend_error] = useState('')

    var [display_error, set_display_error] = useState('');
    const [loading, set_loading] = useState('none');

    var query_mail = '';
    var query_key = '';
    const location = useLocation();

    useEffect(() => {
        query_mail = new URLSearchParams(location.search).get('m') || '';
        query_key = new URLSearchParams(location.search).get('k') || '';
        set_email(query_mail);
        set_resend_mail(query_mail);
        set_key(query_key);
    }, []);

    function handleReset() {
        if (!key) {
            set_display_error('Key Required');
            return;
        }
        else if (!email) {
            set_display_error('Email Required');
            return;
        }
        else if (!password) {
            set_display_error('Password Required');
            return;
        }
        else if (!second_password) {
            set_display_error('Second Password Required');
            return;
        }
        else if (password != second_password) {
            set_display_error('Passwords must match');
            return;
        }
        else if (!check(key, "key").success) {
            set_display_error('Key Format Invalid');
            return;
        }
        else if (!check(email, "email").success) {
            set_display_error('No Valid Email');
            return;
        }
        else if (!check(password, "password").success) {
            set_display_error('Password needs to have: \n\n- 8 to 32 Character\n\n- At least one letter: a-z, A-Z\n\n- At least one special Character: *!@$%&?/~_=|');
            return;
        }
        else if (!check(second_password, "password").success) {
            set_display_error('Password needs to have: \n\n- 8 to 32 Character\n\n- At least one letter: a-z, A-Z\n\n- At least one special Character: *!@$%&?/~_=|');
            return;
        }

        set_loading('loading');
        api.resetPassword({
            email: email,
            key: key,
            password: password,
            second_password: second_password
        })
            .then((response) => {
                set_loading('success');
                window.location.href = "auth/login"
            })
            .catch((error) => {
                set_loading('error');
                set_display_error(error.response.data.error || error.response.data.message || 'Unknown error');
                console.log(error);
            })
    }

    function handleMailResend() {
        if (!resend_mail) {
            set_resend_error('Email Required');
            return;
        }
        else if (!check(resend_mail, "email").success) {
            set_resend_error('No valid email');
            return;
        }

        set_resend_loading_status('loading');
        api.requestPasswordReset({
            email: resend_mail
        })
            .then((data) => {
                set_resend_loading_status('success');
            })
            .catch((error) => {
                set_resend_loading_status('error');
                set_resend_error(error.response.data.error || error.response.data.message || 'Unknown error');
                console.log(error);
            });
    }

    function checkPasswordRepeat() {
        if (password == second_password) {
            return "success";
        }
        else if (second_password == '') {
            return "none";
        }
        return "error";
    }

    return (
        <div>
            <IonCard class="reset_body">
                <IonCardHeader>
                    <IonCardTitle>Reset Password</IonCardTitle>
                </IonCardHeader>

                <IonItem color="warning" style={{ display: display_error != '' ? "block" : "none" }}>
                    <IonIcon icon={warningOutline}></IonIcon>
                    <IonLabel>
                        {display_error}
                    </IonLabel>
                </IonItem>

                <IonCardContent>
                    <IonItem>
                        <IonLabel position="floating">Key</IonLabel>
                        <IonInput value={key} onIonChange={(e: any) => set_key(e.target.value)} autofocus={true} />
                        <Loading status={check(key, "key").status} slot="end"></Loading>
                    </IonItem>
                    <IonButton fill="outline" expand="block" onClick={e => set_display_resnd_input(true)}>
                        Dont have a key?
                    </IonButton>
                    <IonItem>
                        <IonLabel position="floating">E-Mail</IonLabel>
                        <IonInput type="email" id="email" value={email} onIonChange={(e: any) => set_email(e.target.value)} autofocus={true} />
                        <Loading status={check(email, "email").status} slot="end"></Loading>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput type="password" name="password" value={password} onIonChange={(e: any) => set_password(e.target.value)}></IonInput>
                        <Loading status={check(password, "password").status} slot="end"></Loading>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Repeat Password</IonLabel>
                        <IonInput type="password" name="password" value={second_password} onIonChange={(e: any) => set_second_password(e.target.value)}></IonInput>
                        <Loading status={checkPasswordRepeat()} slot="end"></Loading>
                    </IonItem>
                    <IonButton onClick={e => handleReset()} expand="block">Reset Password<Loading status={loading} slot="end"></Loading></IonButton>
                    <IonButton href="/auth/login" fill="outline" expand="block">Back to Login</IonButton>
                </IonCardContent>
            </IonCard>

            <IonCard color="warning" className="resend-mail-card" style={{ display: resend_error != '' ? "flex" : "none", marginTop: "10px" }}>
                <IonCardContent>
                    {resend_error}
                </IonCardContent>
            </IonCard>

            <IonCard className="resend-mail-card" style={{ display: display_resnd_input ? "flex" : "none", marginTop: "10px" }}>
                <IonCardContent>
                    <IonItem >
                        <IonLabel position="floating">E-Mail</IonLabel>
                        <IonInput type="email" id="email" value={resend_mail} onIonChange={(e: any) => set_resend_mail(e.target.value)} autofocus={true} />
                        <Loading status={check(resend_mail, "email").status} slot="end"></Loading>
                    </IonItem>

                    <IonButton expand="block" onClick={handleMailResend}>Send Mail with Key
                        <Loading status={resend_loading_status}></Loading>
                    </IonButton>
                </IonCardContent>
            </IonCard>
        </div>
    );
};

export default ResetPassword;
