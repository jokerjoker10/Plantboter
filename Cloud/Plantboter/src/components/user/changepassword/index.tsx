import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter, IonSelect, IonSkeletonText } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useState } from 'react';
import Loading from '../../loading';

interface ContainerProps { }

const ChangePassword: React.FC<ContainerProps> = () => {
    const [email, set_email] = useState('');
    const [loading, set_loading] = useState('none');
    const [error, set_error] = useState('');

    useIonViewDidEnter(() => {
        api.getUser()
            .then((user) => {
                set_email(user.data.user.email);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    function handle_passwordchange(){
        set_loading('loading');

        api.requestPasswordReset({})
        .then((response) => {
            set_loading('success');
            localStorage.clear();
            window.location.href = "/auth/resetpassword?m=" + email;
        })
        .catch((error) => {
            set_loading('error');
            set_error(error.response.data.error.toString() || error.response.data.message || 'Unknown error');
        });
    }

    return (
        <IonCard class="user-card">
            <IonCardHeader>
                <IonCardTitle>Change Password</IonCardTitle>
            </IonCardHeader>

            <IonItem color="warning" style={{display: error != '' ? "block" : "none"}}>
                <p>
                    {error}
                </p>
            </IonItem>

            <IonCardContent>
                <p>
                    If you want to change your password we send an e-mail to you. This e-mail contains a key you have to enter.
                </p>
                <p>
                    After the password change you need to log-in again.
                </p>
                <IonButton onClick={e => handle_passwordchange()}>
                    Change Password
                    <Loading status={loading} slot="end"></Loading>
                </IonButton>
            </IonCardContent>
        </IonCard>
    );
};

export default ChangePassword;
